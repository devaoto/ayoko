import { use } from "react";

import { Hero } from "@/components/home/spotlight";
import { getSeasonal } from "@/lib/anime";
import { Cards } from "@/components/home/cards";
import SideBar from "@/components/sidebar";

export default function Home() {
  const seasonal = use(getSeasonal());

  return (
    <div className="relative mb-32 flex h-screen min-h-screen flex-col sm:mb-0">
      <SideBar />
      <div className="container mx-auto max-w-7xl flex-grow px-2">
        <Hero anime={seasonal.trending} />
        <div className="mt-10">
          <h1 className="mb-2 select-none text-3xl font-bold">
            Trending Anime
          </h1>
          <Cards animes={seasonal.trending} />
        </div>
        <div className="mt-10">
          <h1 className="mb-2 select-none text-3xl font-bold">
            All Time Popular
          </h1>
          <Cards animes={seasonal.popular} />
        </div>
      </div>
    </div>
  );
}
