FROM public.ecr.aws/docker/library/rust:1.88-alpine3.22 AS build
WORKDIR /src
COPY . .
RUN cargo build --release --locked

FROM public.ecr.aws/docker/library/alpine:3.22
LABEL application_name="settlement-job"               description="Ulises settlement background job"               owner="brandon@pantalasa.org"               source_uri="https://github.com/pantalasa-cronos/ulises"               git_sha="unknown"
COPY --from=build /src/target/release/settlement-job /usr/local/bin/settlement-job
USER 10001
HEALTHCHECK --interval=30s --timeout=3s CMD /bin/true
ENTRYPOINT ["/usr/local/bin/settlement-job"]
