# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Install system dependencies for canvas and other native modules
RUN apk add --no-cache \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  musl-dev \
  gcc \
  g++ \
  make \
  python3

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --legacy-peer-deps

# Copy source code
COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
