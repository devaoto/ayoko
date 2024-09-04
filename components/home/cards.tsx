"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { isMobile, isTablet } from "react-device-detect";
import { motion } from "framer-motion";

import { Card } from "../shared/card";

import "swiper/css";
import "swiper/css/navigation";
import { AnimeSeasonalModified } from "@/lib/anime";

export function Cards({
  animes,
}: Readonly<{ animes: AnimeSeasonalModified[] }>) {
  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    setCanScrollPrev(false);
    setCanScrollNext(animes.length > 6);
  }, [animes]);

  return (
    <section
      aria-label="Anime Carousel"
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        breakpoints={{
          320: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 4,
          },
          1020: {
            slidesPerView: 6,
          },
        }}
        modules={[Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        slidesPerView={6}
        spaceBetween={10}
        onBeforeInit={(swiper) => {
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        onReachBeginning={() => setCanScrollPrev(false)}
        onReachEnd={() => setCanScrollNext(false)}
        onSlideChange={(swiper) => {
          setCanScrollPrev(!swiper.isBeginning);
          setCanScrollNext(!swiper.isEnd);
        }}
      >
        <>
          {animes.length > 0 || animes[0]?.id ? (
            animes.map((anime) => (
              <SwiperSlide key={anime.id} className="select-none">
                <Card key={anime.id} anime={anime} />
              </SwiperSlide>
            ))
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
              {(isMobile
                ? [undefined, undefined]
                : isTablet
                  ? [undefined, undefined, undefined]
                  : [
                      undefined,
                      undefined,
                      undefined,
                      undefined,
                      undefined,
                      undefined,
                    ]
              ).map((u, index) => (
                <Card key={`${u}-${index}`} anime={u} />
              ))}
            </div>
          )}
        </>
      </Swiper>
      <motion.div
        ref={prevRef}
        animate={{ opacity: isHovered && canScrollPrev ? 1 : 0 }}
        className="absolute left-0 top-1/2 z-10 flex h-full w-16 -translate-y-1/2 transform cursor-pointer items-center justify-center bg-transparent from-transparent to-background text-xl duration-200 group-hover:bg-gradient-to-l"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowLeft />
      </motion.div>
      <motion.div
        ref={nextRef}
        animate={{ opacity: isHovered && canScrollNext ? 1 : 0 }}
        className="absolute right-0 top-1/2 z-10 flex h-full w-16 -translate-y-1/2 transform cursor-pointer items-center justify-center bg-transparent from-transparent to-background text-xl duration-200 group-hover:bg-gradient-to-r"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowRight />
      </motion.div>
    </section>
  );
}
