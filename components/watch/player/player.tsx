"use client";

import {
  isHLSProvider,
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  MediaProviderAdapter,
  Poster,
  Track,
  useMediaRemote,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { useRef, useEffect, useState } from "react";

import { QualitySubmenu } from "./components/quality";

import useVideoProgress from "@/hooks/useVideoProgress";
import { AnifySubttile, AnifySource } from "@/types/sources";

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

  function onPlay() {
    setIsPlaying(true);
  }

  function onPause() {
    setIsPlaying(false);
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
          remote.seek(seek.timeWatched - 3);
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
      onPause={onPause}
      onPlay={onPlay}
      onProviderChange={onProviderChange}
    >
      <MediaProvider>
        <Poster alt={title} className="vds-poster" src={poster} />
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

      <DefaultVideoLayout
        icons={defaultLayoutIcons}
        slots={{
          settingsMenuItemsEnd: <QualitySubmenu />,
        }}
        thumbnails={`https://cors-proxy.sohom829.xyz/${
          subtitles.find((s) => s.label === "thumbnails")?.url
        }`}
        title={title}
      />
    </MediaPlayer>
  );
}
