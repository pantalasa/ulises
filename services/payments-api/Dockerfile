FROM public.ecr.aws/docker/library/gradle:9.6.1-jdk21-alpine AS build
WORKDIR /src
COPY . .
RUN gradle bootJar --no-daemon

FROM public.ecr.aws/docker/library/eclipse-temurin:21-jre-alpine
LABEL application_name="payments-api"               description="Ulises critical-tier payments API"               owner="brandon@pantalasa.org"               source_uri="https://github.com/pantalasa-cronos/ulises"               git_sha="unknown"
WORKDIR /app
COPY --from=build /src/build/libs/payments-api-1.0.0.jar /app/application.jar
USER 10001
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O - http://127.0.0.1:8080/health || exit 1
ENTRYPOINT ["java", "-jar", "/app/application.jar"]
