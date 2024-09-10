"use client";

import React, { useEffect } from "react";
import { Search, Home, ArrowLeft } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

type InfoNavProps = {
  title?: string;
};

const InfoNavBar: React.FC<InfoNavProps> = ({ title }) => {
  const controls = useAnimation();
  const titleControls = useAnimation();
  const router = useRouter();
  const { theme } = useTheme();

  function previous() {
    router.back();
  }

  const backgroundColor =
    theme === "dark" ? "rgba(0, 0, 0, 0.9)" : "rgba(255, 255, 255, 0.7)";

  const handleScroll = () => {
    if (window.scrollY > 50) {
      titleControls.start({ opacity: 1 });
      controls.start({ backgroundColor });
    } else {
      titleControls.start({ opacity: 0 });
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
      <div className={`flex-1 text-xl`}>
        <div className="flex items-center gap-4">
          <button onClick={previous}>
            <ArrowLeft />
          </button>
          <Link href="/">
            <Home />
          </Link>
          <motion.h1
            animate={titleControls}
            className="line-clamp-2 text-sm md:text-lg"
          >
            {title}
          </motion.h1>
        </div>
      </div>
      <div className="flex items-center">
        <Link className={`text-foreground transition-colors`} href="/search">
          <Search className="h-6 w-6" />
        </Link>
      </div>
    </motion.nav>
  );
};

export default InfoNavBar;
