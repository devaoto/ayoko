export interface ITitle {
  english: string;
  romaji: string;
  native: string;
}

export interface IPopularity {
  tmdb: number;
  mal: number;
  anilist: number;
}

export interface IVoiceActor {
  name: string;
  image: string;
}

export interface ICharacter {
  name: string;
  image: string;
  voiceActor: IVoiceActor;
}

export interface IAnime {
  id: string;
  coverImage: string;
  bannerImage: string;
  trailer: string;
  status:
    | "RELEASING"
    | "FINISHED"
    | "HIATUS"
    | "CANCELLED"
    | "NOT_YET_RELEASED";
  season: "FALL" | "SPRING" | "SUMMER" | "WINTER";
  title: ITitle;
  countryOfOrigin: string;
  year: number;
  popularity: IPopularity;
  currentEpisode: number;
  totalEpisodes: number;
  synonyms: string[];
  format: string;
  duration: number;
  description: string;
  genres: string[];
  characters: ICharacter[];
}
