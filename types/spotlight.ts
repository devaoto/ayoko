export interface SpotlightArtwork {
  img: string;
  type: string;
  providerId: "anilist" | "tvdb" | "tmdb" | "kitsu";
}

export interface SpotlightTitle {
  romaji: string;
  native: string;
  english: string;
}

export interface Spotlight {
  id: string;
  title: SpotlightTitle;
  coverImage: string;
  bannerImage: string;
  description: string;
  color: string;
  trailer: string;
  artwork: SpotlightArtwork[];
}
