import { use } from "react";

import { Hero } from "@/components/home/spotlight";
import { getPopular, getSpotlight, getTrending } from "@/lib/anime";
import { Cards } from "@/components/home/cards";

export default function Home() {
  const [spotlight, trending, popular] = use(
    Promise.all([getSpotlight(), getTrending(), getPopular()]),
  );

  return (
    <div>
      <Hero anime={spotlight} />
      <div className="mt-10">
        <h1 className="mb-2 select-none text-3xl font-bold">Trending Anime</h1>
        <Cards animes={trending} />
      </div>
      <div className="mt-10">
        <h1 className="mb-2 select-none text-3xl font-bold">
          All Time Popular
        </h1>
        <Cards animes={popular} />
      </div>
    </div>
  );
}
