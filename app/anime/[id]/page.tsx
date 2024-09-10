import React from "react";
import { Image } from "@nextui-org/image";
import NextImage from "next/image";
import { InfoIcon, UsersRound } from "lucide-react";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { Tooltip } from "@nextui-org/tooltip";

import { getEpisodes, getInfo } from "@/lib/anime";
import { MotionDiv } from "@/lib/motion";
import { changeSeason, changeStatus, indexToMonth } from "@/lib/utils";
import Episodes from "@/components/anime/episodes";
import { Navbar } from "@/components/navbar";

type InfoPageProps = {
  params: {
    id: string;
  };
};

export default async function Info({ params }: Readonly<InfoPageProps>) {
  const [info, episodes] = await Promise.all([
    getInfo(params.id),
    getEpisodes(params.id),
  ]);

  const uniqueCharactersSet = new Set();

  info.characters = info.characters.filter((character) => {
    const duplicate = uniqueCharactersSet.has(character.name);

    uniqueCharactersSet.add(character.name);

    return !duplicate;
  });

  return (
    <>
      <Navbar navFor="info" title={info.title.english || info.title.romaji} />
      <MotionDiv
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col space-y-8">
          <div className="relative overflow-hidden rounded-lg">
            <NextImage
              alt={info.title.english || info.title.romaji}
              className="h-80 w-full object-cover sm:h-64 md:h-80"
              height={2000}
              src={info.bannerImage}
              width={2000}
            />
            <div className="absolute inset-0 z-[5] bg-gradient-to-b from-transparent to-background" />
            <div className="absolute inset-0 z-[10] from-transparent to-background/75 bg-radient-circle-c" />
            <div className="absolute bottom-0 left-0 right-0 z-[15] flex flex-col items-center space-y-4 p-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Image
                alt={info.title.english || info.title.romaji}
                className="h-44 w-32 rounded-lg object-cover sm:h-60 sm:w-40"
                src={info.coverImage}
              />
              <div className="text-center sm:text-left">
                <h2 className="text-base font-semibold text-foreground-600 sm:text-lg md:text-xl">
                  {info.startDate?.day} {indexToMonth(info.startDate?.month!)}{" "}
                  {info.startDate?.year}
                </h2>
                <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">
                  {info.title.english || info.title.romaji}
                </h1>
                <h2 className="hidden text-sm text-foreground-500 sm:block sm:text-base md:text-lg">
                  {info.title.romaji}
                </h2>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 z-40 hidden items-center gap-2 sm:gap-5 md:flex">
              <Link
                href={`https://anilist.co/anime/${params.id}`}
                target="_blank"
              >
                <Tooltip content="Anilist">
                  <Button isIconOnly>
                    <svg
                      height="172"
                      preserveAspectRatio="xMidYMid"
                      viewBox="0 0 172 172"
                      width="172"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <defs>
                        <style>
                          {`.cls-1 {
                              fill: #02a9ff;
                            }
                            .cls-1, .cls-2 {
                              fill-rule: evenodd;
                            }
                            .cls-2 {
                              fill: #fefefe;
                            }`}
                        </style>
                      </defs>
                      <g>
                        <path
                          className="cls-1"
                          d="M111.322,111.157 L111.322,41.029 C111.322,37.010 109.105,34.792 105.086,34.792 L91.365,34.792 C87.346,34.792 85.128,37.010 85.128,41.029 C85.128,41.029 85.128,56.337 85.128,74.333 C85.128,75.271 94.165,79.626 94.401,80.547 C101.286,107.449 95.897,128.980 89.370,129.985 C100.042,130.513 101.216,135.644 93.267,132.138 C94.483,117.784 99.228,117.812 112.869,131.610 C112.986,131.729 115.666,137.351 115.833,137.351 C131.170,137.351 148.050,137.351 148.050,137.351 C152.069,137.351 154.286,135.134 154.286,131.115 L154.286,117.394 C154.286,113.375 152.069,111.157 148.050,111.157 L111.322,111.157 Z"
                        />
                        <path
                          className="cls-2"
                          d="M54.365,34.792 L18.331,137.351 L46.327,137.351 L52.425,119.611 L82.915,119.611 L88.875,137.351 L116.732,137.351 L80.836,34.792 L54.365,34.792 ZM58.800,96.882 L67.531,68.470 L77.094,96.882 L58.800,96.882 Z"
                        />
                      </g>
                    </svg>
                  </Button>
                </Tooltip>
              </Link>
              <Link href={`${info.trailer}`} target="_blank">
                <Button color="secondary">Watch Trailer</Button>
              </Link>
            </div>
          </div>
          <div className="container mx-auto px-4 py-8">
            <div
              dangerouslySetInnerHTML={{
                __html: info.description.replaceAll("<br>", ""),
              }}
              className="-mt-8 mb-8 text-sm sm:text-base md:text-lg"
            />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
              <div className="w-full lg:w-1/2">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold sm:text-2xl">
                  <UsersRound />
                  <span>Characters</span>
                </h3>
                <div className="max-h-80 overflow-y-auto pr-2 scrollbar-hide sm:max-h-96">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {info.characters.map((character) => (
                      <div
                        key={character.name}
                        className="flex items-center space-x-2"
                      >
                        <Image
                          alt={character.name}
                          className="h-12 w-12 rounded-full object-cover sm:h-16 sm:w-16"
                          src={character.image}
                        />
                        <div>
                          <p className="text-sm font-bold sm:text-base">
                            {character.name}
                          </p>
                          <p className="text-xs text-foreground-600 sm:text-sm">
                            {character.voiceActor.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold sm:text-2xl">
                  <InfoIcon /> <span>Details</span>
                </h3>
                <ul className="space-y-2 text-sm sm:text-base">
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
          </div>
          <Episodes episodes={episodes} id={params.id} info={info} />
        </div>
      </MotionDiv>
    </>
  );
}
