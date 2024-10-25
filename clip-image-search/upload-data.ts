// Use prepare-dataset-notebook to generate the dataset instead of this script, cos this is too slow

import { Pinecone } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import FormData from "form-data";
import axios, { AxiosError } from "axios";

dotenv.config({ path: ".env.local" });

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

async function getImageEmbedding(imagePath: string): Promise<number[]> {
  // Read the image file
  const fileContent = await fs.promises.readFile(imagePath);

  // Create a FormData instance
  const formData = new FormData();
  formData.append("file", fileContent, {
    filename: path.basename(imagePath),
    contentType: "image/jpeg", // or "image/png" based on file extension
  });

  try {
    // Send the POST request using Axios
    const response = await axios.post(
      "http://localhost:8000/image_embedding",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    // Return the embeddings from the response
    return response.data.embeddings;
  } catch (error) {
    // Handle errors
    if (error instanceof AxiosError && error.response) {
      console.error(
        `Error response body: ${JSON.stringify(error.response.data)}`
      );
      throw new Error(
        `HTTP error! status: ${error.response.status}, body: ${JSON.stringify(
          error.response.data
        )}`
      );
    }

    throw error;
  }
}

async function processImages() {
  const pinecone = new Pinecone({
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    apiKey: PINECONE_API_KEY!,
  });

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const index = pinecone.index(PINECONE_INDEX_NAME!);

  const datasetPath = path.join(__dirname, "unsplash-dataset");
  const jsonPath = path.join(datasetPath, "photo_infos.json");
  const photosPath = path.join(datasetPath, "photos");
  const imageFiles = fs.readdirSync(photosPath).slice(0, 5000);

  console.log(`Processing ${imageFiles.length} images`);

  const photoInfo = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  console.log(`Uploading embedding for photo ${imageFiles}`);

  for (const imageFile of imageFiles) {
    const photoId = path.parse(imageFile).name;
    const imagePath = path.join(photosPath, imageFile);
    const embedding = await getImageEmbedding(imagePath);

    console.log(`Uploading embedding for photo ${photoId}`);

    const info = photoInfo.find(
      (item: { photo_id: string }) => item.photo_id === photoId
    );
    if (info) {
      await index.upsert([
        {
          id: photoId,
          values: embedding,
          metadata: {
            photo_image_url: info.photo_image_url || "",
            photo_description: info.photo_description || "",
          },
        },
      ]);
      console.log(`Uploaded embedding for photo ${photoId}`);
    } else {
      console.warn(`No information found for photo ${photoId}`);
    }
  }

  console.log("Finished uploading embeddings");
}

processImages().catch(console.error);
