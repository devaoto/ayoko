import { Suspense } from "react";

import AdvancedSearch from "@/components/search/advancedSearch";

export default function Search() {
  return (
    <Suspense>
      <AdvancedSearch />
    </Suspense>
  );
}
