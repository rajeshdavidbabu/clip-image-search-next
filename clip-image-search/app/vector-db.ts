import "server-only";

import { Pinecone, type Index } from "@pinecone-database/pinecone";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

if (!PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY is not set in the environment variables");
}

if (!PINECONE_INDEX_NAME) {
  throw new Error(
    "PINECONE_INDEX_NAME is not set in the environment variables"
  );
}

class PineconeClientSingleton {
  private static instance: Pinecone | null = null;
  private static pineconeIndex: Index | null = null;

  private constructor() {}

  public static async getInstance(): Promise<Pinecone> {
    if (!PineconeClientSingleton.instance) {
      PineconeClientSingleton.instance = new Pinecone({
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        apiKey: PINECONE_API_KEY!,
      });
    }
    return PineconeClientSingleton.instance;
  }

  public static async getIndex() {
    if (!PineconeClientSingleton.pineconeIndex) {
      const client = await PineconeClientSingleton.getInstance();
      PineconeClientSingleton.pineconeIndex = client.index(
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        PINECONE_INDEX_NAME!
      );
    }
    return PineconeClientSingleton.pineconeIndex;
  }
}

export async function getPineconeIndex() {
  return PineconeClientSingleton.getIndex();
}
