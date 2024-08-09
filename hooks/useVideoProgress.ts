import { useAtom } from "jotai";
import { useEffect } from "react";
import { useLocalStorage } from "react-use";
import { useIsSSR } from "@react-aria/ssr";
import { atomWithStore } from "jotai-zustand";
import { createStore } from "zustand/vanilla";

interface VideoProgressData {
  title: string;
  timeWatched: number;
  duration: number;
  provider: string;
  poster: string;
  episodeNumber: number;
  subType: string;
  episodeId: string;
}

interface VideoProgressState {
  [key: string]: VideoProgressData;
}

const videoProgressStore = createStore<VideoProgressState>(() => ({}));
const videoProgressAtom = atomWithStore(videoProgressStore);

const useVideoProgress = () => {
  const [videoProgress, setVideoProgress] = useAtom(videoProgressAtom);
  const isSSR = useIsSSR();
  const [storedProgress, setStoredProgress] = useLocalStorage<
    Record<string, VideoProgressData>
  >("vidstack_settings", {});

  useEffect(() => {
    if (!isSSR && storedProgress) {
      setVideoProgress(storedProgress);
    }
  }, [isSSR, storedProgress, setVideoProgress]);

  const getVideoProgress = (id: string) => videoProgress[id];

  const updateVideoProgress = (id: string, data: VideoProgressData) => {
    const updatedProgress = { ...videoProgress, [id]: data };

    setVideoProgress(updatedProgress);
    setStoredProgress(updatedProgress);
  };

  return { getVideoProgress, updateVideoProgress };
};

export default useVideoProgress;
