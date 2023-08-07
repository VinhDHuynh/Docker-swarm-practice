# Use a base image with Node.js to build the Vite app
FROM node:16 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the entire Vite app source code
COPY . .

# Build the Vite app
RUN npm run build

# Use a lightweight web server as the base image to serve the built Vite app
FROM nginx:alpine

# Copy the built Vite app from the previous stage into the Nginx web server
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (the default port for Nginx)
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
