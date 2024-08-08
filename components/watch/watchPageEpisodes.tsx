"use client";

import { useState } from "react";
import { Input } from "@nextui-org/input";

import { EpisodeCard } from "./watchPageEpisode";

import { ReturnEpisode } from "@/types/episode";
import { useIsSSR } from "@react-aria/ssr";

export const WatchPageEpisodes = ({
  id,
  episodes,
  provider,
  subType,
  currentEpisode,
}: {
  id: string;
  episodes: ReturnEpisode[];
  provider: string;
  subType: string;
  currentEpisode: string;
}) => {
  const isSSR = useIsSSR();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredEpisodes = episodes.filter((episode) => {
    const episodeNumber = episode.number.toString();
    const episodeTitle = episode.title.toLowerCase();
    const query = searchQuery.toLowerCase();

    return episodeNumber.includes(query) || episodeTitle.includes(query);
  });

  if (isSSR) return null;

  return (
    <div className="flex flex-col gap-2">
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
      {filteredEpisodes.map((episode) => (
        <EpisodeCard
          id={id}
          key={episode.id}
          episodeId={episode.id}
          image={episode.image}
          number={episode.number}
          title={episode.title}
          providerId={provider}
          sub={subType as "sub" | "dub"}
          isCurrent={Number(episode.number) === Number(currentEpisode)}
        />
      ))}
    </div>
  );
};
