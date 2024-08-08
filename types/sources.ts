export interface Track {
  file: string;
  label: string;
  kind: string;
  default?: boolean;
}

export interface TimeTrack {
  start: number;
  end: number;
}

export interface Source {
  url: string;
  type: string;
}

export interface HiAnimeSource {
  sources: Source[];
  tracks: Track[];
  intro: TimeTrack;
  outro: TimeTrack;
  anilistID: number;
  malID: number;
}

export interface AnifySubttile {
  url: string;
  lang: string;
  label?: string;
}

export interface AnifyAudio {
  url: string;
  name: string;
  language: number;
}

export interface AnifyHeaders {
  [key: string]: string;
}

export interface AnifySource {
  quality: string;
  url: string;
}

export interface AnifyData {
  sources: AnifySource[];
  subtitles?: AnifySubttile[];
  audios?: AnifyAudio[];
  headers?: AnifyHeaders;
  intro?: TimeTrack;
  outro?: TimeTrack;
}

export interface GogoAnimeSource {
  url: string;
  isM3U8: boolean;
  quality: string;
}

export interface GogoAnimeData {
  headers: AnifyHeaders;
  sources: GogoAnimeSource[];
  download: string;
}

export interface ReturnData {
  sources: AnifySource[];
  subtitles: AnifySubttile[];
}
