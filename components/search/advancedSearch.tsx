"use client";

import React, { SetStateAction, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import axios from "axios";
import { toast } from "sonner";
import useDebounce from "react-use/lib/useDebounce";

import { Card } from "../shared/card";

import { ANIFY_URL } from "@/config/api";

interface SearchResult {
  id: string;
  title: {
    english: string;
    romaji: string;
    native: string;
  };
  coverImage: string;
  type: string;
  format: string;
  year: number | null;
  genres: string[];
  tags: string[];
  bannerImage: string;
  color: string;
  trailer: string;
  description: string;
  status: string;
  season: string;
  artwork: any[];
}

const AdvancedSearch: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [format, setFormat] = useState(searchParams.get("format") ?? "");
  const [genres, setGenres] = useState<string[]>(
    searchParams.get("genres")?.split(",") || [],
  );
  const [season, setSeason] = useState(searchParams.get("season") ?? "UNKNOWN");
  const [genresExcluded, setGenresExcluded] = useState<string[]>(
    searchParams.get("genresExcluded")?.split(",") || [],
  );
  const [tags, setTags] = useState<string[]>(
    searchParams.get("tags")?.split(",") || [],
  );
  const [tagsExcluded, setTagsExcluded] = useState<string[]>(
    searchParams.get("tagsExcluded")?.split(",") || [],
  );
  const [year, setYear] = useState<number | null>(
    searchParams.get("year") ? parseInt(searchParams.get("year")!) : null,
  );
  const [results, setResults] = useState<SearchResult[]>([]);

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
    "Shoujo Ai",
    "Shounen",
    "Shounen Ai",
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
    "UNKNOWN",
  ];

  useDebounce(
    () => {
      handleSearch();
    },
    1000,
    [query, format, genres, genresExcluded, tags, tagsExcluded, year, season],
  );

  const handleSearch = async () => {
    const params = new URLSearchParams();

    if (query) params.append("query", query);
    if (format) params.append("format", format);
    if (genres.length > 0) params.append("genres", genres.join(","));
    if (genresExcluded.length > 0)
      params.append("genresExcluded", genresExcluded.join(","));
    if (tags.length > 0) params.append("tags", tags.join(","));
    if (tagsExcluded.length > 0)
      params.append("tagsExcluded", tagsExcluded.join(","));
    if (year) params.append("year", year.toString());
    if (season) params.append("season", season);
    params.append("type", "ANIME");

    router.push(`/search?${params.toString()}`);

    try {
      const response = await axios.get(`${ANIFY_URL}/search-advanced`, {
        params,
      });

      setResults(response.data.results);
    } catch (error) {
      toast.error("Error fetching search results");
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Advanced Search</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <Input
            label="Search Query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <Select
            label="Season"
            value={season}
            onSelect={({ currentTarget }) => setSeason(currentTarget.value)}
          >
            <SelectItem key="summer" value="SUMMER">
              Summer
            </SelectItem>
            <SelectItem key="spring" value="SPRING">
              Spring
            </SelectItem>
            <SelectItem key="winter" value="WINTER">
              Winter
            </SelectItem>
            <SelectItem key="fall" value="FALL">
              Fall
            </SelectItem>
            <SelectItem key="unknown" value="UNKNOWN">
              Unknown
            </SelectItem>
          </Select>

          <Select
            label="Format"
            value={format}
            onSelect={({ currentTarget }) => setFormat(currentTarget.value)}
          >
            {allFormats.map((fmt) => (
              <SelectItem key={fmt} value={fmt}>
                {fmt}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Year"
            type="number"
            value={year?.toString() ?? ""}
            onChange={(e) =>
              setYear(e.target.value ? parseInt(e.target.value) : null)
            }
          />
        </div>

        <div className="space-y-4">
          <Select
            label="Genres"
            selectionMode="multiple"
            value={genres}
            onSelectionChange={(keys) =>
              setGenres(Array.from(keys) as SetStateAction<string[]>)
            }
          >
            {allGenres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Excluded Genres"
            selectionMode="multiple"
            value={genresExcluded}
            onSelectionChange={(keys) =>
              setGenresExcluded(Array.from(keys) as SetStateAction<string[]>)
            }
          >
            {allGenres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Tags"
            selectionMode="multiple"
            value={tags}
            onSelectionChange={(keys) =>
              setTags(Array.from(keys) as SetStateAction<string[]>)
            }
          >
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Excluded Tags"
            selectionMode="multiple"
            value={tagsExcluded}
            onSelectionChange={(keys) =>
              setTagsExcluded(Array.from(keys) as SetStateAction<string[]>)
            }
          >
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {results.map((result) => (
          <Card key={result.id} anime={result} />
        ))}
      </div>
    </div>
  );
};

export default AdvancedSearch;
