"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { toast } from "sonner";
import useDebounce from "react-use/lib/useDebounce";

import { Card } from "../shared/card";

import { AnimeSeasonal, AnimeSeasonalModified } from "@/lib/anime";
import { Navbar } from "../navbar";

const AdvancedSearch: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [format, setFormat] = useState(searchParams.get("format") ?? "");
  const [genres, setGenres] = useState<string[]>(
    searchParams.get("genres")?.split(",") || [],
  );
  const [season, setSeason] = useState(searchParams.get("season") ?? "");
  const [tags, setTags] = useState<string[]>(
    searchParams.get("tags")?.split(",") || [],
  );
  const [countryOfOrigin, setCountryOfOrigin] = useState(
    searchParams.get("countryOfOrigin") ?? "",
  );
  const [status, setStatus] = useState(searchParams.get("status") ?? "");
  const [year, setYear] = useState<number | null>(
    searchParams.get("year") ? parseInt(searchParams.get("year")!) : null,
  );
  const [results, setResults] = useState<AnimeSeasonalModified[]>([]);

  const allGenres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Ecchi",
    "Fantasy",
    "Horror",
    "Mahou Shoujo",
    "Mecha",
    "Music",
    "Mystery",
    "Psychological",
    "Romance",
    "Sci-Fi",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Thriller",
  ];

  const allTags = [
    "4-koma",
    "Aliens",
    "Alternate Universe",
    "Amnesia",
    "Anti-Hero",
    "Archery",
    "Assassins",
    "Aviation",
    "Badminton",
    "Band",
    "Baseball",
    "Basketball",
    "Battle Royale",
    "Biographical",
    "Body Swapping",
    "Boxing",
    "Calligraphy",
    "Card Battle",
    "Cars",
    "CGI",
    "Chibi",
    "Chuunibyou",
    "College",
    "Cosplay",
    "Crossdressing",
    "Cultivation",
    "Cute Girls Doing Cute Things",
    "Cyberpunk",
    "Dancing",
    "Demons",
    "Dragons",
    "Dystopian",
    "Economics",
    "Educational",
    "Episodic",
    "Espionage",
    "Fairy Tale",
    "Family Life",
    "Fashion",
    "Female Protagonist",
    "Fishing",
    "Fitness",
    "Food",
    "Gambling",
    "Gangs",
    "Ghost",
    "Gods",
    "Gore",
    "Guns",
    "Gyaru",
    "Harem",
    "Hikikomori",
    "Historical",
    "Idol",
    "Isekai",
    "Josei",
    "Kaiju",
    "Kemonomimi",
    "Kids",
    "Love Triangle",
    "Magic",
    "Mahjong",
    "Maids",
    "Male Protagonist",
    "Martial Arts",
    "Memory Manipulation",
    "Military",
    "Monster Girl",
    "Musical",
    "Mythology",
    "Nekomimi",
    "Ninja",
    "No Dialogue",
    "Nudity",
    "Otaku Culture",
    "Parody",
    "Philosophy",
    "Photography",
    "Pirates",
    "Police",
    "Politics",
    "Post-Apocalyptic",
    "Primarily Adult Cast",
    "Primarily Female Cast",
    "Primarily Male Cast",
    "Puppetry",
    "Reincarnation",
    "Revenge",
    "Reverse Harem",
    "Robots",
    "Rugby",
    "Samurai",
    "School",
    "School Club",
    "Seinen",
    "Ships",
    "Shogi",
    "Shoujo",
    "Shounen",
    "Slapstick",
    "Space",
    "Sports",
    "Super Power",
    "Super Robot",
    "Survival",
    "Swordplay",
    "Teacher",
    "Terrorism",
    "Time Manipulation",
    "Time Skip",
    "Tragedy",
    "Trains",
    "Triads",
    "Tsundere",
    "Urban Fantasy",
    "Vampire",
    "Video Games",
    "Virtual World",
    "War",
    "Witch",
    "Work",
    "Wuxia",
    "Yakuza",
    "Yandere",
    "Youkai",
    "Zombie",
  ];

  const allFormats = [
    "TV",
    "TV_SHORT",
    "MOVIE",
    "SPECIAL",
    "OVA",
    "ONA",
    "MUSIC",
    "MANGA",
    "NOVEL",
    "ONE_SHOT",
  ];

  const allStatuses = [
    "FINISHED",
    "RELEASING",
    "NOT_YET_RELEASED",
    "CANCELLED",
    "HIATUS",
  ];

  const allCountries = [
    { value: "JP", label: "Japan" },
    { value: "KR", label: "South Korea" },
    { value: "CN", label: "China" },
    { value: "TW", label: "Taiwan" },
  ];

  const allSeasons = ["WINTER", "SPRING", "SUMMER", "FALL"];

  useDebounce(
    () => {
      handleSearch();
    },
    1000,
    [query, format, genres, year, season, countryOfOrigin, status, tags],
  );

  const handleSearch = async () => {
    const params = new URLSearchParams();

    if (query) params.append("query", query);
    if (format) params.append("format", format);
    if (genres.length > 0) params.append("genres", genres.join(","));
    if (tags.length > 0) params.append("tags", tags.join(","));
    if (year) params.append("year", year.toString());
    if (countryOfOrigin) params.append("countryOfOrigin", countryOfOrigin);
    if (status) params.append("status", status);
    if (season) params.append("season", season);
    params.append("type", "ANIME");

    router.push(`/search?${params.toString()}`);

    const graphqlQuery = `
    query (
  $page: Int,
  $id: Int,
  $type: MediaType,
  $isAdult: Boolean = false,
  $search: String,
  $format: [MediaFormat],
  $status: MediaStatus,
  $size: Int,
  $countryOfOrigin: CountryCode,
  $source: MediaSource,
  $season: MediaSeason,
  $seasonYear: Int,
  $year: String,
  $onList: Boolean,
  $yearLesser: FuzzyDateInt,
  $yearGreater: FuzzyDateInt,
  $episodeLesser: Int,
  $episodeGreater: Int,
  $durationLesser: Int,
  $durationGreater: Int,
  $chapterLesser: Int,
  $chapterGreater: Int,
  $volumeLesser: Int,
  $volumeGreater: Int,
  $licensedBy: [String],
  $isLicensed: Boolean,
  $genres: [String],
  $excludedGenres: [String],
  $tags: [String],
  $excludedTags: [String],
  $minimumTagRank: Int,
  $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]
) {
  Page(page: $page, perPage: $size) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(
      id: $id,
      type: $type,
      season: $season,
      format_in: $format,
      status: $status,
      countryOfOrigin: $countryOfOrigin,
      source: $source,
      search: $search,
      onList: $onList,
      seasonYear: $seasonYear,
      startDate_like: $year,
      startDate_lesser: $yearLesser,
      startDate_greater: $yearGreater,
      episodes_lesser: $episodeLesser,
      episodes_greater: $episodeGreater,
      duration_lesser: $durationLesser,
      duration_greater: $durationGreater,
      chapters_lesser: $chapterLesser,
      chapters_greater: $chapterGreater,
      volumes_lesser: $volumeLesser,
      volumes_greater: $volumeGreater,
      licensedBy_in: $licensedBy,
      isLicensed: $isLicensed,
      genre_in: $genres,
      genre_not_in: $excludedGenres,
      tag_in: $tags,
      tag_not_in: $excludedTags,
      minimumTagRank: $minimumTagRank,
      sort: $sort,
      isAdult: $isAdult
    ) {
      id
      idMal
      status(version: 2)
      title {
        userPreferred
        romaji
        english
        native
      }
      bannerImage
      coverImage {
        extraLarge
        large
        medium
        color
      }
      episodes
      season
      popularity
      description
      format
      seasonYear
      genres
      averageScore
      countryOfOrigin
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      trailer {
        id
        site
        thumbnail
      }
      type
    }
  }
}

  `;

    const variables = {
      search: query || undefined,
      format: format || undefined,
      genres: genres.length > 0 ? genres : undefined,
      season: season || undefined,
      seasonYear: year ?? undefined,
      countryOfOrigin: countryOfOrigin || undefined,
      status: status || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };

    try {
      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: graphqlQuery,
          variables: variables,
        }),
      });

      const body = (await response.json()) as {
        data: { Page: { media: AnimeSeasonal[] } };
      };

      setResults(
        body.data.Page.media.map((e) => ({
          ...e,
          color: e.coverImage.color,
          coverImage:
            e.coverImage.extraLarge ||
            e.coverImage.large ||
            e.coverImage.medium,
          trailer: `https://www.youtube.com/watch?v=${e.trailer?.id}`,
        })),
      );
    } catch (error) {
      toast.error("Error fetching search results");
    }
  };

  return (
    <>
      <Navbar navFor="search" />

      <div className="container mx-auto space-y-8 px-4 py-16">
        <h1 className="mb-8 text-3xl font-light">Search Anime</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Input
            className="w-full"
            placeholder="Search anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <Select
            placeholder="Format"
            selectedKeys={[format]}
            onSelectionChange={(keys) =>
              setFormat(Array.from(keys)[0] as string)
            }
          >
            {allFormats.map((fmt) => (
              <SelectItem key={fmt} value={fmt}>
                {fmt}
              </SelectItem>
            ))}
          </Select>

          <Select
            placeholder="Season"
            selectedKeys={[season]}
            onSelectionChange={(keys) =>
              setSeason(Array.from(keys)[0] as string)
            }
          >
            {allSeasons.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </Select>

          <Select
            placeholder="Status"
            selectedKeys={[status]}
            onSelectionChange={(keys) =>
              setStatus(Array.from(keys)[0] as string)
            }
          >
            {allStatuses.map((stat) => (
              <SelectItem key={stat} value={stat}>
                {stat}
              </SelectItem>
            ))}
          </Select>

          <Select
            placeholder="Country of Origin"
            selectedKeys={[countryOfOrigin]}
            onSelectionChange={(keys) =>
              setCountryOfOrigin(Array.from(keys)[0] as string)
            }
          >
            {allCountries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </Select>

          <Input
            className="w-full"
            placeholder="Year"
            type="number"
            value={year?.toString() ?? ""}
            onChange={(e) =>
              setYear(e.target.value ? parseInt(e.target.value) : null)
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Select
            placeholder="Genres"
            selectedKeys={new Set(genres)}
            selectionMode="multiple"
            onSelectionChange={(keys) =>
              setGenres(Array.from(keys) as string[])
            }
          >
            {allGenres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </Select>

          <Select
            placeholder="Tags"
            selectedKeys={new Set(tags)}
            selectionMode="multiple"
            onSelectionChange={(keys) => setTags(Array.from(keys) as string[])}
          >
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex flex-wrap gap-5">
          {results.map((result) => (
            <Card key={result.id} anime={result} />
          ))}
        </div>
      </div>
    </>
  );
};

export default AdvancedSearch;
