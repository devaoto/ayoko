"use client";

import { useEffect, useRef, useState } from "react";
import { Progress } from "@nextui-org/progress";
import { useIsSSR } from "@react-aria/ssr";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft, ArrowRight, X, Trash2 } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { useRouter } from "next/navigation";

import "swiper/css";
import "swiper/css/navigation";
import { VideoProgressData } from "@/hooks/useVideoProgress";

interface ContinueWatchingProps {
  id: string;
  title: string;
  timeWatched: number;
  duration: number;
  provider: string;
  poster: string;
  episodeNumber: number;
  subType: string;
  episodeId: string;
  onRemoveEpisode: (id: string) => void;
}

const ContinueWatchingCard: React.FC<ContinueWatchingProps> = ({
  id,
  title,
  timeWatched,
  duration,
  provider,
  poster,
  episodeNumber,
  subType,
  episodeId,
  onRemoveEpisode,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const progress = (timeWatched / duration) * 100;

  const handleCardClick = () => {
    router.push(
      `/watch/${id}?episodeId=${encodeURIComponent(episodeId)}&server=${provider}&number=${episodeNumber}&subType=${subType}`,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      className="relative w-80"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          alt={`${title} Poster`}
          className="mb-2 h-[180px] w-full rounded-lg object-cover"
          src={poster}
        />
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 rounded-lg bg-gradient-to-t from-background to-transparent"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute right-2 top-2 z-50"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Tooltip content="Remove" delay={1000}>
            <Button
              isIconOnly
              color="danger"
              radius="full"
              size="sm"
              variant="light"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveEpisode(id);
              }}
            >
              <X size={16} />
            </Button>
          </Tooltip>
        </motion.div>
        <div className="absolute inset-x-0 bottom-2 z-40 flex w-full flex-col justify-end gap-1 px-2">
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="relative z-20"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="line-clamp-1 text-lg font-semibold">{title}</h4>
            <p>Episode {episodeNumber}</p>
          </motion.div>
          <Progress
            aria-label="Continue Watching Progress"
            className="w-full"
            size="sm"
            value={progress}
          />
        </div>
      </div>
    </div>
  );
};

const ContinueWatching: React.FC = () => {
  const isSSR = useIsSSR();
  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);
  const [videoProgress, setVideoProgress] = useState<
    Record<string, VideoProgressData>
  >({});
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    setCanScrollPrev(false);
    setCanScrollNext(Object.entries(videoProgress).length > 4);
  }, [Object.entries(videoProgress)]);

  useEffect(() => {
    const data = localStorage.getItem("vidstack_settings");

    if (data) {
      setVideoProgress(JSON.parse(data));
    }
  }, []);

  const removeEpisode = (id: string) => {
    const updatedProgress = { ...videoProgress };

    delete updatedProgress[id];
    setVideoProgress(updatedProgress);
    localStorage.setItem("vidstack_settings", JSON.stringify(updatedProgress));
  };

  const removeAllEpisodes = () => {
    setVideoProgress({});
    localStorage.removeItem("vidstack_settings");
  };

  if (isSSR) return null;
  if (!videoProgress || Object.entries(videoProgress).length <= 0) return null;

  return (
    <div className="mt-10">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="select-none text-3xl font-bold">Continue Watching</h1>
        <div className="flex items-center space-x-2">
          <Button
            isIconOnly
            color="danger"
            radius="full"
            onClick={removeAllEpisodes}
          >
            <Trash2 size={18} />
          </Button>
          <div
            ref={prevRef}
            className={`cursor-pointer ${
              canScrollPrev ? "text-foreground" : "text-foreground-400"
            }`}
          >
            <ArrowLeft size={24} />
          </div>
          <div
            ref={nextRef}
            className={`cursor-pointer ${
              canScrollNext ? "text-foreground" : "text-foreground-400"
            }`}
          >
            <ArrowRight size={24} />
          </div>
        </div>
      </div>
      <Swiper
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          1020: {
            slidesPerView: 4,
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
        {Object.entries(videoProgress).map(([id, progressData]) => (
          <SwiperSlide key={id}>
            <ContinueWatchingCard
              duration={progressData.duration}
              episodeId={progressData.episodeId}
              episodeNumber={progressData.episodeNumber}
              id={id}
              poster={progressData.poster}
              provider={progressData.provider}
              subType={progressData.subType}
              timeWatched={progressData.timeWatched}
              title={progressData.title}
              onRemoveEpisode={removeEpisode}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ContinueWatching;
