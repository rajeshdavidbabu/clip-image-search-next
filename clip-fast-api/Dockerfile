FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
COPY ./download_model.py /code/download_model.py

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Set a default model ID and allow it to be overridden
ARG CLIP_MODEL_ID

# Print the CLIP_MODEL_ID to verify it's being set correctly
RUN echo "CLIP_MODEL_ID is set to: ${CLIP_MODEL_ID}"

# Download and cache the CLIP model
RUN python /code/download_model.py ${CLIP_MODEL_ID}

ENV CLIP_MODEL_ID=${CLIP_MODEL_ID}

COPY ./app /code/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]