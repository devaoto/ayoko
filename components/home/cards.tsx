"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { isMobile, isTablet } from "react-device-detect";

import { Card } from "../shared/card";

import { AnimeCard } from "@/types/cards";

import "swiper/css";
import "swiper/css/navigation";

export function Cards({ animes }: Readonly<{ animes: AnimeCard[] }>) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="group relative">
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
      >
        <>
          {animes.length > 0 || animes[0]?.id ? (
            animes.map((anime) => (
              <SwiperSlide key={anime.id} className="select-none">
                <Card anime={anime} />
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
                <div key={`${u}-${index}`}>
                  <Card anime={u} />
                </div>
              ))}
            </div>
          )}
        </>
      </Swiper>
      <div
        ref={prevRef}
        className="absolute left-0 top-1/2 z-10 flex h-full w-16 -translate-y-1/2 transform cursor-pointer items-center justify-center bg-transparent from-transparent to-background text-xl duration-200 group-hover:bg-gradient-to-l"
      >
        <ArrowLeft />
      </div>
      <div
        ref={nextRef}
        className="absolute right-0 top-1/2 z-10 flex h-full w-16 -translate-y-1/2 transform cursor-pointer items-center justify-center bg-transparent from-transparent to-background text-xl duration-200 group-hover:bg-gradient-to-r"
      >
        <ArrowRight />
      </div>
    </div>
  );
}
