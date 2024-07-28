"use client";

import { FC } from "react";
import { Button } from "@nextui-org/button";
import { Home, Search } from "lucide-react";

import { ThemeSwitch } from "../theme-switch";

type MobileBottomBarProps = {
  pathname?: string;
};

const MobileBottomBar: FC<MobileBottomBarProps> = ({ pathname }) => {
  return (
    <div className="fixed bottom-0 flex w-full justify-around border-t border-gray-200 bg-white py-2 dark:border-gray-800 dark:bg-black">
      <div className="flex flex-col items-center">
        <Button
          isIconOnly
          color="primary"
          radius="full"
          variant={pathname === "/" ? "solid" : "light"}
        >
          <Home />
        </Button>
        <span className="mt-1 text-xs">Home</span>
      </div>
      <div className="flex flex-col items-center">
        <Button
          isIconOnly
          color="primary"
          radius="full"
          variant={pathname === "/catalogue" ? "solid" : "light"}
        >
          <Search />
        </Button>
        <span className="mt-1 text-xs">Catalogue</span>
      </div>
      <div className="flex flex-col items-center">
        <ThemeSwitch />
        <span className="mt-1 text-xs">Theme</span>
      </div>
    </div>
  );
};

export { MobileBottomBar, type MobileBottomBarProps };
