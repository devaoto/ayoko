import { use } from "react";

import { Player } from "@/components/watch/player/player";
import { WatchPageEpisodes } from "@/components/watch/watchPageEpisodes";
import { getEpisodes, getInfo, getSources } from "@/lib/anime";
import { changeStatus, changeSeason } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

export default function Page({
  params,
  searchParams,
}: Readonly<{
  params: { id: string };
  searchParams: {
    number: string;
    subType: string;
    episodeId: string;
    server: string;
  };
}>) {
  const [info, episodes] = use(
    Promise.all([getInfo(params.id), getEpisodes(params.id)]),
  );

  const currentProvider = episodes.find(
    (p) => p.providerId === searchParams.server,
  )?.episodes[searchParams.subType as "sub" | "dub"];

  const currentEpisode = episodes
    .find((p) => p.providerId === searchParams.server)
    ?.episodes[
      searchParams.subType as "sub" | "dub"
    ].find((p: any) => Number(p.number) === Number(searchParams.number));

  const episodeId = currentEpisode.id;

  const sources = use(
    getSources(
      params.id,
      searchParams.server,
      encodeURIComponent(episodeId),
      searchParams.number,
      searchParams.subType,
    ),
  );

  return (
    <>
      <Navbar navFor="info" title={currentEpisode.title} />
      <div className="container mx-auto flex flex-col justify-between gap-10 px-4 py-12 md:flex-row">
        <div className="md:min-w-4xl w-full md:max-w-4xl">
          <Player
            episodeId={searchParams.episodeId}
            episodeNumber={Number(searchParams.number)}
            id={params.id}
            idMal={info.idMal}
            poster={currentEpisode?.thumbnail}
            provider={searchParams.server}
            sources={sources.sources}
            subType={searchParams.subType}
            subtitles={sources.subtitles ?? null}
            title={currentEpisode?.title}
          />
          <h1 className="text-2xl font-medium">
            Episode {currentEpisode?.number}: {currentEpisode?.title}
          </h1>
          <h2 className="text-foreground-500">
            {info.title.english ?? info.title.romaji}
          </h2>
        </div>
        <div className="h-[530px] !max-h-[510px] overflow-y-scroll scrollbar-hide">
          <WatchPageEpisodes
            currentEpisode={searchParams.number}
            episodes={currentProvider}
            id={params.id}
            provider={searchParams.server}
            subType={searchParams.subType}
          />
        </div>
      </div>
      <div className="container mx-auto mt-10 px-4">
        <h1 className="text-2xl font-bold">Description</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: currentEpisode?.description ?? "",
          }}
          className="w-full md:max-w-4xl"
        />
        <div className="mt-5">
          <h1 className="text-2xl font-bold">Overview</h1>
          <ul className="list-inside list-disc">
            <li>Status: {changeStatus(info.status)}</li>
            <li>Season: {changeSeason(info.season)}</li>
            <li>Year: {info.year}</li>
            <li>Country of Origin: {info.countryOfOrigin}</li>
            <li>Format: {info.format}</li>
            <li>Duration: {info.duration} minutes</li>
            <li>Current Episode: {info.currentEpisode}</li>
            <li>Total Episodes: {info.totalEpisodes}</li>
            <li>Popularity (TMDb): {info.popularity.tmdb}</li>
            <li>Popularity (MAL): {info.popularity.mal}</li>
            <li>Popularity (AniList): {info.popularity.anilist}</li>
          </ul>
        </div>
      </div>
    </>
  );
}
