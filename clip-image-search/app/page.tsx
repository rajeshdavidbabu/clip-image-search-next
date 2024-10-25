"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { searchImages, type SearchResult } from "./actions";
import Image from "next/image";
import { PillTooltip } from "@/components/pill-tooltip";

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ImageSearchApp() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<SearchResult[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300); // 300ms delay

  const handleSearch = useCallback(async () => {
    if (!debouncedQuery) {
      setImages([]);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const results = await searchImages(debouncedQuery);

      console.log("Search results: ", results);

      setImages(results);
    } catch (err) {
      console.error("Error fetching images: ", err);
      setError("Failed to fetch images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">
        CLIP Unsplash Image Search
      </h1>
      <div className="flex gap-2 mb-8">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for images..."
          className="flex-grow"
        />
        <Button disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image: SearchResult) => (
          <Card key={image.id} className="overflow-hidden relative">
            <CardContent className="p-0">
              <Image
                src={`${String(
                  image.photo_image_url
                )}?w=400&h=300&fit=crop&q=80`}
                alt={String(image.photo_description)}
                className="w-full h-48 object-cover"
                width={400}
                height={300}
              />
              <div className="absolute bottom-3 left-2 w-full">
                <PillTooltip
                  similarity={image.score}
                  photo_description={image.photo_description}
                  photo_image_url={image.photo_image_url}
                  ai_description={image.ai_description}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
