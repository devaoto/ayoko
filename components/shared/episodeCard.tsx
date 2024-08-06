"use client";

import Link from "next/link";
import NextImage from "next/image";
import { Image } from "@nextui-org/image";
import { motion } from "framer-motion";
import { Skeleton } from "@nextui-org/skeleton";

import { timeAgo } from "@/lib/utils";

type CardProps = {
  id?: string;
  episodeId?: string;
  image?: string;
  title?: string;
  overview?: string;
  sub?: string;
  createdAt?: string;
  number?: number;
  providerId: string;
};

export const EpisodeCard = ({
  id,
  episodeId,
  title,
  overview,
  image,
  sub,
  providerId,
  createdAt,
  number,
}: CardProps) => {
  let relativeTime = "No Date";

  if (createdAt !== "No date") {
    const timeAgoResult = timeAgo(createdAt!);

    if (timeAgoResult !== "NaN") {
      relativeTime = timeAgoResult;
    }
  }

  return (
    <>
      {id && episodeId && number ? (
        <Link
          href={`/watch/${id}?episodeId=${encodeURIComponent(
            episodeId,
          )}&subType=${sub}&number=${number}&server=${providerId}`}
        >
          <motion.div
            className="group flex flex-col items-start gap-4 rounded-lg p-4 sm:flex-row"
            transition={{ type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              {image ? (
                <Image
                  alt={title}
                  as={NextImage}
                  className="aspect-video w-full rounded-lg object-cover sm:max-h-[124px] sm:min-h-[124px] sm:min-w-[248px] sm:max-w-[248px]"
                  height={224}
                  src={image}
                  width={448}
                />
              ) : (
                <Skeleton className="aspect-video w-full rounded-lg sm:max-h-[124px] sm:min-h-[124px] sm:min-w-[248px] sm:max-w-[248px]" />
              )}
              <span className="absolute bottom-2 right-2 z-50 rounded-lg bg-black/75 px-2 py-1 text-xs text-white">
                EP {number}
              </span>
            </div>
            <div className="grid flex-1 gap-1">
              <h3 className="line-clamp-1 font-medium">
                {title ?? <Skeleton className="w-1/2" />}
              </h3>
              <p className="text-muted-foreground line-clamp-3 text-xs">
                {overview !== "" || overview ? overview : "No Description"}
              </p>
              <span className="text-xs text-foreground-500">
                Released {relativeTime}
              </span>
            </div>
          </motion.div>
        </Link>
      ) : (
        <Skeleton className="h-[150px] w-full rounded-lg" />
      )}
    </>
  );
};
