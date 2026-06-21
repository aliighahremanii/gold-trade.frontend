# C4 Frontend Context

## System context

Actors:

- Customer / Trader
- Admin / Backoffice operator
- Backend Go modular monolith
- Payment gateway / bank
- Liquidity provider / backing exchange
- Notification providers

Frontend system:

- Next.js App Router application
- Customer route group
- Admin route group
- Generated OpenAPI client
- Workflow-oriented feature modules

## Container view

```text
Browser
  -> Next.js Frontend
      -> Backend module APIs
      -> Identity/session APIs
      -> Payment gateway redirect/callback surfaces where applicable
```

## Component view

```text
src/app
  route groups and layouts
src/modules
  business workflow UI modules
src/shared
  technical UI/API/form/config primitives
src/generated
  OpenAPI generated types/client
```
