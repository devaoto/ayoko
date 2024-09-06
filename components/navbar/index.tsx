"use client";

import React from "react";

import HomeNavBar from "./homeNav";
import InfoNavBar from "./infoNav";
import SearchNavBar from "./searchNav";

type NavBarProps = {
  navFor?: "home" | "info" | "search";
  title?: string;
};

const Navbar: React.FC<NavBarProps> = ({ navFor, title }) => {
  let navType = navFor ?? "home";

  return navType === "home" ? (
    <HomeNavBar />
  ) : navType === "info" ? (
    <InfoNavBar title={title} />
  ) : (
    <SearchNavBar />
  );
};

export { Navbar };
