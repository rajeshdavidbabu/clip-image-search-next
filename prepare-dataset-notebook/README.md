# Unsplash Image Dataset Preparation and Embedding

This Jupyter notebook prepares and processes the Unsplash Lite dataset, creating embeddings using the CLIP model and storing them in Pinecone for efficient similarity search.

## Prerequisites

- Python 3.8+ (I used 3.12+ using conda installed via homebrew)
- Jupyter Notebook or VSCode with Jupyter extension
- Anaconda or a virtual environment manager

## Setup

1. Clone this repository:

   ```
   cd prepare-dataset-notebook
   ```

2. Create a `.env` file in the root directory with the following content:

   ```
   PINECONE_API_KEY=your_pinecone_api_key
   CLIP_MODEL_ID=your_clip_model_id
   PINECONE_INDEX_NAME=
   ```

## Running the Notebook

1. Start Jupyter Notebook or open the notebook in VSCode.

2. Open the `image-prepare.ipynb` file.

3. Run the cells in order. The notebook will:
   - Install required packages
   - Download images from the Unsplash Lite dataset
   - Create embeddings using the CLIP model
   - Store the embeddings and metadata in Pinecone

## Notebook Contents

The notebook performs the following steps:

1. Installs requirements from `requirements.txt`
2. Loads the Unsplash Lite dataset
3. Downloads images to a local `photos` folder
4. Initializes the Pinecone index
5. Processes images using the CLIP model to create embeddings
6. Uploads embeddings and metadata to Pinecone

## Notes

- The notebook processes approximately 25,000 images from the Unsplash Lite dataset.
- Ensure you have sufficient disk space for downloading and storing the images.
- The processing time may vary depending on your hardware capabilities.

## Troubleshooting

If you encounter any issues:

- Ensure all required packages are installed correctly
- Check that your `.env` file contains the correct API keys
- Make sure that your jupyter notebook is running on a proper virtual environment eg: conda or venv
- Verify that you have an active internet connection for downloading images and accessing Pinecone

For any persistent problems, please open an issue in the repository.
