from transformers import CLIPProcessor, CLIPModel
import torch
import os
from pydantic import BaseModel
from PIL import Image

model_id = os.getenv("CLIP_MODEL_ID")

print(f"model_id should be: {model_id}")

processor = CLIPProcessor.from_pretrained(model_id)
model = CLIPModel.from_pretrained(model_id)

# move model to device if possible
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)


class TextInput(BaseModel):
    text: str


def create_text_embeddings(text):
    text_embedding = processor(
        text=text, padding=True, images=None, return_tensors="pt"
    ).to(device)

    with torch.no_grad():
        text_emb = model.get_text_features(**text_embedding)
    return text_emb[0].cpu().numpy().tolist()


def create_image_embeddings(image):
    vals = processor(text=None, images=image, return_tensors="pt")["pixel_values"].to(
        device
    )

    with torch.no_grad():
        image_embedding = model.get_image_features(vals)
    return image_embedding[0].cpu().numpy().tolist()


# Verify dimensions
def get_embedding_dimensions():
    with torch.no_grad():
        text_inputs = processor(text="sample text", return_tensors="pt").to(device)
        text_embedding = model.get_text_features(**text_inputs)
        text_dim = text_embedding.shape[-1]

        image_inputs = processor(
            images=Image.new("RGB", (224, 224)), return_tensors="pt"
        ).to(device)
        image_embedding = model.get_image_features(**image_inputs)
        image_dim = image_embedding.shape[-1]

    return {"text_embedding_dim": text_dim, "image_embedding_dim": image_dim}


def get_model_details():
    dimensions = get_embedding_dimensions()
    return {
        "model_id": model_id,
        "text_embedding_size": dimensions["text_embedding_dim"],
        "vision_embedding_size": dimensions["image_embedding_dim"],
    }
