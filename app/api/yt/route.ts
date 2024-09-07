import ytdl from "@distube/ytdl-core";
import { NextRequest, NextResponse } from "next/server";

const getTrailer = async (id: string) => {
  let constructedUrl = ytdl.getURLVideoID(
    `https://www.youtube.com/watch?v=${id}`,
  );

  const info = await ytdl.getInfo(constructedUrl);

  const video = info.formats
    .filter((e) => e.hasVideo)
    .find((e) => !e.isHLS && e.audioQuality)?.url;

  return video;
};

export const GET = async (req: NextRequest) => {
  const searchParams = new URL(req.url).searchParams;

  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Id is required" }, { status: 400 });
  }

  const url = await getTrailer(id);

  return NextResponse.json({
    url,
  });
};
