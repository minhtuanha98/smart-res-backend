# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (default 7000)
EXPOSE 7000

# Start the app
CMD ["npm", "start"]
