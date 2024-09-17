"use client";

import { useEffect } from "react";

export default function Err({
  error,
  reset,
}: Readonly<{
  error: Error;
  reset: () => void;
}>) {
  useEffect(() => {
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
