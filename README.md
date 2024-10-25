# CLIP Text-to-Image Search Application

This project consists of two main components: a CLIP embedding service and a Next.js image search application. Before running these services, you need to prepare the dataset using the Jupyter notebook.

# DEMO
![ScreenRecording2024-10-25at23 24 50-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/4dfb6f82-b007-4a36-bccf-9353035d6dce)


## Prerequisites

- Docker and Docker Compose
- Python 3.8+ (for dataset preparation)
- Jupyter Notebook or VSCode with Jupyter extension

## Environment Variables

Create a `.env` file in the root directory with the following content:

Note: For `CLIP_MODEL_ID`, use any model from Hugging Face that supports 768-dimensional embeddings.

```
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
CLIP_MODEL_ID=your_clip_model_id
```

## Dataset Preparation

Before running the main application, you need to prepare the dataset:

1. Follow the instructions in the `prepare-dataset-notebook/README.md` file to set up and run the `image-prepare.ipynb` notebook.
2. This notebook will download images, create embeddings, and store them in Pinecone.

## Main Application Setup

1. Build the Docker images:

```
docker-compose build
```


3. Start the services:

```
docker-compose up
```


## Services

### CLIP Fast API Service

- A stateless service that converts text or images into embeddings using the CLIP model.
- Built with the CLIP model specified in the `.env` file.
- Runs on port 8000.

### Next.js Image Search Application

- A web application that allows users to search for images using text queries.
- Performs embedding search for top-K values on the Pinecone database.
- Runs on port 3000.

## Usage

1. Ensure both services are running (`docker-compose up`).
2. Access the Next.js application at `http://localhost:3000`.
3. Enter a text query to search for similar images in the Pinecone database.

## Code Structure

- The CLIP Fast API service is defined in the `clipfastapi` service in the Docker Compose file.
- The Next.js Image Search application is defined in the `clipimagesearch` service.


## Troubleshooting

- If you encounter issues, ensure all environment variables are correctly set in the `.env` file.
- For CLIP model issues, verify that you're using a compatible model from Hugging Face.

For any persistent problems, please open an issue in the repository.
