from typing import Union
from .clip_model import (
    create_text_embeddings,
    get_model_details,
    TextInput,
    create_image_embeddings,
)
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "Worlds changed"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.post("/text_embedding")
async def text_embedding(text_input: TextInput):
    embeddings = create_text_embeddings(text_input.text)
    return {"embeddings": embeddings}


@app.post("/image_embedding")
async def image_embedding(file: UploadFile = File(...)):
    allowed_types = ["image/jpeg", "image/png"]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, detail="Only JPEG and PNG images are allowed"
        )

    try:
        # Use SpooledTemporaryFile to handle both buffered and streamed uploads
        with file.file as image_file:
            image = Image.open(image_file)
            embeddings = create_image_embeddings(image)
        return JSONResponse(content={"embeddings": embeddings})
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")


@app.get("/model_details")
def model_details():
    return get_model_details()
