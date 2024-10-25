"use server";

import axios from "axios";
import { getPineconeIndex } from "./vector-db";
import type { RecordMetadataValue } from "@pinecone-database/pinecone";

async function getTextEmbedding(text: string): Promise<number[]> {
  try {
    const response = await axios.post(
      "http://clipfastapi:8000/text_embedding",
      {
        text: text,
      }
    );
    return response.data.embeddings;
  } catch (error) {
    console.error("Error getting text embedding:", error);
    throw error;
  }
}

export type SearchResult = {
  id: string;
  score?: number;
  photo_image_url?: RecordMetadataValue;
  photo_description?: RecordMetadataValue;
  ai_description?: RecordMetadataValue;
};

export async function searchImages(query: string): Promise<SearchResult[]> {
  if (!query) return [];

  try {
    // Get the text embedding for the query
    const queryEmbedding = await getTextEmbedding(query);
    const pineconeIndex = await getPineconeIndex();

    // Search the Pinecone index
    const searchResults = await pineconeIndex.namespace("unsplashlite").query({
      vector: queryEmbedding,
      topK: 10,
      includeMetadata: true,
    });

    console.log("Search results: ", searchResults.matches[0].metadata);
    // Extract and return the results
    return searchResults.matches.map((match) => ({
      id: match.id,
      score: match.score,
      photo_image_url: match.metadata?.photo_image_url,
      photo_description: match.metadata?.photo_description,
      ai_description: match.metadata?.ai_description,
    }));
  } catch (error) {
    console.error("Error searching images:", error);
    throw error;
  }
}
