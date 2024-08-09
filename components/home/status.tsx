"use client";

import { useIsSSR } from "@react-aria/ssr";

export const Status = ({ status }: { status: string }) => {
  const isSSR = useIsSSR();

  const statusColor: Record<string, string> = {
    FINISHED: "bg-green-500",
    RELEASING: "bg-blue-500",
    CANCELLED: "bg-red-500",
    HIATUS: "bg-yellow-500",
    NOT_YET_RELEASED: "bg-gray-500",
  };

  const shadowColor: Record<string, string> = {
    FINISHED: "shadow-green-500",
    RELEASING: "shadow-blue-500",
    CANCELLED: "shadow-red-500",
    HIATUS: "shadow-yellow-500",
    NOT_YET_RELEASED: "shadow-gray-500",
  };

  if (isSSR) return null;

  return (
    <div
      className={`${
        statusColor[status] || "bg-gray-500"
      } ${shadowColor[status] || "shadow-gray-500"} size-2 rounded-full shadow-lg`}
      title={
        status
          ? status
              .replace("_", " ")
              .toLowerCase()
              .split(" ")
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(" ")
          : ""
      }
    />
  );
};
