"use client";

import { usePathname } from "next/navigation";
import { isMobile } from "react-device-detect";
import { useTheme } from "next-themes";

import { DesktopSideBar } from "./desktop";
import { MobileBottomBar } from "./mobile";

export default function SideBar() {
  const pathname = usePathname();
  const { theme } = useTheme();

  return isMobile ? (
    <MobileBottomBar pathname={pathname} />
  ) : (
    <DesktopSideBar pathname={pathname} theme={theme} />
  );
}
