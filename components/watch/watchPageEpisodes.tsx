"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@nextui-org/input";
import { useIsSSR } from "@react-aria/ssr";

import { EpisodeCard } from "./watchPageEpisode";

export const WatchPageEpisodes = ({
  id,
  episodes,
  provider,
  subType,
  currentEpisode,
}: Readonly<{
  id: string;
  episodes: any[];
  provider: string;
  subType: string;
  currentEpisode: string;
}>) => {
  const isSSR = useIsSSR();
  const [searchQuery, setSearchQuery] = useState("");
  const currentEpisodeRef = useRef<HTMLDivElement | null>(null);

  const filteredEpisodes = episodes.filter((episode) => {
    const episodeNumber = episode.number.toString();
    const episodeTitle = episode.title.toLowerCase();
    const query = searchQuery.toLowerCase();

    return episodeNumber.includes(query) || episodeTitle.includes(query);
  });

  useEffect(() => {
    if (currentEpisodeRef.current) {
      currentEpisodeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  if (isSSR) return null;

  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between gap-5">
        <h1 className="text-2xl font-bold">Episodes</h1>
        <Input
          className="w-full"
          color="primary"
          placeholder="Search by title or episode number"
          size="sm"
          type="text"
          value={searchQuery}
          variant="bordered"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex flex-col flex-wrap gap-5 overflow-auto scrollbar-hide sm:flex-row md:flex-col">
        {filteredEpisodes.map((episode) => (
          <EpisodeCard
            key={episode.id}
            ref={
              Number(episode.number) === Number(currentEpisode)
                ? currentEpisodeRef
                : null
            }
            description={episode.description}
            id={id}
            image={episode.thumbnail}
            isCurrent={Number(episode.number) === Number(currentEpisode)}
            number={episode.number}
            providerId={provider}
            sub={subType as "sub" | "dub"}
            title={episode.title}
          />
        ))}
      </div>
    </div>
  );
};
