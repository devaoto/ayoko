"use client";

import "@vidstack/react/player/styles/base.css";

import { useEffect, useRef } from "react";

import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  TextTrack,
  Track,
  type MediaCanPlayDetail,
  type MediaCanPlayEvent,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
} from "@vidstack/react";

import { VideoLayout } from "./components/layouts/video-layout";
import { AnifySource, AnifySubttile } from "@/types/sources";

export function Player({
  subtitles,
  sources,
  title,
  poster,
}: Readonly<{
  subtitles: AnifySubttile[];
  sources: AnifySource[];
  title: string;
  poster: string;
}>) {
  let player = useRef<MediaPlayerInstance>(null);

  useEffect(() => {
    // Subscribe to state updates.
    return player.current!.subscribe(({ paused, viewType }) => {
      // console.log('is paused?', '->', state.paused);
      // console.log('is audio view?', '->', state.viewType === 'audio');
    });
  }, []);

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    nativeEvent: MediaProviderChangeEvent,
  ) {
    // We can configure provider's here.
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  // We can listen for the `can-play` event to be notified when the player is ready.
  function onCanPlay(
    detail: MediaCanPlayDetail,
    nativeEvent: MediaCanPlayEvent,
  ) {
    // ...
  }

  return (
    <MediaPlayer
      className="aspect-video w-full overflow-hidden rounded-md bg-slate-900 font-sans text-white ring-media-focus data-[focus]:ring-4"
      title="Alya Sometimes Hides Her Feelings In Russian"
      src={
        sources.find((s) => s.quality === "default" || s.quality === "auto")
          ?.url
      }
      crossOrigin
      playsInline
      onProviderChange={onProviderChange}
      onCanPlay={onCanPlay}
      ref={player}
    >
      <MediaProvider>
        <Poster
          className="absolute inset-0 block h-full w-full rounded-md object-cover opacity-0 transition-opacity data-[visible]:opacity-100"
          src={poster}
          alt={title}
        />
        {subtitles
          .filter((t) => t.label !== "thumbnails")
          .map((t) => (
            <Track
              default={t.label === "English"}
              key={t.lang}
              label={t.label}
              lang={t.lang}
              src={t.url}
              kind="subtitles"
            />
          ))}
      </MediaProvider>

      <VideoLayout
        thumbnails={`https://cors-proxy.sohom829.xyz/${subtitles.find((s) => s.label === "thumbnails")?.url}`}
        title={title}
      />
    </MediaPlayer>
  );
}
