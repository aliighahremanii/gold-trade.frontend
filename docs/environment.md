# Environment Variables

Document actual variables in the frontend repository.

Recommended pattern:

```env
NEXT_PUBLIC_APP_ENV=local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Rules:

- Only browser-safe values can be prefixed with `NEXT_PUBLIC_`.
- Never expose secrets, provider credentials, payment credentials, or server tokens.
- Keep `.env.example` updated.
