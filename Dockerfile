FROM node:20 AS build
ARG VITE_BACKEND_URL=https://scaling-system-97xvwqvp6qv279pw-3001.app.github.dev/api/v1
ARG VITE_GRAPHQL_URL=https://scaling-system-97xvwqvp6qv279pw-3001.app.github.dev/graphql
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_GRAPHQL_URL=${VITE_GRAPHQL_URL}
WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
# Start the SSR server
CMD ["npm", "start"]
