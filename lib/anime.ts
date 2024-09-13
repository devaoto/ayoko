import ky from "ky";
import NodeCache from "node-cache";

import { getSeason } from "./utils";

import { ANIFY_URL } from "@/config/api";
import { IAnime } from "@/types/info";
import { ReturnData } from "@/types/sources";

export const dynamicParams = false

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
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.URL
        ? process.env.URL
        : process.env.DOMAIN;

const server = ky.create({
  prefixUrl: `${SERVER_URL}/api`,
  fetch: noCacheFetch,
  timeout: 120 * 1000,
});

export type AnimeSeasonal = {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native: string;
  };
  bannerImage?: string;
  status: string;
  description?: string;
  coverImage: {
    extraLarge: string;
    large: string;
    medium: string;
    color?: string;
  };
  season: string;
  trailer?: {
    id: string;
    site: string;
  };
  averageScore?: number;
  format?: string;
  episodes?: number;
};

export type AnimeSeasonalModified = {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native: string;
  };
  bannerImage?: string;
  status: string;
  description?: string;
  coverImage: string;
  color?: string;
  season: string;
  trailer?: string;
  averageScore?: number;
  format?: string;
  episodes?: number;
};

export type SeasonalData = {
  trending: AnimeSeasonalModified[];
  top: AnimeSeasonalModified[];
  popular: AnimeSeasonalModified[];
  popularThisSeason: AnimeSeasonalModified[];
  popularNextSeason: AnimeSeasonalModified[];
  popularMovies: AnimeSeasonalModified[];
};

export async function getSeasonal(): Promise<SeasonalData> {
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
    return JSON.parse(cache.get(cacheKey)!) as SeasonalData;
  }

  const currentSeason = getSeason(new Date());

  const nextSeasonDate = new Date();

  nextSeasonDate.setMonth(nextSeasonDate.getMonth() + 3);

  const nextSeason = getSeason(nextSeasonDate);

  const query = `
  query {
    trending: Page(perPage: 50) {
      media(sort: TRENDING_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        bannerImage
        status
        description
        coverImage {
          extraLarge
          large
          medium
          color
        }
        season
        trailer {
          id
          site
        }
      }
    }
    top: Page(perPage: 10) {
      media(sort: SCORE_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        averageScore
        format
        episodes
        bannerImage
        status
        description
        coverImage {
          extraLarge
          large
          medium
          color
        }
        season
        trailer {
          id
          site
        }
      }
    }
    popular: Page(perPage: 50) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        bannerImage
        status
        description
        coverImage {
          extraLarge
          large
          medium
          color
        }
        season
        trailer {
          id
          site
        }
      }
    }
    popularThisSeason: Page(perPage: 50) {
      media(season: ${currentSeason.season}, seasonYear: ${currentSeason.year}, sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        bannerImage
        status
        description
        coverImage {
          extraLarge
          large
          medium
          color
        }
        season
        trailer {
          id
          site
        }
      }
    }
    popularNextSeason: Page(perPage: 50) {
      media(season: ${nextSeason.season}, seasonYear: ${nextSeason.year}, sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        bannerImage
        status
        description
        coverImage {
          extraLarge
          large
          medium
          color
        }
        season
        trailer {
          id
          site
        }
      }
    }
    popularMovies: Page(perPage: 50) {
      media(sort: POPULARITY_DESC, type: ANIME, format: MOVIE) {
        id
        title {
          romaji
          english
          native
        }
        bannerImage
        status
        description
        coverImage {
          extraLarge
          large
          medium
          color
        }
        season
        trailer {
          id
          site
        }
      }
    }
  }
`;

  const res = await ky.post("https://graphql.anilist.co", {
    json: { query },
  });

  const json = await res.json<{
    data: {
      trending: { media: AnimeSeasonal[] };
      top: { media: AnimeSeasonal[] };
      popular: { media: AnimeSeasonal[] };
      popularThisSeason: { media: AnimeSeasonal[] };
      popularNextSeason: { media: AnimeSeasonal[] };
      popularMovies: { media: AnimeSeasonal[] };
    };
  }>();

  const data: SeasonalData = {
    trending: json.data.trending.media.map((e) => ({
      ...e,
      color: e.coverImage.color,
      coverImage:
        e.coverImage.extraLarge || e.coverImage.large || e.coverImage.medium,
      trailer: `https://www.youtube.com/watch?v=${e.trailer?.id}`,
    })),
    top: json.data.top.media.map((e) => ({
      ...e,
      color: e.coverImage.color,
      coverImage:
        e.coverImage.extraLarge || e.coverImage.large || e.coverImage.medium,
      trailer: `https://www.youtube.com/watch?v=${e.trailer?.id}`,
    })),
    popular: json.data.popular.media.map((e) => ({
      ...e,
      color: e.coverImage.color,
      coverImage:
        e.coverImage.extraLarge || e.coverImage.large || e.coverImage.medium,
      trailer: `https://www.youtube.com/watch?v=${e.trailer?.id}`,
    })),
    popularThisSeason: json.data.popularThisSeason.media.map((e) => ({
      ...e,
      color: e.coverImage.color,
      coverImage:
        e.coverImage.extraLarge || e.coverImage.large || e.coverImage.medium,
      trailer: `https://www.youtube.com/watch?v=${e.trailer?.id}`,
    })),
    popularNextSeason: json.data.popularNextSeason.media.map((e) => ({
      ...e,
      color: e.coverImage.color,
      coverImage:
        e.coverImage.extraLarge || e.coverImage.large || e.coverImage.medium,
      trailer: `https://www.youtube.com/watch?v=${e.trailer?.id}`,
    })),
    popularMovies: json.data.popularMovies.media.map((e) => ({
      ...e,
      color: e.coverImage.color,
      coverImage:
        e.coverImage.extraLarge || e.coverImage.large || e.coverImage.medium,
      trailer: `https://www.youtube.com/watch?v=${e.trailer?.id}`,
    })),
  };

  cache.set(cacheKey, JSON.stringify(data));

  return data;
}

export type AnimeType = IAnime & {
  idMal: string;
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
        idMal
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
        idMal: string;
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
