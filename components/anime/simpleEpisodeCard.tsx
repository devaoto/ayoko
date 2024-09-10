"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Image } from "@nextui-org/image";
import NextImage from "next/image";
import { Button } from "@nextui-org/button";
import { Play } from "lucide-react";

type EpisodeCardProps = {
  id: string;
  sub: "sub" | "dub";
  providerId: string;
  thumbnail: string;
  title: string;
  number: number;
};

export const EpisodeCard = ({
  id,
  thumbnail,
  title,
  number,
  providerId,
  sub,
}: EpisodeCardProps) => {
  return (
    <Link
      href={`/watch/${id}?number=${number}&server=${providerId}&subType=${sub}`}
    >
      <motion.div
        className="relative flex flex-col justify-center gap-4 rounded-lg p-4"
        transition={{ type: "spring", stiffness: 300 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative sm:max-h-[124px] sm:min-h-[124px] sm:min-w-[248px] sm:max-w-[248px]">
          <Image
            alt={title}
            as={NextImage}
            className="aspect-video rounded-lg object-cover sm:max-h-[124px] sm:min-h-[124px] sm:min-w-[248px] sm:max-w-[248px]"
            height={224}
            src={thumbnail}
            width={448}
          />
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ opacity: 1 }}
          >
            <Button isIconOnly className="!bg-transparent" variant="light">
              <Play />
            </Button>
          </motion.div>
        </div>
        <div>
          <h3 className="text-lg font-medium">Episode {number}</h3>
          <h4
            className="line-clamp-1 max-w-[248px] text-sm text-foreground-500"
            title={title}
          >
            {title}
          </h4>
        </div>
      </motion.div>
    </Link>
  );
};
