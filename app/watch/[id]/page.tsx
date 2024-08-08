import { Player } from "@/components/player/player";
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

  const currentEpisode = episodes
    .find((p) => p.providerId === searchParams.server)
    ?.episodes[
      searchParams.subType as "sub" | "dub"
    ].find((p) => Number(p.number) === Number(searchParams.number));

  return (
    <Player
      sources={sources.sources}
      subtitles={sources.subtitles}
      title={currentEpisode?.title!}
      poster={currentEpisode?.image!}
    />
  );
}
