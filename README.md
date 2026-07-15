# Ulises

Ulises is a synthetic multi-service monorepo used to demonstrate Lunar guardrails.
It demonstrates component-scoped guardrails across a Kotlin/Spring API, a
Next.js/TypeScript web app, a Rust background job, and shared Helm platform code.

Each application owns:

- source and tests
- a Dockerfile
- a deployable Helm chart
- a restricted `infra/` directory containing pinned module calls
- Backstage-compatible component metadata

This repository does not provision EKS, ECR, Flux, or foundational Terraform.
Those systems are represented only in the documented release flow.
