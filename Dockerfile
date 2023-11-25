FROM node:current-alpine

WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build

# Remove unnecessary dev files
RUN rm -rf src .svelte-kit *.js *.cjs *.ts tsconfig.json prisma

# Remove dev dependencies
RUN npm prune --omit=dev

EXPOSE 80
CMD ["npm", "start"]
