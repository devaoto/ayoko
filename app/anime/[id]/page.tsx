import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";
import NextImage from "next/image";
import { InfoIcon, UsersRound } from "lucide-react";

import { getInfo } from "@/lib/anime";
import { MotionDiv } from "@/lib/motion";
import { IAnime } from "@/types/info";
import { changeSeason, changeStatus } from "@/lib/utils";

type InfoPageProps = {
  params: {
    id: string;
  };
};

export default async function Info({ params }: Readonly<InfoPageProps>) {
  const info: IAnime = await getInfo(params.id);

  const uniqueCharactersSet = new Set();

  info.characters = info.characters.filter((character) => {
    const duplicate = uniqueCharactersSet.has(character.name);

    uniqueCharactersSet.add(character.name);

    return !duplicate;
  });

  return (
    <div className="min-h-screen bg-background p-4 text-foreground">
      <MotionDiv
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col">
          <NextImage
            alt={info.title.english || info.title.romaji}
            className="mb-4 max-h-60 w-full object-cover"
            height={2000}
            src={info.bannerImage}
            width={2000}
          />
          <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row md:justify-normal">
            <Image
              alt={info.title.english || info.title.romaji}
              className="mb-4 h-60 max-h-60 min-h-60 w-40 min-w-40 max-w-40 rounded-lg object-cover"
              src={info.coverImage}
            />
            <div>
              <h1 className="mb-2 text-4xl font-bold">
                {info.title.english || info.title.romaji}
              </h1>
              <h2 className="mb-4 text-2xl">{info.title.native}</h2>
              <div className="mb-4 flex flex-wrap gap-2">
                {info.genres.map((genre) => (
                  <Chip key={genre} color="secondary" variant="dot">
                    {genre}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          <p className="mb-4 text-lg">{info.description}</p>
          <div className="flex w-full flex-col-reverse flex-wrap justify-between md:flex-row">
            <div className="mb-4 w-full lg:w-1/2">
              <h3 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
                <UsersRound />
                <span>Characters</span>
              </h3>
              <div className="max-h-96 overflow-y-scroll scrollbar-hide">
                <div className="grid grid-cols-2 gap-4">
                  {info.characters.map((character) => (
                    <div
                      key={character.name}
                      className="flex items-center gap-2"
                    >
                      <Image
                        alt={character.name}
                        className="h-16 w-16 rounded-full object-cover"
                        src={character.image}
                      />
                      <div>
                        <p className="font-bold">{character.name}</p>
                        <p className="text-sm text-foreground-600">
                          {character.voiceActor.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-4 w-full lg:w-1/2">
              <h3 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
                <InfoIcon /> <span>Details</span>
              </h3>
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
        </div>
      </MotionDiv>
    </div>
  );
}
