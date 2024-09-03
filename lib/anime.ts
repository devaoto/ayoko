import ky from "ky";
import NodeCache from "node-cache";

import { Spotlight } from "@/types/spotlight";
import { ANIFY_URL } from "@/config/api";
import { AnimeCard } from "@/types/cards";
import { IAnime } from "@/types/info";
import { ReturnData } from "@/types/sources";

export const dynamicParams = false;

export const cache = new NodeCache({ stdTTL: 5 * 60 * 60 });

const noCacheFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const customInit = { ...init, cache: "no-store" } as RequestInit;

  return fetch(input, customInit);
};

export const anify = ky.create({
  prefixUrl: ANIFY_URL,
  fetch: noCacheFetch,
  timeout: 120 * 1000,
});

export const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:${process.env.PORT ?? "3000"}`
    : process.env.VERCEL_URL
      ? process.env.VERCEL_URL
      : process.env.URL
        ? process.env.URL
        : process.env.DOMAIN;

const server = ky.create({
  prefixUrl: `${SERVER_URL}/api`,
  fetch: noCacheFetch,
  timeout: 120 * 1000,
});

export async function getSeasonal(): Promise<{
  trending: AnimeCard[];
  top: AnimeCard[];
  popular: AnimeCard[];
}> {
  const cacheKey = "trending:anime";

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    JSON.parse(cache.get(cacheKey)!).length <= 0
  ) {
    cache.del(cacheKey);

    return await getSeasonal();
  }

  if (cache.get(cacheKey) && typeof cache.get(cacheKey) === "string") {
    return JSON.parse(cache.get(cacheKey)!) as {
      trending: AnimeCard[];
      top: AnimeCard[];
      popular: AnimeCard[];
    };
  }

  const res = await anify.get(
    "seasonal/anime?fields=[id,title,bannerImage,status,description,artwork,trailer,coverImage,season,color]",
  );

  const data = await res.json<{
    trending: AnimeCard[];
    top: AnimeCard[];
    popular: AnimeCard[];
  }>();

  cache.set(cacheKey, JSON.stringify(data));

  return data;
}

export type AnimeType = IAnime & {
  startDate: { day: number; month: number; year: number } | null;
  studios: {
    edges: {
      id: number;
      isMain: boolean;
      node: {
        id: number;
        name: string;
        isAnimationStudio: boolean;
        favourites: number;
      };
    }[];
  };
};

export const getInfo = async (id: string): Promise<AnimeType> => {
  const cacheKey = `info:${id}`;

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    !(JSON.parse(cache.get(cacheKey)!) as AnimeType).id
  ) {
    cache.del(cacheKey);

    return await getInfo(id);
  }

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    (JSON.parse(cache.get(cacheKey)!) as AnimeType).id
  ) {
    return JSON.parse(cache.get(cacheKey)!) as AnimeType;
  }

  const query = `
      query ($mediaId: Int, $isMain: Boolean) {
      Media(id: $mediaId) {
        startDate {
          year
          month
          day
        }
        studios(isMain: $isMain) {
          edges {
            id
            isMain
            node {
              id
              name
              isAnimationStudio
              favourites
            }
          }
        }
      }
    }`;

  const [res, res1] = await Promise.all([
    anify.get(
      `info/${id}?fields=[id,title,coverImage,bannerImage,currentEpisode,totalEpisodes,status,season,trailer,countryOfOrigin,synonyms,popularity,year,duration,description,format,characters,genres]`,
    ),
    ky.post("https://graphql.anilist.co", {
      cache: "no-store",
      json: {
        query,
        variables: {
          mediaId: id,
          isMain: true,
        },
      },
    }),
  ]);

  const data = await res.json<IAnime>();
  const data1 = await res1.json<{
    data: {
      Media: {
        startDate: { day: number; month: number; year: number } | null;
        studios: {
          edges: {
            id: number;
            isMain: boolean;
            node: {
              id: number;
              name: string;
              isAnimationStudio: boolean;
              favourites: number;
            };
          }[];
        };
      };
    };
  }>();

  const finalData = {
    ...data,
    ...data1.data.Media,
  };

  cache.set(cacheKey, JSON.stringify(finalData));

  return finalData;
};

export const getEpisodes = async (id: string): Promise<any[]> => {
  const cacheKey = `episodes:${id}`;

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    !JSON.parse(cache.get(cacheKey)!)[0].providerId
  ) {
    cache.del(cacheKey);

    return await getEpisodes(id);
  }

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    (JSON.parse(cache.get(cacheKey)!) as any[]).length
  ) {
    return JSON.parse(cache.get(cacheKey)!) as any[];
  }

  const res = await server.get(`getEpisodes/${id}`);

  const data = await res.json<any[]>();

  cache.set(cacheKey, JSON.stringify(data));

  return data;
};

export const getSources = async (
  id: string,
  provider: string,
  watchId: string,
  episodeNumber: string,
  subType: string,
): Promise<ReturnData> => {
  const cacheKey = `sources:${id}:${provider}:${watchId}:${episodeNumber}:${subType}`;

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    !(JSON.parse(cache.get(cacheKey)!) as ReturnData).sources[0].url
  ) {
    cache.del(cacheKey);

    return await getSources(id, provider, watchId, episodeNumber, subType);
  }

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    (JSON.parse(cache.get(cacheKey)!) as ReturnData).sources.length
  ) {
    return JSON.parse(cache.get(cacheKey)!) as ReturnData;
  }

  const res = await server.get(
    `getSources/${id}?provider=${provider}&watchId=${watchId}&episodeNumber=${episodeNumber}&subType=${subType}`,
  );

  const data = await res.json<ReturnData>();

  cache.set(cacheKey, JSON.stringify(data), 60 * 60);

  return data;
};
