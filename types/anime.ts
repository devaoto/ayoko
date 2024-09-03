export interface SeasonalInfo {
  id: string;
  trailer: string;
  title: {
    english: string;
    native: string;
    romaji: string;
  };
  rating: {
    anilist: number;
    tmdb: number;
    kitsu: number;
  };
  coverImage: string;
  bannerImage: string;
  year: number;
  description: string;
  format: string;
  season: string;
  totalEpisodes: number;
  duration: number;
}

export interface AnifySeasonal {
  trending: SeasonalInfo[];
  popular: SeasonalInfo[];
  top: SeasonalInfo[];
  seasonal: SeasonalInfo[];
}

export interface AnimeTitle {
  english: string;
  romaji: string;
  native: string;
}

export interface AnifyMappings {
  id: string;
  providerId: string;
  similarity: number;
  providerType: string;
}

export interface AnifyRelation {
  id: string;
  type: string;
  title: AnimeTitle;
  format: string;
  relationType: string;
}

export interface AnifyEpisode {
  id: string;
  img: string | null;
  title: string | null;
  hasDub: boolean | null;
  rating: string | null;
  isFiller: boolean | null;
  updatedAt: number;
  description: string | null;
}

export interface AnifyEpisodes {
  providerId: string;
  episodes: AnifyEpisode[];
}

export interface AnifyArtwork {
  img: string;
  type: string;
  providerId: string;
}

export interface AnifyInfo {
  id: string;
  slug: string;
  coverImage: string;
  bannerImage: string;
  trailer: string;
  status: string;
  season: string;
  title: AnimeTitle;
  currentEpisode: number;
  mappings: AnifyMappings[];
  synonyms: string[];
  countryOfOrigin: string;
  description: string;
  duration: number;
  year: number;
  color: string;
  rating: {
    tmdb: number;
    anilist: number;
    kitsu: number;
  };
  popularity: {
    tmdb: number;
    anilist: number;
  };
  type: string;
  format: string;
  relations: AnifyRelation[];
  totalEpisodes: number;
  genres: string[];
  tags: string[];
  episodes: {
    data: AnifyEpisodes[];
  };
  averagePopularity: number;
  averageRating: number;
  artwork: AnifyArtwork[];
}

export interface AnifySearch {
  results: AnifyInfo[];
  total: number;
  lastPage: number;
}

export interface FuzzyDate {
  month: number;
  day: number;
  year: number;
}

export interface AnimeStudioNode {
  id: number;
  name: string;
  isAnimationStudio: boolean;
  favourites: number;
}

export interface AnimeStudioEdge {
  isMain: boolean;
  id: number;
  node: AnimeStudioNode;
}

export interface AnilistInfo {
  idMal: number;
  studios: {
    edges: AnimeStudioEdge[];
  };
  startDate: FuzzyDate;
  endDate: FuzzyDate | null;
}

export interface AnilistResponse {
  data: {
    Media: AnilistInfo;
  };
}

export type AnimeInfo = AnifyInfo & AnilistInfo;

export interface Episode {
  id: string;
  number: number;
  description: string;
  isFiller: boolean;
  released: string;
  rating: string;
  thumbnail: string;
  title: string;
  duration: number;
  season: number;
  tvdbId: number;
}

export interface Episodes {
  sub: Episode[];
  dub: Episode[];
}

export interface Provider {
  providerId: string;
  episodes: Episodes;
}

export interface CharactersRes {
  data: Data;
}

export interface Data {
  Media: Media;
}

export interface Media {
  characters: Characters;
}

export interface Characters {
  edges: Edge[];
}

export interface Edge {
  id: number;
  name: string | null;
  role: string;
  node: CharacterNode;
  voiceActors: VoiceActor[];
}

export interface CharacterNode {
  age: string | null;
  bloodType: string | null;
  dateOfBirth: DateOfBirth;
  description: string | null;
  favourites: number;
  gender: string | null;
  id: number;
  image: Image;
  name: CharacterName;
}

export interface DateOfBirth {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface Image {
  large: string;
  medium: string;
}

export interface CharacterName {
  first: string | null;
  middle: string | null;
  last: string | null;
  full: string | null;
  native: string | null;
  alternative: string[];
  alternativeSpoiler: string[];
  userPreferred: string;
}

export interface VoiceActor {
  age: number | null;
  bloodType: string | null;
  gender: string | null;
  homeTown: string | null;
  id: number;
  image: Image;
  languageV2: string;
  name: VoiceActorName;
}

export interface VoiceActorName {
  first: string | null;
  middle: string | null;
  last: string | null;
  full: string | null;
  native: string | null;
  alternative: string[];
  userPreferred: string;
}
