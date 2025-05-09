# Use an official node.js runtime as a parent image

FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

#Copy the package.json and the package-lock.json files to the container
COPY package*.json .

# Install these dependencies 
RUN npm install

# Copy the rest of the application
COPY . .


# Expose the port
EXPOSE 5003


# Define 
CMD [ "node", "./src/server.js" ]