import ky from "ky";
import _ from "lodash";
import { NextRequest, NextResponse } from "next/server";
import { getAnimeEpisodes } from "aniwatch";
import { ANIME } from "@consumet/extensions";

import { AnifyEpisodes } from "@/types/anime";
import { Data, Episode, MalAnime } from "@/types/episode";
import { cache, anify } from "@/lib/anime";

export const revalidate = 0;

const gogoProvider = new ANIME.Gogoanime("https://anitaku.pe");

async function fetchMalSync(animeId: string) {
  try {
    const response = await ky.get(
      `https://api.malsync.moe/mal/anime/anilist:${animeId}`,
    );
    const data = await response.json<MalAnime>();

    let subUrl = "";
    let dubUrl = "";
    let hianimeUrl = "";

    if (data.Sites?.Gogoanime) {
      for (const key in data.Sites.Gogoanime) {
        const siteDetail =
          data.Sites.Gogoanime[key as keyof typeof data.Sites.Gogoanime];
        const cleanedUrl = siteDetail.url.replace(
          /https?:\/\/[^/]+\/category\//,
          "",
        );

        if (!siteDetail.title.includes("(Dub)") && !key.includes("dub")) {
          subUrl = cleanedUrl;
        }

        if (siteDetail.title.includes("(Dub)") || key.includes("dub")) {
          dubUrl = cleanedUrl;
        }
      }
    }

    if (data.Sites?.Zoro) {
      for (const key in data.Sites?.Zoro) {
        const siteDetail = data.Sites.Zoro[key as keyof typeof data.Sites.Zoro];

        const cleanedUrl = siteDetail.url.replace(/https?:\/\/[^/]+\//, "");

        hianimeUrl = cleanedUrl;
      }
    }

    return { subId: subUrl, dubId: dubUrl, hianimeId: hianimeUrl };
  } catch (error) {
    return {
      subId: "",
      dubId: "",
      hianimeId: "",
    };
  }
}

async function fetchEpisodeData(animeId: string) {
  const response = await ky.get(
    `https://api.ani.zip/mappings?anilist_id=${animeId}`,
  );
  const data = await response.json<Data>();

  return Object.values(data.episodes);
}

async function fetchAnimeEpisodes(animeId: string) {
  try {
    const { subId, dubId, hianimeId } = await fetchMalSync(animeId);

    const fetchEpisodes = async (gogoId: string) => {
      try {
        const response = await gogoProvider.fetchAnimeInfo(gogoId);

        return response.episodes || [];
      } catch (error) {
        return [];
      }
    };

    const [subEpisodes, dubEpisodes, hiAnimeEpisodes] = await Promise.all([
      subId !== "" ? fetchEpisodes(subId) : Promise.resolve([]),
      dubId !== "" ? fetchEpisodes(dubId) : Promise.resolve([]),
      hianimeId !== ""
        ? (await getAnimeEpisodes(hianimeId)).episodes
        : Promise.resolve([]),
    ]);

    return [
      {
        providerId: "gogoanime",
        sub: subEpisodes.map((episode) => _.omit(episode, ["number", "url"])),
        dub: dubEpisodes.map((episode) => _.omit(episode, ["number", "url"])),
      },
      {
        providerId: "hianime",
        sub: hiAnimeEpisodes.map((anime) => ({
          id: anime.episodeId,
          isFiller: anime.isFiller,
        })),
        dub:
          dubEpisodes.length > 0
            ? hiAnimeEpisodes
                .map((anime) => ({
                  id: anime.episodeId,
                  isFiller: anime.isFiller,
                }))
                .slice(0, dubEpisodes.length)
            : [],
      },
    ];
  } catch (error) {
    return [
      { providerId: "gogoanime", sub: [], dub: [] },
      { providerId: "hianime", sub: [], dub: [] },
    ];
  }
}

async function mergeEpisodesWithMetadata(
  episodeData: Episode[],
  providerEpisodes: { providerId: string; sub: any[]; dub: any[] }[],
) {
  function mapEpisodes(episodes: any[], metadata: Episode[]) {
    return episodes.map((episode, index) => {
      const meta = metadata.find(
        (metaItem) => metaItem.episodeNumber === index + 1,
      );

      return {
        id: episode.id,
        number: index + 1,
        description: meta?.summary ?? meta?.overview ?? "No Description",
        isFiller: episode.isFiller || false,
        released: meta?.airDateUtc ?? "",
        rating: meta?.rating ?? 0,
        thumbnail: episode.img ?? episode.image ?? meta?.image ?? "",
        title:
          meta?.title.en ??
          meta?.title["x-jat"] ??
          meta?.title.ja ??
          `Episode ${index + 1}`,
        duration: meta?.length ?? episode.duration ?? 0,
        season: meta?.seasonNumber ?? 1,
        tvdbId: meta?.tvdbId ?? 0,
      };
    });
  }

  const mergedEpisodes = providerEpisodes.map((providerData) => ({
    providerId: providerData.providerId,
    episodes: {
      sub: mapEpisodes(providerData.sub, episodeData),
      dub: mapEpisodes(providerData.dub, episodeData),
    },
  }));

  return mergedEpisodes.length > 0 ? mergedEpisodes : null;
}

async function fetchAnifyEpisodes(animeId: string) {
  try {
    const response = await anify.get(`episodes/${animeId}`);
    const anifyData = await response.json<AnifyEpisodes[]>();

    return {
      sudatchi: anifyData.find(
        (provider) => provider.providerId === "sudatchi",
      ),
      animepahe: anifyData.find(
        (provider) => provider.providerId === "animepahe",
      ),
    };
  } catch (error) {
    return {
      sudatchi: { providerId: "sudatchi", episodes: [] } as
        | AnifyEpisodes
        | undefined,
      animepahe: { providerId: "animepahe", episodes: [] } as
        | AnifyEpisodes
        | undefined,
    };
  }
}

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const cacheKey = `episodes:${params.id};`;

  const cachedData = await cache.get(cacheKey);

  if (cachedData) return NextResponse.json(JSON.parse(cachedData as string));

  const [episodes, episodeData, anifyEpisodes] = await Promise.all([
    fetchAnimeEpisodes(params.id),
    fetchEpisodeData(params.id),
    fetchAnifyEpisodes(params.id),
  ]);

  const anifyFormattedEpisodes = [
    {
      providerId: "sudatchi",
      sub: anifyEpisodes.sudatchi?.episodes || [],
      dub:
        episodes.find((p) => p.providerId === "gogoanime")?.dub.length! > 0
          ? anifyEpisodes.sudatchi?.episodes.slice(
              0,
              episodes.find((p) => p.providerId === "gogoanime")?.dub.length,
            ) || []
          : [],
    },
    {
      providerId: "animepahe",
      sub: anifyEpisodes.animepahe?.episodes || [],
      dub:
        episodes.find((p) => p.providerId === "gogoanime")?.dub.length! > 0
          ? anifyEpisodes.animepahe?.episodes.slice(
              0,
              episodes.find((p) => p.providerId === "gogoanime")?.dub.length,
            ) || []
          : [],
    },
  ];

  const finalEpisodes = await mergeEpisodesWithMetadata(episodeData, [
    ...episodes,
    ...anifyFormattedEpisodes,
  ]);

  await cache.set(cacheKey, JSON.stringify(finalEpisodes), 3600);

  return NextResponse.json(finalEpisodes);
};
