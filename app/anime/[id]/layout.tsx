import { Metadata, Viewport } from "next";

import { getInfo } from "@/lib/anime";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const info = await getInfo(params.id);

  return {
    title: info.title.english || info.title.romaji,
    description: info.description.slice(0, 180),
    openGraph: {
      images: info.coverImage,
    },
  };
};

export const generateViewport = async ({
  params,
}: {
  params: { id: string };
}): Promise<Viewport> => {
  const info = await getInfo(params.id);

  return {
    themeColor: info.color || "#FFFFFF",
  };
};

export default function InfoPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {children}
    </main>
  );
}
