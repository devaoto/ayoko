"use client";

import "@vidstack/react/player/styles/base.css";

import { useEffect, useRef, useState } from "react";
import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  useMediaRemote,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
} from "@vidstack/react";

import { VideoLayout } from "./components/layouts/video-layout";

import { AnifySource, AnifySubttile } from "@/types/sources";
import useVideoProgress from "@/hooks/useVideoProgress";

export function Player({
  subtitles,
  sources,
  title,
  poster,
  episodeId,
  provider,
  subType,
  episodeNumber,
  id,
}: Readonly<{
  subtitles: AnifySubttile[];
  sources: AnifySource[];
  title: string;
  poster: string;
  episodeId: string;
  provider: string;
  subType: string;
  episodeNumber: number;
  id: string;
}>) {
  const playerRef = useRef<MediaPlayerInstance | null>(null);
  const { getVideoProgress, updateVideoProgress } = useVideoProgress();
  const [isPlaying, setIsPlaying] = useState(false);
  const remote = useMediaRemote(playerRef);

  let interval: NodeJS.Timeout;

  const duration = playerRef.current?.duration;

  useEffect(() => {
    const videoProgress = getVideoProgress(id);

    if (videoProgress) {
      playerRef.current!.currentTime = videoProgress.timeWatched;
    }
  }, [id, getVideoProgress]);

  function onPlay() {
    setIsPlaying(true);
  }

  function onEnd() {
    setIsPlaying(false);
  }

  useEffect(() => {
    if (isPlaying) {
      interval = setInterval(() => {
        const currentTime = playerRef.current!.currentTime
          ? Math.round(playerRef.current!.currentTime)
          : 0;

        updateVideoProgress(id, {
          title,
          poster,
          episodeNumber,
          timeWatched: currentTime,
          duration: duration!,
          provider,
          subType,
          episodeId,
        });
      }, 5000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  function onProviderChange(provider: MediaProviderAdapter | null) {
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  function onLoadedMetadata() {
    const seek = getVideoProgress(id);

    if (seek) {
      const percentage =
        duration !== 0 ? seek.timeWatched / Math.round(duration!) : 0;

      if (Number(seek.episodeNumber) === Number(episodeNumber)) {
        if (percentage >= 0.9) {
          remote.seek(0);
        } else {
          remote.seek(seek.timeWatched - 2);
        }
      }
    }
  }

  return (
    <MediaPlayer
      ref={playerRef}
      crossOrigin
      playsInline
      className="aspect-video w-full overflow-hidden rounded-md bg-slate-900 font-sans text-white ring-media-focus data-[focus]:ring-4"
      src={
        sources.find((s) => s.quality === "default" || s.quality === "auto")
          ?.url
      }
      title={title}
      onEnd={onEnd}
      onLoadedMetadata={onLoadedMetadata}
      onPlay={onPlay}
      onProviderChange={onProviderChange}
    >
      <MediaProvider>
        <Poster
          alt={title}
          className="absolute inset-0 block h-full w-full rounded-md object-cover opacity-0 transition-opacity data-[visible]:opacity-100"
          src={poster}
        />
        {subtitles
          .filter((t) => t.label !== "thumbnails")
          .map((t) => (
            <Track
              key={t.lang}
              default={t.label === "English"}
              kind="subtitles"
              label={t.label}
              lang={t.lang}
              src={t.url}
            />
          ))}
      </MediaProvider>

      <VideoLayout
        thumbnails={`https://cors-proxy.sohom829.xyz/${
          subtitles.find((s) => s.label === "thumbnails")?.url
        }`}
        title={title}
      />
    </MediaPlayer>
  );
}
