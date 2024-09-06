"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { toast } from "sonner";
import useDebounce from "react-use/lib/useDebounce";

import { Card } from "../shared/card";
import { Navbar } from "../navbar";

import { AnimeSeasonal, AnimeSeasonalModified } from "@/lib/anime";

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
      type: "ANIME",
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

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="space-y-6 md:w-1/4">
            <div className="grid grid-cols-1 gap-6">
              <Select
                placeholder="Format"
                selectedKeys={format ? new Set([format]) : new Set([])}
                onSelectionChange={(keys) =>
                  setFormat(Array.from(keys)[0] as string)
                }
              >
                {allFormats.map((fmt) => (
                  <SelectItem key={fmt} textValue={fmt} value={fmt}>
                    {fmt}
                  </SelectItem>
                ))}
              </Select>

              <Select
                placeholder="Status"
                selectedKeys={status ? new Set([status]) : new Set([])}
                onSelectionChange={(keys) =>
                  setStatus(Array.from(keys)[0] as string)
                }
              >
                {allStatuses.map((stat) => (
                  <SelectItem key={stat} textValue={stat} value={stat}>
                    {stat}
                  </SelectItem>
                ))}
              </Select>

              <Select
                placeholder="Genres"
                selectedKeys={new Set(genres)}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setGenres(Array.from(keys) as string[])
                }
              >
                {allGenres.map((genre) => (
                  <SelectItem key={genre} textValue={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </Select>

              <Select
                placeholder="Tags"
                selectedKeys={new Set(tags)}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setTags(Array.from(keys) as string[])
                }
              >
                {allTags.map((tag) => (
                  <SelectItem key={tag} textValue={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="space-y-4">
              <Input
                className="w-full"
                placeholder="Search anime..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Select
                placeholder="Year"
                selectedKeys={year ? new Set([year.toString()]) : new Set()}
                onSelectionChange={(keys) => {
                  const selectedYear = Array.from(keys)[0];

                  if (selectedYear) {
                    setYear(parseInt(selectedYear as string));
                  }
                }}
              >
                {Array.from(
                  { length: 30 },
                  (_, i) => new Date().getFullYear() - i,
                ).map((y) => (
                  <SelectItem
                    key={y.toString()}
                    textValue={y.toString()}
                    value={y.toString()}
                  >
                    {y}
                  </SelectItem>
                ))}
              </Select>

              <RadioGroup
                label="Season"
                value={season}
                onValueChange={setSeason}
              >
                {allSeasons.map((s) => (
                  <Radio key={s} value={s}>
                    {s}
                  </Radio>
                ))}
              </RadioGroup>

              <RadioGroup
                label="Country of Origin"
                value={countryOfOrigin}
                onValueChange={setCountryOfOrigin}
              >
                {allCountries.map((country) => (
                  <Radio key={country.value} value={country.value}>
                    {country.label}
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Right side - Anime results */}
          <div className="flex flex-wrap gap-5 md:w-3/4">
            {results.map((result) => (
              <Card key={result.id} anime={result} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancedSearch;
