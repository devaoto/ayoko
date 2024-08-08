"use client";

import { useState } from "react";
import { useLocalStorage } from "react-use";
import { AlignLeft, LayoutGrid } from "lucide-react";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import { Tooltip } from "@nextui-org/tooltip";
import { useIsSSR } from "@react-aria/ssr";
import _ from "lodash";

import { EpisodeCard } from "../shared/episodeCard";

import { EpisodeCard as SimpleEpisodeCard } from "./simpleEpisodeCard";

import { IAnime } from "@/types/info";
import { EpisodeReturn, ReturnEpisode } from "@/types/episode";

const Episodes = ({
  episodes,
  info,
  id,
}: {
  episodes: EpisodeReturn[];
  info: IAnime;
  id: string;
}) => {
  const isSSR = useIsSSR();

  const providerPriority: { [key: string]: number } = {
    "9anime": 1,
    hianime: 2,
    animepahe: 3,
    sudatchi: 4,
    gogoanime: 5,
  };

  const sortEpisodes = (episodes: EpisodeReturn[]) => {
    return _.sortBy(
      episodes,
      (episode) => providerPriority[episode.providerId],
    );
  };

  const sortedEpisodes = sortEpisodes(episodes);

  const validProviders = sortedEpisodes.filter(
    (provider) =>
      provider.episodes.sub.length > 0 || provider.episodes.dub.length > 0,
  );

  const [selectedProvider, setSelectedProvider] = useState<string | null>(
    validProviders.length > 0 ? validProviders[0].providerId : null,
  );

  const [selectedType, setSelectedType] = useState<"sub" | "dub">("sub");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [layout, setLayout] = useLocalStorage<"row" | "list">("layout", "row");

  const uniqueProviders = validProviders.map((provider) => provider.providerId);

  const selectedProviderData = validProviders.find(
    (provider) => provider.providerId === selectedProvider,
  );

  const episodeList = selectedProviderData?.episodes[selectedType] || [];

  const filterEpisodes = (episodes: ReturnEpisode[], query: string) => {
    return episodes.filter(
      (episode) =>
        episode.title?.toLowerCase().includes(query.toLowerCase()) ||
        episode.number?.toString() === query,
    );
  };

  const filteredEpisodes = filterEpisodes(episodeList, searchQuery);

  const handleLayoutChange = (layout: "row" | "list") => {
    setLayout(layout);
  };

  if (isSSR) return null;

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-5">
        <h1 className="text-2xl font-bold">Episodes</h1>
        <div className="flex space-x-2">
          <Tooltip content="Row Layout">
            <Button
              isIconOnly
              className={`!bg-transparent ${layout === "list" ? "text-primary" : "hover:text-primary"}`}
              variant="light"
              onPress={() => handleLayoutChange("list")}
            >
              <LayoutGrid />
            </Button>
          </Tooltip>
          <Tooltip content="List Layout">
            <Button
              isIconOnly
              className={`!bg-transparent ${layout === "row" ? "!text-primary" : "hover:!text-primary"}`}
              variant="light"
              onPress={() => handleLayoutChange("row")}
            >
              <AlignLeft />
            </Button>
          </Tooltip>
        </div>

        <Select
          aria-label="Select Provider"
          className="w-1/4"
          color="primary"
          defaultSelectedKeys={[selectedProvider!]}
          placeholder="Select Provider"
          size="sm"
          value={selectedProvider!}
          variant="bordered"
          onChange={(value) => setSelectedProvider(value.target.value)}
        >
          {uniqueProviders.map((providerId) => (
            <SelectItem key={providerId} value={providerId}>
              {providerId === "hianime"
                ? "Server 2"
                : providerId === "9anime"
                  ? "Server 1"
                  : providerId === "animepahe"
                    ? "Server 3"
                    : providerId === "sudatchi"
                      ? "Server 4"
                      : "Server 5"}
            </SelectItem>
          ))}
        </Select>

        <Select
          aria-label="Select Type"
          className="w-1/4"
          color="secondary"
          defaultSelectedKeys={[selectedType]}
          placeholder="Select Type"
          size="sm"
          value={selectedType}
          variant="bordered"
          onChange={(value) =>
            setSelectedType(value.target.value as "sub" | "dub")
          }
        >
          <SelectItem key={"sub"} value="sub">
            Sub
          </SelectItem>
          <SelectItem key={"dub"} value="dub">
            Dub
          </SelectItem>
        </Select>

        <Input
          className="w-1/4"
          color="primary"
          placeholder="Search by title or episode number"
          size="sm"
          type="text"
          value={searchQuery}
          variant="bordered"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div
        className={`max-h-[500px] overflow-x-hidden overflow-y-scroll scrollbar-hide ${layout === "row" ? "" : "flex flex-row flex-wrap gap-5"}`}
      >
        {filteredEpisodes.length === 0 ? (
          <div>No Episodes Found</div>
        ) : (
          filteredEpisodes.map((episode, i) =>
            layout === "row" ? (
              <EpisodeCard
                key={episode.id}
                createdAt={episode.createdAt ?? "No date"}
                episodeId={episode.id}
                id={id}
                image={episode.image ?? info.bannerImage ?? info.coverImage}
                number={episode.number || i + 1}
                overview={
                  episode.description ??
                  `Episode ${i + 1} of ${info.title.english || info.title.romaji}`
                }
                providerId={selectedProvider!}
                sub={selectedType}
                title={episode.title ?? `Episode ${i + 1}`}
              />
            ) : (
              <SimpleEpisodeCard
                key={episode.id}
                episodeId={episode.id}
                id={id}
                image={episode.image ?? info.bannerImage ?? info.coverImage}
                number={episode.number || i + 1}
                providerId={selectedProvider!}
                sub={selectedType}
                title={episode.title ?? `Episode ${i + 1}`}
              />
            ),
          )
        )}
      </div>
    </div>
  );
};

export default Episodes;
