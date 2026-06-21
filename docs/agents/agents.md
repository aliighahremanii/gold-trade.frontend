# Frontend Agent Roles

Use separate agents for implementation and review.

## Frontend Architecture Agent

Creates scaffold, route groups, module folders, shared primitives, CI baseline, and docs.

## API Contract Agent

Freezes OpenAPI usage, generated clients, query keys, error mapping, and contract drift checks.

## Customer Workflow Agent

Implements customer-facing flows: auth, wallet, buy/sell, payments, delivery.

## Admin Workflow Agent

Implements backoffice flows: pricing, market status, approvals, payments/delivery operations, audit/reconciliation.

## E2E Agent

Implements Playwright workflows for happy paths and failure paths.

## Review Agent

Reviews implementation against architecture, business workflow correctness, security, and testing requirements.

## Production Agent

Hardens CI/CD, Docker, deployment config, headers, environment variables, and build validation.
