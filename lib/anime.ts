import ky from "ky";
import NodeCache from "node-cache";

import { Spotlight } from "@/types/spotlight";
import { ANIFY_URL } from "@/config/api";
import { AnimeCard } from "@/types/cards";
import { IAnime } from "@/types/info";
import { EpisodeReturn } from "@/types/episode";

export const dynamicParams = false;

export const cache = new NodeCache({ stdTTL: 5 * 60 * 60 });

const noCacheFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const customInit = { ...init, cache: "no-store" } as RequestInit;

  return fetch(input, customInit);
};

const anify = ky.create({
  prefixUrl: ANIFY_URL,
  fetch: noCacheFetch,
  timeout: 120 * 1000,
});

const server = ky.create({
  prefixUrl: `${process.env.DOMAIN}/api`,
  fetch: noCacheFetch,
  timeout: 120 * 1000,
});

export async function getSpotlight(): Promise<Spotlight[]> {
  const cacheKey = "spotlight";

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    JSON.parse(cache.get(cacheKey)!).length <= 0
  ) {
    cache.del(cacheKey);

    return await getSpotlight();
  }

  if (cache.get(cacheKey) && typeof cache.get(cacheKey) === "string") {
    return JSON.parse(cache.get(cacheKey)!) as Spotlight[];
  }

  const res = await anify.get(
    "seasonal/anime?fields=[id,title,bannerImage,description,artwork,trailer]",
  );

  const data = await res.json<{ trending: Spotlight[] }>();
  const spotlight: Spotlight[] = data.trending;

  cache.set(cacheKey, JSON.stringify(spotlight));

  return spotlight;
}

export async function getTrending(): Promise<AnimeCard[]> {
  const cacheKey = "trending:anime";

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    JSON.parse(cache.get(cacheKey)!).length <= 0
  ) {
    cache.del(cacheKey);

    return await getTrending();
  }

  if (cache.get(cacheKey) && typeof cache.get(cacheKey) === "string") {
    return JSON.parse(cache.get(cacheKey)!) as AnimeCard[];
  }

  const res = await anify.get(
    "seasonal/anime?fields=[id,title,bannerImage,status,description,artwork,trailer,coverImage,season]",
  );

  const data = await res.json<{ trending: AnimeCard[] }>();
  const trending: AnimeCard[] = data.trending;

  cache.set(cacheKey, JSON.stringify(trending));

  return trending;
}

export const getPopular = async (): Promise<AnimeCard[]> => {
  const cacheKey = "popular:anime";

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    JSON.parse(cache.get(cacheKey)!).length <= 0
  ) {
    cache.del(cacheKey);

    return await getPopular();
  }

  if (cache.get(cacheKey) && typeof cache.get(cacheKey) === "string") {
    return JSON.parse(cache.get(cacheKey)!) as AnimeCard[];
  }

  const res = await anify.get(
    "seasonal/anime?fields=[id,title,bannerImage,status,description,artwork,trailer,coverImage,season]",
  );

  const data = await res.json<{ popular: AnimeCard[] }>();
  const popular: AnimeCard[] = data.popular;

  cache.set(cacheKey, JSON.stringify(popular));

  return popular;
};

export const getInfo = async (id: string): Promise<IAnime> => {
  const cacheKey = `info:${id}`;

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    !(JSON.parse(cache.get(cacheKey)!) as IAnime).id
  ) {
    cache.del(cacheKey);

    return await getInfo(id);
  }

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    (JSON.parse(cache.get(cacheKey)!) as IAnime).id
  ) {
    return JSON.parse(cache.get(cacheKey)!) as IAnime;
  }

  const res = await anify.get(
    `info/${id}?fields=[id,title,coverImage,bannerImage,currentEpisode,totalEpisodes,status,season,trailer,countryOfOrigin,synonyms,popularity,year,duration,description,format,characters,genres]`,
  );

  const data = await res.json<IAnime>();

  cache.set(cacheKey, JSON.stringify(data));

  return data;
};

export const getEpisodes = async (id: string): Promise<EpisodeReturn[]> => {
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
    (JSON.parse(cache.get(cacheKey)!) as EpisodeReturn[]).length
  ) {
    return JSON.parse(cache.get(cacheKey)!) as EpisodeReturn[];
  }

  const res = await server.get(`getEpisodes/${id}`);

  const data = await res.json<EpisodeReturn[]>();

  cache.set(cacheKey, JSON.stringify(data));

  return data;
};
