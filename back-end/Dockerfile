# Use a base Node.js image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which the Express app will listen
EXPOSE 5000

# Start the Express.js application when the container starts
CMD ["node", "server.js"]
