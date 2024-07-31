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
