"use client";

import {
  isHLSProvider,
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  MediaProviderAdapter,
  Poster,
  Track,
  TextTrack,
  useMediaRemote,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { useRef, useEffect, useState } from "react";

import { SkipConfigurationSubMenu } from "./components/skipConfiguration";
import { QualitySubmenu } from "./components/quality";

import useAutoSkip from "@/hooks/useAutoSkip";
import useSkipButtons from "@/hooks/useSkipButtons";
import useVideoProgress from "@/hooks/useVideoProgress";
import { AnifySubttile, AnifySource } from "@/types/sources";

interface Interval {
  startTime: number;
  endTime: number;
}

interface Result {
  interval: Interval;
  skipType: string;
  skipId: string;
  episodeLength: number;
}

interface ApiResponse {
  found: boolean;
  results: Result[];
  message: string;
  statusCode: number;
}

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
  idMal,
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
  idMal: string;
}>) {
  const playerRef = useRef<MediaPlayerInstance | null>(null);
  const { getVideoProgress, updateVideoProgress } = useVideoProgress();
  const [isSkipEnabled] = useSkipButtons();
  const [isAutoSkipEnabled] = useAutoSkip();
  const [isPlaying, setIsPlaying] = useState(false);
  const [openingButton, setOpeningButton] = useState(false);
  const [endingButton, setEndingButton] = useState(false);
  const [skipData, setSkipData] = useState<ApiResponse | null>(null);
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
    (async () => {
      const response = await (
        await fetch(
          `https://api.aniskip.com/v2/skip-times/${idMal}/${Number(
            episodeNumber,
          )}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=`,
        )
      ).json();

      setSkipData(response);
    })();
  }, [episodeNumber, idMal]);

  function onCanPlay() {
    const opening =
      skipData?.results?.find((item) => item.skipType === "op") || null;
    const ending =
      skipData?.results?.find((item) => item.skipType === "ed") || null;
    const episodeLength =
      skipData?.results?.find((item) => item.episodeLength)?.episodeLength ?? 0;

    const skipTime: { startTime: number; endTime: number; text: string }[] = [];

    if (opening?.interval) {
      skipTime.push({
        startTime: opening.interval.startTime ?? 0,
        endTime: opening.interval.endTime ?? 0,
        text: "Opening",
      });
    }
    if (ending?.interval) {
      skipTime.push({
        startTime: ending.interval.startTime ?? 0,
        endTime: ending.interval.endTime ?? 0,
        text: "Ending",
      });
    } else {
      skipTime.push({
        startTime: opening?.interval?.endTime ?? 0,
        endTime: episodeLength,
        text: `${title}`,
      });
    }

    if (skipTime.length > 0) {
      const track = new TextTrack({
        kind: "chapters",
        default: true,
        label: "English",
        language: "en-US",
        type: "json",
      });

      for (const cue of skipTime) {
        track.addCue(
          new window.VTTCue(
            Number(cue.startTime),
            Number(cue.endTime),
            cue.text,
          ),
        );
      }
      playerRef.current?.textTracks.add(track);
    }

    // Update buttons visibility based on the calculated skip time
    playerRef.current?.subscribe(({ currentTime }) => {
      if (skipTime.length > 0) {
        const openingStart = skipTime[0]?.startTime ?? 0;
        const openingEnd = skipTime[0]?.endTime ?? 0;

        const endingStart = skipTime[1]?.startTime ?? 0;
        const endingEnd = skipTime[1]?.endTime ?? 0;

        const openingButtonText = skipTime[0]?.text || "";
        const endingButtonText = skipTime[1]?.text || "";

        setOpeningButton(
          openingButtonText === "Opening" &&
            currentTime > openingStart &&
            currentTime < openingEnd,
        );
        setEndingButton(
          endingButtonText === "Ending" &&
            currentTime > endingStart &&
            currentTime < endingEnd,
        );

        if (isAutoSkipEnabled) {
          if (currentTime > openingStart && currentTime < openingEnd) {
            Object.assign(playerRef.current ?? {}, { currentTime: openingEnd });

            return null;
          }
        }
      }
    });
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

  function handleOpening() {
    const skipTime = playerRef.current?.textTracks[0]?.cues[0];

    if (skipTime) {
      Object.assign(playerRef.current ?? {}, {
        currentTime: skipTime.endTime ?? 0,
      });
    }
  }

  function handleEnding() {
    const skipTime = playerRef.current?.textTracks[0]?.cues[1];

    if (skipTime) {
      Object.assign(playerRef.current ?? {}, {
        currentTime: skipTime.endTime ?? 0,
      });
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
      onCanPlay={onCanPlay}
      onEnd={onEnd}
      onLoadedMetadata={onLoadedMetadata}
      onPause={onPause}
      onPlay={onPlay}
      onProviderChange={onProviderChange}
    >
      <MediaProvider>
        <Poster alt={title} className="vds-poster" src={poster} />
        {isSkipEnabled && openingButton && (
          <button
            className="font-inter animate-show absolute bottom-[70px] left-4 z-[40] flex cursor-pointer items-center gap-2 rounded-lg border border-solid border-white border-opacity-10 bg-black bg-opacity-80 px-3 py-2 text-left text-base font-medium text-white sm:bottom-[83px]"
            onClick={handleOpening}
          >
            Skip Opening
          </button>
        )}
        {isSkipEnabled && endingButton && (
          <button
            className="font-inter animate-show absolute bottom-[70px] left-4 z-[40] flex cursor-pointer items-center gap-2 rounded-lg border border-solid border-white border-opacity-10 bg-black bg-opacity-80 px-3 py-2 text-left text-base font-medium text-white sm:bottom-[83px]"
            onClick={handleEnding}
          >
            Skip Ending
          </button>
        )}
        <DefaultVideoLayout icons={defaultLayoutIcons}>
          <SkipConfigurationSubMenu />
          <QualitySubmenu />
        </DefaultVideoLayout>
      </MediaProvider>
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
    </MediaPlayer>
  );
}

export default Player;
