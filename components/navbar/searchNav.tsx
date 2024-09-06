"use client";

import React, { useEffect } from "react";
import { Home } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";

const SearchNavBar: React.FC = () => {
  const controls = useAnimation();

  const { theme } = useTheme();

  const backgroundColor =
    theme === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)";

  const handleScroll = () => {
    if (window.scrollY > 50) {
      controls.start({ backgroundColor });
    } else {
      controls.start({ backgroundColor: "transparent" });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [backgroundColor]);

  return (
    <motion.nav
      animate={controls}
      className={`fixed left-0 top-0 z-[99999] flex h-16 w-full items-center px-6 text-foreground transition-colors`}
    >
      <div className={`flex-1 text-xl font-bold text-primary`}>
        <Link href="/">Ayoko</Link>
      </div>
      <div className="flex items-center">
        <Link className={`text-foreground transition-colors`} href="/">
          <Home className="h-6 w-6" />
        </Link>
      </div>
    </motion.nav>
  );
};

export default SearchNavBar;
