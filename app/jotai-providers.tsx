"use client";

import { Provider } from "jotai";
import React from "react";

export const JotaiProviders = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <Provider>{children}</Provider>;
};
