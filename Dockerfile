# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.18.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app

# API rewrites address by service name
ARG API_URL=http://backend-prod:4000
ARG APP_ORIGIN=http://localhost:3000
ENV API_URL=${API_URL}
ENV APP_ORIGIN=${APP_ORIGIN}

################################################################################
# Create a stage for installing production dependencies.
FROM base AS deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
COPY package.json package-lock.json ./
COPY local-packages ./local-packages
COPY .husky/install.mjs ./.husky/install.mjs

RUN npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps AS build

# Turn off husky warnings
ENV HUSKY=0

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN npm ci

# Copy the rest of the source files into the image.
COPY . .

# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base AS final

# Use production node environment by default.
ENV NODE_ENV=production

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public

# Give write permission for database creation
RUN mkdir -p .pglite-data && chown node:node .pglite-data

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000 4000

# Run the application.
CMD ["npm", "start"]
