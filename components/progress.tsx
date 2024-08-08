"use client";

import { Suspense } from "react";
import { AppProgressBar } from "next-nprogress-bar";

export default function ProgressBar() {
  return (
    <Suspense>
      <AppProgressBar
        shallowRouting
        color="#41968e"
        height="4px"
        options={{ showSpinner: false }}
      />
    </Suspense>
  );
}
