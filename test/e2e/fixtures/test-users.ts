/** Credentials accepted by the local E2E mock API (`test/e2e/mock-api/server.mjs`). */
export const E2E_MOCK_CUSTOMER = {
  email: "e2e-customer@test.local",
  password: "E2eCustomer1!",
  userId: "e2e-customer-user",
} as const;

export const E2E_MOCK_ADMIN = {
  email: "e2e-admin@test.local",
  password: "E2eAdmin1!",
  userId: "e2e-admin-user",
} as const;

/** Optional staging credentials for backend-real suites. */
export const E2E_BACKEND_CUSTOMER = {
  email: process.env.E2E_CUSTOMER_EMAIL ?? "",
  password: process.env.E2E_CUSTOMER_PASSWORD ?? "",
};

export const E2E_BACKEND_ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL ?? "",
  password: process.env.E2E_ADMIN_PASSWORD ?? "",
};
