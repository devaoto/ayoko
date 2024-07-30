import ky from "ky";
import NodeCache from "node-cache";

import { Spotlight } from "@/types/spotlight";
import { ANIFY_URL } from "@/config/api";
import { AnimeCard } from "@/types/cards";

export const dynamicParams = false;

const cache = new NodeCache({ stdTTL: 5 * 1800 });

const noCacheFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const customInit = { ...init, cache: "no-store" } as RequestInit;

  return fetch(input, customInit);
};

const anify = ky.create({
  prefixUrl: ANIFY_URL,
  timeout: 9000,
  fetch: noCacheFetch,
});

export async function getSpotlight(): Promise<Spotlight[]> {
  const cacheKey = "spotlight";

  if (cache.get(cacheKey) && typeof cache.get(cacheKey) === "string") {
    return JSON.parse(cache.get(cacheKey)!) as Spotlight[];
  }

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    JSON.parse(cache.get(cacheKey)!).length <= 0
  ) {
    cache.del(cacheKey);

    return await getSpotlight();
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
  const cacheKey = "trending";

  if (cache.get(cacheKey) && typeof cache.get(cacheKey) === "string") {
    return JSON.parse(cache.get(cacheKey)!) as AnimeCard[];
  }

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    JSON.parse(cache.get(cacheKey)!).length <= 0
  ) {
    cache.del(cacheKey);

    return await getTrending();
  }

  const res = await anify.get(
    "seasonal/anime?fields=[id,title,bannerImage,description,artwork,trailer,coverImage,season]",
  );

  const data = await res.json<{ trending: AnimeCard[] }>();
  const trending: AnimeCard[] = data.trending;

  cache.set(cacheKey, JSON.stringify(trending));

  return trending;
}

export const getPopular = async (): Promise<AnimeCard[]> => {
  const cacheKey = "popular";

  if (cache.get(cacheKey) && typeof cache.get(cacheKey) === "string") {
    return JSON.parse(cache.get(cacheKey)!) as AnimeCard[];
  }

  if (
    cache.get(cacheKey) &&
    typeof cache.get(cacheKey) === "string" &&
    JSON.parse(cache.get(cacheKey)!).length <= 0
  ) {
    cache.del(cacheKey);

    return await getPopular();
  }

  const res = await anify.get(
    "seasonal/anime?fields=[id,title,bannerImage,description,artwork,trailer,coverImage,season]",
  );

  const data = await res.json<{ popular: AnimeCard[] }>();
  const popular: AnimeCard[] = data.popular;

  cache.set(cacheKey, JSON.stringify(popular));

  return popular;
};
