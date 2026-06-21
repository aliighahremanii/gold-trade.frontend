# Environment Variables

Document actual variables in the frontend repository.

Recommended pattern:

```env
NEXT_PUBLIC_APP_ENV=local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
FRONTEND_SIGN_IN_PATH=/sign-in
FRONTEND_SESSION_COOKIE_NAME=gt_session
FRONTEND_ADMIN_ROLE_COOKIE_NAME=gt_role
FRONTEND_ADMIN_ROLE_VALUE=admin
```

Rules:

- Only browser-safe values can be prefixed with `NEXT_PUBLIC_`.
- Keep session and role guard variables server-only.
- Never expose secrets, provider credentials, payment credentials, or server tokens.
- Keep `.env.example` updated.

Server-side route protection uses the `FRONTEND_*` values above to read backend-managed session and role cookies in App Router layouts.
These values are integration points, not a replacement for backend authorization rules.
