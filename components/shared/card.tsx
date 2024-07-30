"use client";

import { Image } from "@nextui-org/image";
import NextImage from "next/image";
import Link from "next/link";
import { Skeleton } from "@nextui-org/skeleton";
import { Tooltip } from "@nextui-org/tooltip";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { AnimeCard } from "@/types/cards";

export const Card = ({ anime }: { anime: AnimeCard | undefined }) => {
  const [trailer, setTrailer] = useState<string | undefined>(undefined);

  async function fetchTrailer(trailerId: string) {
    try {
      const response = await fetch(
        `https://pipedapi.kavin.rocks/streams/${trailerId}`,
      );
      const { videoStreams } = await response.json();
      const item = videoStreams.find(
        (i: any) => i.quality === "1080p" && i.format === "WEBM",
      );

      setTrailer(item?.url);
    } catch (error) {
      toast.error("Error fetching trailer");
      setTrailer(undefined);
    }
  }

  const handleMouseEnter = () => {
    if (anime?.trailer && !trailer) {
      fetchTrailer(anime.trailer.split("?v=")[1]);
    }
  };

  return (
    <>
      {anime && anime.id ? (
        <Tooltip
          content={
            <div className="p-2">
              <AnimatePresence>
                {trailer ? (
                  <motion.div
                    key="video"
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                  >
                    <video
                      autoPlay
                      loop
                      muted
                      className="max-h-[150px] min-h-[150px] min-w-[300px] max-w-[300px] object-cover"
                      src={trailer}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="image"
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                  >
                    <Image
                      alt={anime.title.romaji}
                      className="max-h-[150px] min-h-[150px] min-w-[300px] max-w-[300px] object-cover"
                      height={2000}
                      src={
                        anime.artwork &&
                        anime.artwork.filter((t) => t.type === "top_banner")
                          .length > 0
                          ? anime.artwork.filter(
                              (t) => t.type === "top_banner",
                            )[0].img
                          : anime.bannerImage
                            ? anime.bannerImage
                            : anime.coverImage
                      }
                      width={2000}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <h1 className="line-clamp-2 max-w-[300px] text-xl font-medium">
                {anime.title.english ?? anime.title.romaji}
              </h1>
              <h2 className="text-foreground-400">
                {anime.season.slice(0, 1) + anime.season.slice(1).toLowerCase()}
              </h2>
              <p
                dangerouslySetInnerHTML={{ __html: anime.description }}
                className="line-clamp-3 max-w-[300px] text-xs"
              />
            </div>
          }
          delay={1500}
          placement="right"
          radius="sm"
        >
          <Link href={`/anime/${anime.id}`} onMouseEnter={handleMouseEnter}>
            <Image
              alt={anime.title.romaji}
              as={NextImage}
              className="max-h-[240px] min-h-[240px] min-w-[165px] max-w-[165px] object-cover"
              height={278}
              radius="sm"
              src={anime.coverImage}
              width={185}
            />
            <div className="line-clamp-1 max-w-[165px] font-medium">
              {anime.title.english || anime.title.romaji}
            </div>
          </Link>
        </Tooltip>
      ) : (
        <>
          <Skeleton className="h-[240px] w-[165px] rounded-lg object-cover" />
          <Skeleton className="mt-1 h-4 w-[155px] rounded-lg font-medium" />
        </>
      )}
    </>
  );
};
