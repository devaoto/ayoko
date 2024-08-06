export function changeStatus(
  status:
    | "RELEASING"
    | "FINISHED"
    | "HIATUS"
    | "CANCELLED"
    | "NOT_YET_RELEASED",
) {
  return status === "RELEASING"
    ? "Ongoing"
    : status === "FINISHED"
      ? "Completed"
      : status === "HIATUS"
        ? "Hiatus"
        : status === "CANCELLED"
          ? "Cancelled"
          : "Not Yet Released";
}

export function changeSeason(season: "FALL" | "SPRING" | "SUMMER" | "WINTER") {
  return season === "FALL"
    ? "Fall"
    : season === "SPRING"
      ? "Spring"
      : season === "SUMMER"
        ? "Summer"
        : "Winter";
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  if (isNaN(date.getTime())) {
    return "NaN";
  }

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "min"],
  ];

  for (const [secondsInInterval, label] of intervals) {
    const interval = Math.floor(seconds / secondsInInterval);

    if (interval >= 1) {
      return interval + ` ${label}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return (
    Math.floor(seconds) + ` second${Math.floor(seconds) > 1 ? "s" : ""} ago`
  );
}

export function formatUnixTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}
