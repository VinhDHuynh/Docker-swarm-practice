# Use the official Node image as a parent image
FROM node:15.12.0

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install dependencies and build the app
RUN npm install && npm run build

# Install 'serve' to serve the built app
RUN npm install -g serve

# Specify port 80 to be available to the world outside this container
EXPOSE 80

# Serve the built app using 'serve'
CMD ["serve", "-s", "dist", "-l", "80"]
