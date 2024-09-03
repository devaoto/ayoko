import { useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import { Image } from "@nextui-org/image";
import NextImage from "next/image";
import Link from "next/link";
import { Skeleton } from "@nextui-org/skeleton";

import { Status } from "../home/status";

import { AnimeCard } from "@/types/cards";

export const Card = ({ anime }: { anime: AnimeCard | undefined }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const cardVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hidden: { opacity: 0, y: 20 },
    hover: {
      y: -5,
    },
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      {anime ? (
        <Link
          href={`/anime/${anime.id}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            ref={ref}
            animate={isInView ? "visible" : "hidden"}
            initial="hidden"
            variants={cardVariants}
            whileHover="hover"
          >
            <Image
              alt={anime.title.romaji}
              as={NextImage}
              className="max-h-[240px] min-h-[240px] min-w-[165px] max-w-[165px] !rounded-sm object-cover"
              height={278}
              src={anime.coverImage.replace("kitsu.io", "kitsu.app")}
              width={185}
            />
          </motion.div>

          <div className="line-clamp-1 flex max-w-[165px] items-center gap-1 font-medium">
            <Status status={anime.status} />{" "}
            <div
              className="line-clamp-2 max-w-[145px] text-sm"
              style={{
                color: isHovered ? (anime.color ? anime.color : "#FFFFFF") : "",
              }}
            >
              {anime.title.english || anime.title.romaji}
            </div>
          </div>
        </Link>
      ) : (
        <>
          <Skeleton className="h-[240px] w-[165px] rounded-lg object-cover" />
          <Skeleton className="mt-1 h-4 w-[155px] rounded-lg font-medium" />
        </>
      )}
    </>
  );
};
