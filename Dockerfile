FROM node:lts AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm install

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# The site is prerendered, but TinaCMS's /tina-island/* route renders on demand,
# so the Node adapter (see astro.config.ts) outputs a small server alongside the
# static files. Serve both with `node dist/server/entry.mjs`.
FROM base AS deploy
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8080
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 8080
CMD ["node", "./dist/server/entry.mjs"]
