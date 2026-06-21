# Testing Strategy

## Test pyramid

Use multiple test layers:

1. Type checking and linting
2. Unit tests for formatters, mappers, reducers, query key builders
3. Component tests for forms and state displays
4. Playwright E2E tests for full workflows
5. Backend-real E2E tests for launch readiness

## MVP E2E workflows

Customer happy path:

```text
sign in -> deposit IRR -> buy gold -> see XAU balance -> sell gold -> withdraw IRR
```

Delivery happy path:

```text
buy gold -> request delivery -> admin approve -> delivery scheduled -> completed
```

Admin happy path:

```text
admin sign in -> set manual price -> switch market to manual-only -> approve pending operation -> inspect audit/reconciliation
```

Failure paths:

```text
expired quote
insufficient balance
provider unavailable
settlement pending
settlement failed
payment callback delayed
duplicate submit
manual review required
delivery cancelled
```

## E2E principles

- Do not rely on arbitrary sleeps.
- Prefer UI-visible state waits.
- Use test users and seeded data.
- Keep tests deterministic.
- Capture traces/screenshots/videos on failure.
- Separate mocked frontend tests from backend-real launch validation.
