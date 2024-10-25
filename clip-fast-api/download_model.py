import sys
from transformers import CLIPProcessor, CLIPModel
from tqdm import tqdm
import torch


def download_with_progress(model_id):
    print(f"Downloading model: {model_id}")

    # Download processor
    processor = CLIPProcessor.from_pretrained(model_id)

    # Download model
    model = CLIPModel.from_pretrained(model_id)

    # move model to device if possible
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)

    print("Model downloaded successfully")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        model_id = sys.argv[1]
        download_with_progress(model_id)
    else:
        print("Error: No model ID provided.")
        print("Usage: python download_model.py <model_id>")
        sys.exit(1)
