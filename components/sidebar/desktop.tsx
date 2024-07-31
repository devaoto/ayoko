"use client";

import { FC, useState } from "react";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import Link from "next/link";

import { ThemeSwitch } from "../theme-switch";

type DesktopSideBarProps = {
  theme?: string;
  pathname?: string;
};

const textVariants = {
  hidden: {
    opacity: 0,
    width: 0,
  },
  visible: {
    opacity: 1,
    width: "auto",
    transition: {
      duration: 0.1,
    },
  },
};

const DesktopSideBar: FC<DesktopSideBarProps> = ({ theme, pathname }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      animate={{
        width: isHovered ? 250 : 40,
        backgroundImage: isHovered
          ? `linear-gradient(to right, ${theme === "dark" ? "rgba(0, 0, 0, 0.95)" : "rgba(255, 255, 255, 0.95)"}, transparent)`
          : "none",
      }}
      className="fixed left-0 z-[99999]"
      initial={{ width: 40, backgroundColor: "transparent" }}
      transition={{ duration: 0.2 }}
      onHoverEnd={() => setIsHovered(false)}
      onHoverStart={() => setIsHovered(true)}
    >
      <div className="flex h-screen w-[50px] flex-col items-center justify-center gap-2">
        <div className="relative flex items-center gap-1">
          <Link href={"/"}>
            <Button
              isIconOnly
              color="primary"
              radius="full"
              variant={pathname === "/" ? "solid" : "light"}
            >
              <Home />
            </Button>
          </Link>
          <motion.span
            animate={isHovered ? "visible" : "hidden"}
            className="absolute left-full overflow-hidden whitespace-nowrap pl-2"
            initial="hidden"
            variants={textVariants}
          >
            Home
          </motion.span>
        </div>
        <div className="relative flex items-center gap-2">
          <Button
            isIconOnly
            color="primary"
            radius="full"
            variant={pathname === "/catalogue" ? "solid" : "light"}
          >
            <Search />
          </Button>
          <motion.span
            animate={isHovered ? "visible" : "hidden"}
            className="absolute left-full overflow-hidden whitespace-nowrap pl-2"
            initial="hidden"
            variants={textVariants}
          >
            Catalogue
          </motion.span>
        </div>
        <div className="relative flex items-center gap-1">
          <ThemeSwitch />
          <motion.span
            animate={isHovered ? "visible" : "hidden"}
            className="absolute left-full overflow-hidden whitespace-nowrap"
            initial="hidden"
            variants={textVariants}
          >
            Theme Switch
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export { DesktopSideBar, type DesktopSideBarProps };
