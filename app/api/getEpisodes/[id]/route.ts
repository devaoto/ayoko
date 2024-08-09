/* eslint-disable no-console */
import _ from "lodash"; // lodash is a utility library for common programming tasks.
import { NextRequest, NextResponse } from "next/server"; // Next.js request and response objects.
import ky from "ky"; // ky is a lightweight HTTP client for making requests.

import {
  type MalSync,
  type AniZipData,
  type ConsumetEpisode,
  type Episodes,
  type ProviderData,
  type GogoAnimeInfo,
  type HiAnimeEpisode,
  type HiAnimeEpisodesData,
  AniProvider,
  EpisodeReturn,
} from "@/types/episode"; // Importing custom TypeScript types.
import { ANIFY_URL, MALSYNC_URL } from "@/config/api";
import { cache } from "@/lib/anime";

export const revalidate = 0; // Disable default NextJS caching

const bky = ky.extend({
  timeout: 9000, // Set a timeout of 9 seconds for all requests using this ky instance.
});

const getMalSync = async (
  id: string,
): Promise<{ sub: string; dub: string; hianime: string }> => {
  try {
    const res = await bky.get(`${MALSYNC_URL}${id}`); // Fetch MalSync data for the given id.
    const data = await res.json<MalSync>(); // Parse the response as MalSync.

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
        ); // Clean the URL to remove the base part.

        if (!siteDetail.title.includes("Dub") && !key.includes("dub")) {
          subUrl = cleanedUrl; // Set subUrl if title does not include "Dub".
        }

        if (siteDetail.title.includes("(Dub)") || key.includes("dub")) {
          dubUrl = cleanedUrl; // Set dubUrl if title includes "Dub".
        }
      }
    }

    if (data.Sites?.Zoro) {
      for (const key in data.Sites?.Zoro) {
        const siteDetail = data.Sites.Zoro[key as keyof typeof data.Sites.Zoro];

        const cleanedUrl = siteDetail.url.replace(/https?:\/\/[^/]+\//, "");

        hianimeUrl = cleanedUrl; // Set hianimeUrl for Zoro site.
      }
    }

    return { sub: subUrl, dub: dubUrl, hianime: hianimeUrl }; // Return the URLs.
  } catch (error) {
    console.error("Error fetching data:", error);

    return { sub: "", dub: "", hianime: "" }; // Return empty URLs in case of an error.
  }
};

const getGogoAnime = async (id: string) => {
  try {
    const res = await bky.get(
      `${process.env.CONSUMET_API}/anime/gogoanime/info/${id}`,
    ); // Fetch GogoAnime info for the given id.
    const data = await res.json<GogoAnimeInfo>(); // Parse the response as GogoAnimeInfo.

    if (!data || !data.episodes) return [];

    return data.episodes; // Return the episodes.
  } catch (error) {
    return [];
  }
};

const getHiAnime = async (id: string) => {
  try {
    const res = await bky.get(
      `${process.env.HIANIME_API}/anime/episodes/${id}`,
    ); // Fetch HiAnime episodes for the given id.

    const data = await res.json<HiAnimeEpisodesData>(); // Parse the response as HiAnimeEpisodesData.

    return data.episodes; // Return the episodes.
  } catch {
    return [];
  }
};

const getAnify = async (id: string) => {
  try {
    const response = await bky.get(`${ANIFY_URL}/episodes/${id}`);

    const data = await response.json<AniProvider[]>();

    const sudatchi = (data.find(
      (provider) => provider.providerId === "sudatchi",
    ) as AniProvider) || { episodes: [], providerId: "sudatchi" };

    const nineAnime = (data.find(
      (provider) => provider.providerId === "9anime",
    ) as AniProvider) || { episodes: [], providerId: "9anime" };

    const animePahe = (data.find(
      (provider) => provider.providerId === "animepahe",
    ) as AniProvider) || { episodes: [], providerId: "animepahe" };

    return {
      animePahe,
      nineAnime,
      sudatchi,
    };
  } catch (error) {
    console.error("Error fetching anify", error);

    return {
      animePahe: { episodes: [], providerId: "animepahe" },
      nineAnime: { episodes: [], providerId: "9anime" },
      sudatchi: { episodes: [], providerId: "sudatchi" },
    };
  }
};

const getMetadata = async (id: string) => {
  try {
    const res = await bky.get(`https://api.ani.zip/mappings?anilist_id=${id}`);
    const data = await res.json<AniZipData>(); // Fetch AniZip data for the given id.

    if (!data || !data.episodes) return {};

    return data.episodes; // Return the episodes.
  } catch (error) {
    console.error("An error occurred while fetching anime data", error);

    return {};
  }
};

const combineMetadataAndEpisodes = (
  consumetResponse: ProviderData[],
  metadataResponse: Episodes,
): EpisodeReturn[] => {
  _.forEach(consumetResponse, (provider) => {
    _.forEach(["sub", "dub"], (type) => {
      // @ts-ignore
      provider.episodes[type as "sub" | "dub"] = _.map(
        provider.episodes[type as "sub" | "dub"],
        (episode: _.Omit<ConsumetEpisode, "imageHash">, i) => {
          const metadataEpisode = metadataResponse[episode.number];

          if (metadataEpisode) {
            const title =
              metadataEpisode.title.en ||
              metadataEpisode.title["x-jat"] ||
              metadataEpisode.title.ja; // Prioritize title in different languages.

            return {
              id:
                episode.id || (episode as unknown as HiAnimeEpisode).episodeId, // Handle id or episodeId based on type.
              number: episode.number || i + 1,
              title: title ?? null,
              image: metadataEpisode.image ?? null,
              description: metadataEpisode.overview ?? null,
              rating: isNaN(Number(metadataEpisode.rating))
                ? 0
                : Number(metadataEpisode.rating),
              season: metadataEpisode.seasonNumber ?? 1,
              createdAt: metadataEpisode.airDateUtc ?? "",
            };
          } else {
            return {
              id:
                episode.id || (episode as unknown as HiAnimeEpisode).episodeId,
              number: episode.number || i + 1,
              title: episode.title ?? null,
              image:
                episode.image || (episode as unknown as { img: string }).img,
              description: episode.description ?? null,
              rating: 0,
              season: 1,
              createdAt: "",
            }; // Return episode with null values if no metadata found.
          }
        },
      ) as {
        title: string;
        image: string | null;
        description: string | null;
        rating: string;
        createdAt: string;
        number: number;
        id: string;
        url: string;
      }[];
    });
  });

  return consumetResponse as unknown as EpisodeReturn[];
};

export const getEpisodes = async (id: string) => {
  const [meta, malsync, anify] = await Promise.all([
    getMetadata(id),
    getMalSync(id),
    getAnify(id),
  ]); // Fetch consumet, metadata, and malsync data in parallel.

  const [sub, dub, hianime] = await Promise.all([
    malsync.sub !== "" ? getGogoAnime(malsync.sub) : Promise.resolve([]),
    malsync.dub !== "" ? getGogoAnime(malsync.dub) : Promise.resolve([]),
    malsync.hianime !== "" ? getHiAnime(malsync.hianime) : Promise.resolve([]),
  ]); // Fetch sub, dub, and hianime episodes based on malsync URLs.

  const combinedSubAndDub: ProviderData = {
    providerId: "gogoanime",
    episodes: {
      sub: [...sub] as _.Omit<ConsumetEpisode, "imageHash">[],
      dub: [...dub] as _.Omit<ConsumetEpisode, "imageHash">[],
    },
  };

  // Combine episodes from different providers.
  const combinedHiAnime: ProviderData = {
    providerId: "hianime",
    episodes: {
      sub: [...hianime] as unknown as _.Omit<ConsumetEpisode, "imageHash">[],
      dub:
        dub.length > 0
          ? (
              [...hianime] as unknown as _.Omit<ConsumetEpisode, "imageHash">[]
            ).slice(0, dub.length) // Slice the episodes based on dub length.
          : ([] as _.Omit<ConsumetEpisode, "imageHash">[]),
    },
  };

  const combinedSudatchi: ProviderData = {
    providerId: "sudatchi",
    episodes: {
      sub:
        (anify.sudatchi.episodes as unknown as _.Omit<
          ConsumetEpisode,
          "imageHash"
        >[]) ?? [],
      dub:
        dub.length > 0
          ? (
              anify.sudatchi.episodes as unknown as _.Omit<
                ConsumetEpisode,
                "imageHash"
              >[]
            ).slice(0, dub.length)
          : ([] as _.Omit<ConsumetEpisode, "imageHash">[]),
    },
  };

  const combinedNineAnime: ProviderData = {
    providerId: "9anime",
    episodes: {
      sub: anify.nineAnime.episodes as unknown as _.Omit<
        ConsumetEpisode,
        "imageHash"
      >[],
      dub:
        dub.length > 0
          ? (
              anify.nineAnime.episodes as unknown as _.Omit<
                ConsumetEpisode,
                "imageHash"
              >[]
            ).slice(0, dub.length)
          : ([] as _.Omit<ConsumetEpisode, "imageHash">[]),
    },
  };

  const combinedAnimePahe: ProviderData = {
    providerId: "animepahe",
    episodes: {
      sub: anify.animePahe.episodes as unknown as _.Omit<
        ConsumetEpisode,
        "imageHash"
      >[],
      dub:
        dub.length > 0
          ? (
              anify.animePahe.episodes as unknown as _.Omit<
                ConsumetEpisode,
                "imageHash"
              >[]
            ).slice(0, dub.length)
          : ([] as _.Omit<ConsumetEpisode, "imageHash">[]),
    },
  };

  return combineMetadataAndEpisodes(
    [
      combinedHiAnime,
      combinedSudatchi,
      combinedNineAnime,
      combinedAnimePahe,
      combinedSubAndDub,
    ],
    meta,
  ); // Combine metadata and episodes.
};
export const GET = async (
  _request: NextRequest,
  { params }: { params: { id: string } },
) => {
  // Define a cache key based on the episode ID
  const cacheKey = `episodes:${params.id}`;

  // Check if the cache has a value for the given cache key
  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    !JSON.parse(cache.get(cacheKey)!)[0].providerId
  ) {
    // If the cached value exists but has no providerId, remove it from the cache
    cache.del(cacheKey);

    // Refetch episodes from the source and return the response
    return NextResponse.json(await getEpisodes(params.id));
  }

  // If the cache has a valid value for the given cache key
  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    (JSON.parse(cache.get(cacheKey)!) as EpisodeReturn[]).length
  ) {
    // Return the cached episodes as the response
    return NextResponse.json(
      JSON.parse(cache.get(cacheKey)!) as EpisodeReturn[],
    );
  }

  // Fetch episodes from the source if not found in cache
  const episodes = await getEpisodes(params.id);

  // Store the fetched episodes in cache with a TTL of 24 hours
  cache.set(cacheKey, JSON.stringify(episodes), 60 * 60 * 24);

  // Return the fetched episodes as the response
  return NextResponse.json(episodes);
};
