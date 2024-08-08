import { Player } from "@/components/player/player";
import { WatchPageEpisodes } from "@/components/watch/watchPageEpisodes";
import { getEpisodes, getInfo, getSources } from "@/lib/anime";
import { use } from "react";

export default function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    number: string;
    subType: string;
    episodeId: string;
    server: string;
  };
}) {
  const [info, episodes, sources] = use(
    Promise.all([
      getInfo(params.id),
      getEpisodes(params.id),
      getSources(
        params.id,
        searchParams.server,
        encodeURIComponent(searchParams.episodeId),
        searchParams.number,
        searchParams.subType,
      ),
    ]),
  );

  const currentProvider = episodes.find(
    (p) => p.providerId === searchParams.server,
  )?.episodes[searchParams.subType as "sub" | "dub"];

  const currentEpisode = episodes
    .find((p) => p.providerId === searchParams.server)
    ?.episodes[
      searchParams.subType as "sub" | "dub"
    ].find((p) => Number(p.number) === Number(searchParams.number));

  return (
    <div className="flex justify-between gap-10">
      <div className="max-w-4xl">
        <Player
          sources={sources.sources}
          subtitles={sources.subtitles}
          title={currentEpisode?.title!}
          poster={currentEpisode?.image!}
        />
        <h1 className="text-2xl font-medium">
          {info.title.english ?? info.title.romaji}: Episode{" "}
          {currentEpisode?.number}
        </h1>
        <h2 className="text-foreground-500">{currentEpisode?.title}</h2>
      </div>
      <div className="h-[530px] !max-h-[510px] overflow-y-scroll scrollbar-hide">
        <WatchPageEpisodes
          episodes={currentProvider!}
          subType={searchParams.subType}
          id={params.id}
          provider={searchParams.server}
          currentEpisode={searchParams.number}
        />
      </div>
    </div>
  );
}
