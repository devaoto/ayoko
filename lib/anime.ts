import ky from "ky";

import { Spotlight } from "@/types/spotlight";
import { ANIFY_URL } from "@/config/api";

export const dynamicParams = false;

const noCacheFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const customInit = { ...init, cache: "no-store" };
  // @ts-ignore

  return fetch(input, customInit);
};

const anify = ky.create({
  prefixUrl: ANIFY_URL,
  timeout: 9000,
  fetch: noCacheFetch,
});

export async function getSpotlight(): Promise<Spotlight[]> {
  const res = await anify.get(
    "seasonal/anime?fields=[id,title,bannerImage,description,artwork,trailer]",
  );
  const data = await res.json<{ trending: Spotlight[] }>();

  const spotlight: Spotlight[] = data.trending;

  return spotlight;
}
