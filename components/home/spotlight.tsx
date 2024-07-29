"use client";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { Skeleton } from "@nextui-org/skeleton";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle } from "lucide-react";

import { type Spotlight } from "@/types/spotlight";

export function Hero({ anime }: Readonly<{ anime: Spotlight[] }>) {
  const [currentAnime, setCurrentAnime] = useState<Spotlight | null>(null);

  const [trailer, setTrailer] = useState<any>();

  useEffect(() => {
    setCurrentAnime(anime[Math.floor(Math.random() * anime.length)]);
  }, []);

  useEffect(() => {
    async function fetchTrailer(trailerId: string) {
      try {
        const response = await fetch(
          `https://pipedapi.kavin.rocks/streams/${trailerId}`,
        );
        const { videoStreams } = await response.json();
        const item = videoStreams.find(
          (i: any) => i.quality === "1080p" && i.format === "WEBM",
        );

        setTrailer(item);
      } catch (error) {
        toast.error("Error fetching trailer");
        setTrailer(undefined);
      }
    }

    if (currentAnime?.trailer) {
      fetchTrailer(currentAnime.trailer.split("?v=")[1]);
    }
  }, [currentAnime?.trailer]);

  return (
    <div>
      {currentAnime ? (
        <div className="relative h-[250px] max-h-[250px] sm:h-[500px] sm:max-h-[500px]">
          <AnimatePresence>
            {trailer && trailer.url ? (
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
                  className="max-h-[250px] min-h-[250px] min-w-full object-cover sm:max-h-[500px] sm:min-h-[500px]"
                  src={trailer.url}
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
                  alt={currentAnime.title.romaji}
                  className="max-h-[250px] min-h-[250px] object-cover sm:max-h-[500px] sm:min-h-[500px]"
                  height={2000}
                  src={
                    currentAnime.artwork &&
                    currentAnime.artwork.filter((t) => t.type === "top_banner")
                      .length > 0
                      ? currentAnime.artwork.filter(
                          (t) => t.type === "top_banner",
                        )[0].img
                      : currentAnime.bannerImage
                        ? currentAnime.bannerImage
                        : currentAnime.coverImage
                  }
                  width={2000}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-background pb-5">
            <div className="ml-5 flex h-full flex-col justify-center">
              {currentAnime.artwork &&
              currentAnime.artwork.filter((t) => t.type === "clear_logo")
                .length > 0 ? (
                <>
                  <Image
                    alt={currentAnime.title.native}
                    className="hidden object-cover sm:block"
                    height={500}
                    src={
                      currentAnime.artwork.filter(
                        (t) => t.type === "clear_logo",
                      )[0].img
                    }
                    width={500}
                  />
                  <h1 className="line-clamp-2 max-w-[500px] text-2xl font-bold sm:text-3xl">
                    {currentAnime.title.english ?? currentAnime.title.romaji}
                  </h1>
                </>
              ) : (
                <h1 className="text-xl font-bold sm:text-4xl">
                  {currentAnime.title.english ?? currentAnime.title.romaji}
                </h1>
              )}
              <div
                dangerouslySetInnerHTML={{
                  __html: currentAnime.description ?? "No Description",
                }}
                className="line-clamp-3 max-w-[700px] text-sm font-medium"
              />
              <Button
                className="mt-5 max-w-[150px]"
                color="primary"
                radius="full"
                size="sm"
              >
                <PlayCircle className="text-foreground" size={16} /> Watch Now
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="ml-5 flex h-[500px] flex-col justify-center">
          <Skeleton className="h-10 w-96 rounded-lg" />
          <div className="mt-2">
            <Skeleton className="mt-1 h-5 w-[750px] rounded-lg" />
            <Skeleton className="mt-1 h-5 w-[750px] rounded-lg" />
            <Skeleton className="mt-1 h-5 w-[750px] rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
