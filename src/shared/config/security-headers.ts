type SecurityHeader = {
  key: string;
  value: string;
};

const BASE_SECURITY_HEADERS: SecurityHeader[] = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

function normalizeOrigin(value: string | undefined): string | null {
  if (!value?.trim()) {
    return null;
  }

  try {
    return new URL(value.trim()).origin;
  } catch {
    return null;
  }
}

function getTrustedConnectSources(): string {
  const apiOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_API_BASE_URL);

  if (!apiOrigin) {
    return "'self'";
  }

  return `'self' ${apiOrigin}`;
}

export function isProductionSecurityProfile(): boolean {
  if (process.env.FRONTEND_SECURITY_PROFILE === "development") {
    return false;
  }

  return process.env.NODE_ENV === "production";
}

export function buildProductionContentSecurityPolicy(): string {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self'",
    `connect-src ${getTrustedConnectSources()}`,
  ].join("; ");
}

export function buildDevelopmentContentSecurityPolicy(): string {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "connect-src 'self' https: http://127.0.0.1:* http://localhost:* ws://127.0.0.1:* ws://localhost:*",
  ].join("; ");
}

export function buildContentSecurityPolicy(): string {
  return isProductionSecurityProfile()
    ? buildProductionContentSecurityPolicy()
    : buildDevelopmentContentSecurityPolicy();
}

/** Baseline browser headers without CSP (safe to bake via next.config at build time). */
export function getBaselineSecurityResponseHeaders(): SecurityHeader[] {
  return [...BASE_SECURITY_HEADERS];
}

export function getSecurityResponseHeaders(): SecurityHeader[] {
  return [
    ...getBaselineSecurityResponseHeaders(),
    {
      key: "Content-Security-Policy",
      value: buildContentSecurityPolicy(),
    },
  ];
}
