import { use } from "react";

import { Hero } from "@/components/home/spotlight";
import { getSeasonal } from "@/lib/anime";
import { Cards } from "@/components/home/cards";
import { Navbar } from "@/components/navbar";
import ContinueWatching from "@/components/home/continueWatching";
import { CompactCards } from "@/components/home/compactCard";

export default function Home() {
  const seasonal = use(getSeasonal());

  return (
    <>
      <Navbar navFor="home" />
      <div className="relative mb-32 flex h-screen min-h-screen flex-col sm:mb-0">
        <Hero anime={seasonal.trending} />
        <div className="container flex-grow px-4 py-8">
          <ContinueWatching />
          <div className="mt-10">
            <h1 className="mb-2 select-none text-3xl font-bold">
              Trending Anime
            </h1>
            <Cards animes={seasonal.trending} />
          </div>

          <div className="mt-10">
            <h1 className="mb-2 select-none text-3xl font-bold">
              Popular This Season
            </h1>
            <Cards animes={seasonal.popularThisSeason} />
          </div>
          <div className="mt-10">
            <h1 className="mb-2 select-none text-3xl font-bold">
              Upcoming Next
            </h1>
            <Cards animes={seasonal.popularNextSeason} />
          </div>
          <div className="mt-10">
            <h1 className="mb-2 select-none text-3xl font-bold">
              Top 10 Anime
            </h1>
            <CompactCards anime={seasonal.top} />
          </div>
          <div className="mt-10">
            <h1 className="mb-2 select-none text-3xl font-bold">
              All Time Popular
            </h1>
            <Cards animes={seasonal.popular} />
          </div>
          <div className="mt-10">
            <h1 className="mb-2 select-none text-3xl font-bold">
              Popular Anime Movies
            </h1>
            <Cards animes={seasonal.popularMovies} />
          </div>
        </div>
      </div>
    </>
  );
}
