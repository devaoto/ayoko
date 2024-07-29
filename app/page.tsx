import { use } from "react";

import { Hero } from "@/components/home/spotlight";
import { getSpotlight } from "@/lib/anime";

export default function Home() {
  const spotlight = use(getSpotlight());

  return (
    <div>
      <Hero anime={spotlight} />
    </div>
  );
}
