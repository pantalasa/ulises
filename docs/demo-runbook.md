# Ulises POV demo runbook

## Prerequisites

- The Ulises Lunar configuration is synced to the Cronos Hub.
- `GH_TOKEN` and `JIRA_TOKEN` are stored as Lunar secrets, not in this repository.
- The Jira project used for the demo contains an open ticket.

## Validate the fixture

Run from the repository root:

```bash
(cd services/payments-api && ./gradlew test --no-daemon)
(cd services/merchant-web && npm ci && npm test && npm run build)
(cd services/settlement-job && cargo fmt --check && cargo clippy --all-targets -- -D warnings && cargo test --locked)
helm lint services/payments-api/deploy/helm
helm lint services/merchant-web/deploy/helm
helm lint services/settlement-job/deploy/helm
helm lint platform/helm
terraform fmt -check -recursive services
```

Expected: all commands pass.

## 1. Conditional standards

1. Introduce the same Dockerfile violation in `services/payments-api` and
   `services/merchant-web` on separate branches.
2. Open pull requests with the valid Jira key in each title.
3. Compare the Lunar checks.

Expected: the critical `payments-api` policy uses `block-pr`; the standard
`merchant-web` policy reports the same failure without blocking.

## 2. Jira linking

1. Open a component-scoped pull request titled `<OPEN-JIRA-KEY> demo valid ticket`.
2. Open another titled `demo missing ticket`.
3. Merge the valid example and wait for the default-branch collectors.

Expected: the first PR passes ticket validation, the second fails, and the merged
commit contains `.release.ticket` with the PR number, Jira key, status, and URL.

## 3. Monorepo release ledger

1. Merge a valid Jira-titled PR that changes a shared path such as `CODEOWNERS`,
   then copy its commit SHA. Shared paths are associated with all four components.
2. Open Release Ledger, select each Ulises component in turn, and enter that SHA.
3. Open Release History for one component and follow its SHA link back.

Expected: `(component_id, git_sha)` selects one component snapshot even though all
four components share the commit SHA. Commit links target the Ulises repository,
and Jira evidence appears in the ledger and history.

## Supporting evidence

Inspect the Component JSON and checks for Trivy/Grype SCA, Syft SBOM, Gitleaks,
Docker/hadolint, language metadata, Helm, pinned Terraform modules, CODEOWNERS,
and repository documentation.

## Out of scope

Lunar CI collectors, ECR/Flux deployment, foundational Terraform, and image
re-scanning are out of scope.

As an optional bonus, run `lunar policy ok-release` manually after the core
scenarios are complete. It is not part of the required workflow.
