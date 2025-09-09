 # syntax=docker/dockerfile:1
 FROM node:18

 # Set working directory
 WORKDIR /usr/src/app

 # Install pnpm globally for dependency management
 RUN npm install -g pnpm

 # Copy dependency manifests
 COPY package.json pnpm-lock.yaml ./

 # Install dependencies based on lockfile
 RUN pnpm install

 # Copy application code
 COPY . .

 # Expose application port
 EXPOSE 3000

 # Default command: start development server with hot reloading
 CMD ["pnpm", "dev"]
