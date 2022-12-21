# ========================#
# Build environment       #
# ========================#

# Use small image
FROM node:14.5.0-alpine3.12 as build
WORKDIR /app
# Install dependencies
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci --silent
# Copy app files
COPY . ./
# Build app
RUN npm run build

# ========================#
# Post-build environment  #
# ========================#

# Use small image
FROM node:14.5.0-alpine3.12 as post-build
WORKDIR /app
# Only copy output files from build environment
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist/
# Install dependencies
RUN npm ci --silent --only=production

# ========================#
# Runtime environment     #
# ========================#

# Use small image
FROM node:14.5.0-alpine3.12
# Copy app from post-build environment
WORKDIR /app
COPY --from=post-build /app ./
EXPOSE 3000
# Run with unpriviledged user
USER node
# Run directly without using package script to circumvent prestart script
CMD ["node", "."]