"use client";

import React, { useState, useEffect } from "react";
import { Tooltip } from "@nextui-org/tooltip";

import { formatUnixTimestamp } from "@/lib/utils";

interface Props {
  airingAt: number;
}

const TimeUntilAiring: React.FC<Props> = ({ airingAt }) => {
  const [timeLeft, setTimeLeft] = useState<string>(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = Date.now();
    const diff = airingAt * 1000 - now;

    if (diff <= 0) {
      return "Airing now or already aired";
    }

    const intervals = [
      [24 * 60 * 60 * 1000, "day"],
      [60 * 60 * 1000, "hour"],
      [60 * 1000, "min"],
    ];

    let remainingTime = diff;
    const resultParts = [];

    for (const [millisecondsInInterval, label] of intervals) {
      const intervalCount = Math.floor(
        remainingTime / Number(millisecondsInInterval),
      );

      if (intervalCount > 0) {
        resultParts.push(
          `${intervalCount} ${label}${intervalCount > 1 ? "s" : ""}`,
        );
        remainingTime %= Number(millisecondsInInterval);
      }
    }

    return `Airing in ${resultParts.join(" ")}`.trim();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(interval);
  }, [airingAt]);

  return (
    <Tooltip content={timeLeft} offset={2}>
      <div className="underline">{formatUnixTimestamp(airingAt)}</div>
    </Tooltip>
  );
};

export default TimeUntilAiring;
