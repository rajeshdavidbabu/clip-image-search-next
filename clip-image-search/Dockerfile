# Use an official Node runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Define build arguments
ARG PINECONE_API_KEY
ARG PINECONE_INDEX_NAME

# Set environment variables using the build arguments
ENV PINECONE_API_KEY=$PINECONE_API_KEY
ENV PINECONE_INDEX_NAME=$PINECONE_INDEX_NAME

# Print the environment variables to verify they're being set correctly
RUN echo "PINECONE_API_KEY is set to: ${PINECONE_API_KEY}"
RUN echo "PINECONE_INDEX_NAME is set to: ${PINECONE_INDEX_NAME}"

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]