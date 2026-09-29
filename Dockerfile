FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev
COPY server.js ./
# stdio MCP server: no TCP port to expose.
CMD ["node", "server.js"]
