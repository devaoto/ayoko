"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { Skeleton } from "@nextui-org/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useIsSSR } from "@react-aria/ssr";

import { AnimeSeasonalModified } from "@/lib/anime";

export function Hero({ anime }: Readonly<{ anime: AnimeSeasonalModified[] }>) {
  const [currentAnime, setCurrentAnime] =
    useState<AnimeSeasonalModified | null>(null);
  const isSSR = useIsSSR();
  const [trailer, setTrailer] = useState<any>();
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setCurrentAnime(anime[Math.floor(Math.random() * anime.length)]);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.4;
    }
  }, []);

  useEffect(() => {
    async function fetchTrailer(trailerId: string) {
      try {
        const response = await fetch(`/api/yt?id=${trailerId}`);
        const item = await response.json();

        setTrailer(item);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setTrailer(undefined);
      }
    }

    if (currentAnime?.trailer && !isSSR) {
      fetchTrailer(currentAnime.trailer.split("?v=")[1]);
    }
  }, [currentAnime?.trailer]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div>
      {currentAnime ? (
        <div className="relative h-[250px] max-h-[250px] select-none sm:h-[500px] sm:max-h-[500px]">
          <AnimatePresence>
            {trailer && trailer.url ? (
              <motion.div
                key="video"
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
              >
                <motion.video
                  autoPlay
                  loop
                  className="max-h-[250px] min-h-[250px] min-w-full object-cover sm:max-h-[500px] sm:min-h-[500px]"
                  muted={isMuted}
                  ref={videoRef}
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
                  draggable={false}
                  height={2000}
                  src={
                    currentAnime.bannerImage
                      ? currentAnime.bannerImage
                      : currentAnime.coverImage
                  }
                  width={2000}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 h-full w-full from-transparent to-background/75 bg-radient-circle-c" />
          <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-background pb-5">
            <div className="ml-5 flex h-full flex-col justify-center">
              {
                <h1 className="text-xl font-bold sm:text-4xl">
                  {currentAnime.title.english ?? currentAnime.title.romaji}
                </h1>
              }
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    currentAnime.description?.replaceAll("<br>", "") ??
                    "No Description",
                }}
                className="line-clamp-3 max-w-[700px] text-sm font-medium"
              />
              <div className="mt-5 flex gap-5">
                <Link
                  className="max-w-[150px]"
                  href={`/anime/${currentAnime.id}`}
                >
                  <Button
                    className="max-w-[150px]"
                    color="primary"
                    radius="full"
                    size="sm"
                  >
                    <PlayCircle className="text-foreground" size={16} /> Watch
                    Now
                  </Button>
                </Link>

                {trailer && trailer.url && (
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="text-foreground" size={16} />
                    ) : (
                      <Volume2 className="text-foreground" size={16} />
                    )}
                  </Button>
                )}
              </div>
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
