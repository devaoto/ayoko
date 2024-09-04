"use client";

import React from "react";

import HomeNavBar from "./homeNav";
import InfoNavBar from "./infoNav";

type NavBarProps = {
  navFor?: "home" | "info";
  title?: string;
};

const Navbar: React.FC<NavBarProps> = ({ navFor, title }) => {
  let navType = navFor ?? ("home" as "home" | "info");

  return navType === "home" ? <HomeNavBar /> : <InfoNavBar title={title} />;
};

export { Navbar };
