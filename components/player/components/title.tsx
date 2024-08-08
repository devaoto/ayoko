import { ChapterTitle } from "@vidstack/react";
import { useEffect, useRef, useState } from "react";

export function Title({ title }: Readonly<{ title?: string }>) {
  const chapterTitleRef = useRef<HTMLSpanElement>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if (chapterTitleRef.current?.textContent === "") {
      setIsEmpty(true);
    }
  }, []);

  return (
    <span className="inline-block flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-2 text-sm font-medium text-white/70">
      <span className="mr-1">|</span>
      {isEmpty ? (
        <span>{title ?? "No Title"}</span>
      ) : (
        <ChapterTitle ref={chapterTitleRef} />
      )}
    </span>
  );
}
