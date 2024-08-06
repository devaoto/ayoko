import type { Omit } from "lodash";

export interface ReturnEpisode {
  id: string;
  title: string;
  number: number;
  image: string;
  createdAt: string;
  description: string;
  season: number;
  rating: number;
}

export interface EpisodeReturn {
  providerId: "hianime" | "9anime" | "gogoanime" | "animepahe" | "sudatchi";
  episodes: {
    sub: ReturnEpisode[];
    dub: ReturnEpisode[];
  };
}

export interface ConsumetEpisode {
  id: string;
  title: string | null;
  image: string;
  imageHash: string;
  number: number;
  createdAt: null;
  description: null;
  url: string;
}
export interface Titles {
  "x-jat": string;
  ja: string;
  en: string;
}

export interface EpisodeTitle {
  ja: string;
  en: string;
  "x-jat": string;
}

export interface Episode {
  tvdbShowId: number;
  tvdbId: number;
  seasonNumber: number;
  episodeNumber: number;
  absoluteEpisodeNumber: number;
  title: EpisodeTitle;
  airDate: string;
  airDateUtc: string;
  runtime: number;
  overview: string;
  image: string;
  episode: string;
  anidbEid: number;
  length: number;
  airdate: string;
  rating: string;
  summary: string;
  finaleType?: string;
}

export interface Episodes {
  [key: string]: Episode;
}

export interface Image {
  coverType: string;
  url: string;
}

export interface Mappings {
  animeplanet_id: string;
  kitsu_id: number;
  mal_id: number;
  type: string;
  anilist_id: number;
  anisearch_id: number;
  anidb_id: number;
  notifymoe_id: string;
  livechart_id: number;
  thetvdb_id: number;
  imdb_id: string | null;
  themoviedb_id: string | null;
}

export interface AniZipData {
  titles: Titles;
  episodes: Episodes;
  episodeCount: number;
  specialCount: number;
  images: Image[];
  mappings: Mappings;
}

export interface ProviderEpisodes {
  sub: Omit<
    ConsumetEpisode,
    "image" | "imageHash" | "description" | "createdAt"
  >[];
  dub: Omit<
    ConsumetEpisode,
    "image" | "imageHash" | "description" | "createdAt"
  >[];
}

export interface ProviderData {
  providerId: string;
  episodes: ProviderEpisodes;
}

export interface SiteDetail {
  identifier: string | number;
  image: string;
  malId: number;
  aniId: number;
  page: string;
  title: string;
  type: string;
  url: string;
  external?: boolean;
}

export interface Sites {
  [key: string]: {
    [key: string]: SiteDetail;
  };
}

export interface MalSync {
  id: number;
  type: string;
  title: string;
  url: string;
  total: number | null;
  image: string;
  malId: number;
  Sites: Sites;
}

export interface GogoAnimeInfo {
  id: string;
  title: string;
  url: string;
  genres: string[];
  totalEpisodes: number;
  image: string;
  releaseDate: string;
  description: string;
  subOrDub: string;
  type: string;
  status: string;
  otherName: string;
  episodes: GogoEpisode[];
}

export interface GogoEpisode {
  id: string;
  number: number;
  url: string;
}

export interface HiAnimeEpisode {
  title: string;
  episodeId: string;
  number: number;
  isFiller: boolean;
}

export interface HiAnimeEpisodesData {
  totalEpisodes: number;
  episodes: HiAnimeEpisode[];
}

export interface AniEpisode {
  id: string;
  isFiller: boolean;
  number: number;
  title: string;
  img: string | null;
  hasDub: boolean;
  description: string | null;
  rating: number | null;
  updatedAt: number;
}

export interface AniProvider {
  providerId: string;
  episodes: AniEpisode[];
}

export type AniProviders = AniProvider[];
