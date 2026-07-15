#!/usr/bin/env python3
import argparse
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="Create an Ulises service skeleton")
    parser.add_argument("name")
    parser.add_argument("--domain", default="ulises.applications.standard")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[2] / "services" / args.name
    if root.exists():
        raise SystemExit(f"{root} already exists")

    (root / "deploy" / "helm").mkdir(parents=True)
    (root / "infra").mkdir()
    (root / "README.md").write_text(f"# {args.name}\n", encoding="utf-8")
    (root / "catalog-info.yaml").write_text(
        "apiVersion: backstage.io/v1alpha1\n"
        "kind: Component\n"
        "metadata:\n"
        f"  name: {args.name}\n"
        "  annotations:\n"
        f"    pantalasa.org/domain: {args.domain}\n"
        "spec:\n"
        "  type: service\n"
        "  lifecycle: experimental\n"
        "  owner: user:default/brandonSc\n"
        "  system: ulises\n"
        "  domain: ulises\n",
        encoding="utf-8",
    )
    (root / "deploy" / "helm" / "Chart.yaml").write_text(
        "apiVersion: v2\n"
        f"name: {args.name}\n"
        "type: application\n"
        "version: 0.1.0\n",
        encoding="utf-8",
    )
    (root / "infra" / "main.tf").write_text(
        "# Add pinned calls to approved Terraform modules only.\n",
        encoding="utf-8",
    )
    print(root)


if __name__ == "__main__":
    main()
