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

export function indexToMonth(index: number): string | undefined {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const adjustedIndex = index - 1;

  if (adjustedIndex >= 0 && adjustedIndex < months.length) {
    return months[adjustedIndex];
  }

  return undefined;
}

export function getSeason(date: Date): { season: string; year: number } {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month >= 1 && month <= 3) {
    return { season: "WINTER", year };
  } else if (month >= 4 && month <= 6) {
    return { season: "SPRING", year };
  } else if (month >= 7 && month <= 9) {
    return { season: "SUMMER", year };
  } else {
    return { season: "FALL", year };
  }
}
