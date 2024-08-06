export interface CardArtwork {
  img: string;
  type: string;
  providerId: "anilist" | "tvdb" | "tmdb" | "kitsu";
}

export interface CardTitle {
  romaji: string;
  native: string;
  english: string;
}

export interface AnimeCard {
  id: string;
  title: CardTitle;
  coverImage: string;
  bannerImage: string;
  description: string;
  trailer: string;
  season: string;
  status: string;
  artwork: CardArtwork[];
}
