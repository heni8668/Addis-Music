# Use Node.js base image
FROM node:22

# Create app directory
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy rest of the server files
COPY . .

# Expose the server port
EXPOSE 8080

# Start the server
CMD ["npm", "run", "dev"]
