# identity module

Frontend workflows and UI for the **identity** bounded context.

## Responsibility

Auth pages, session UI, and admin auth guard workflows.

## Structure

- `api/` — query keys, hooks, and mutation wrappers around generated client
- `components/` — auth error display, form fields, session status, sign-out control
- `flows/` — sign-in, sign-up, and OTP verification workflows
- `forms/` — module-specific form models and components
- `hooks/` — module-specific hooks
- `mappers/` — DTO to view model mapping when needed
- `types/` — frontend-only view types
- `utils/` — device context, redirect helpers, sign-in copy

## Auth transport

Browser auth uses same-origin BFF routes under `src/app/api/auth/*` to establish an HttpOnly
`gt_session` access-token cookie plus HttpOnly refresh and device-context cookies. Authenticated
client API calls route through `src/app/api/proxy/[module]/[...path]`, which can rotate tokens
through the backend refresh contract when access tokens expire.

## OTP contract

`POST /verification/otp/send` `purpose` must use backend enum strings such as `VerifyMobile` and
`VerifyEmail` (see `utils/otp-contract.ts`). Legacy values like `mobile_verification` are normalized
before the API call.

Customer routes use `requireVerifiedCustomerSession` to redirect authenticated users who still
need **mobile** verification. Optional email verification is prompted after mobile via
`getNextVerificationStepPath`; users can skip it until
`config/verification-requirements.ts` sets `EMAIL_VERIFICATION_REQUIRED` to true.

## Rules

- Do not duplicate backend business rules here.
- Use generated OpenAPI types from `src/generated/api`.
- Keep server-owned financial state in TanStack Query, not global client stores.
