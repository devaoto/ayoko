"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

import { AnimeSeasonalModified } from "@/lib/anime";

type CompactCardProps = {
  anime: AnimeSeasonalModified;
};

const CompactCard: React.FC<CompactCardProps> = ({ anime }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      ref={ref}
      animate={isInView ? "visible" : "hidden"}
      className="flex items-center rounded-md bg-zinc-400 p-4 text-foreground dark:bg-zinc-900"
      initial="hidden"
      variants={cardVariants}
      onHoverEnd={() => setIsHovered(false)}
      onHoverStart={() => setIsHovered(true)}
    >
      <img
        alt={anime.title.english ?? anime.title.romaji}
        className="h-20 w-14 object-cover"
        height="80"
        src={anime.coverImage}
        width="60"
      />
      <div className="ml-4 flex-1">
        <motion.h2
          className="text-lg font-medium"
          style={{
            color: isHovered ? (anime.color ? anime.color : "#FFFFFF") : "",
          }}
        >
          {anime.title.english ?? anime.title.romaji}
        </motion.h2>
        <div className="text-muted-foreground flex items-center text-sm">
          <Star className="mr-1 h-4 w-4" />
          {anime.averageScore && (
            <>
              <span>{anime.averageScore / 10}</span>{" "}
              <span className="mx-2">•</span>
            </>
          )}
          <span>{anime.season}</span>
          <span className="mx-2">•</span>
          <span>{anime.status}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm">{anime.format}</div>
        <div className="text-muted-foreground text-sm">
          {anime.episodes} episodes
        </div>
      </div>
    </motion.div>
  );
};

export const CompactCards: React.FC<{ anime: AnimeSeasonalModified[] }> = ({
  anime,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {anime.map((ani) => (
        <Link key={ani.id} href={`/anime/${ani.id}`}>
          <CompactCard anime={ani} />
        </Link>
      ))}
    </div>
  );
};
