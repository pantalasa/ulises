FROM public.ecr.aws/docker/library/node:24-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM public.ecr.aws/docker/library/node:24-alpine
LABEL application_name="merchant-web"               description="Ulises merchant frontend"               owner="brandon@pantalasa.org"               source_uri="https://github.com/pantalasa-cronos/ulises"               git_sha="unknown"
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /src/.next/standalone ./
COPY --from=build /src/.next/static ./.next/static
USER 10001
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O - http://127.0.0.1:3000/ || exit 1
CMD ["node", "server.js"]
