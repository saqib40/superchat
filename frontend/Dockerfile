# Stage 1: Build the Angular application
FROM node:20 AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and build the application
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built artifacts from the 'build' stage
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# THE FIX: Copy our custom nginx.conf to the container
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default Nginx port
EXPOSE 80