import { E2E_BACKEND_ADMIN, E2E_BACKEND_CUSTOMER } from "./test-users";

export function isBackendRealMode(): boolean {
  return process.env.E2E_MODE === "backend-real";
}

export function hasBackendCustomerCredentials(): boolean {
  return Boolean(E2E_BACKEND_CUSTOMER.email && E2E_BACKEND_CUSTOMER.password);
}

export function hasBackendAdminCredentials(): boolean {
  return Boolean(E2E_BACKEND_ADMIN.email && E2E_BACKEND_ADMIN.password);
}

export function shouldSkipBackendCustomer(): boolean {
  return !isBackendRealMode() || !hasBackendCustomerCredentials();
}

export function shouldSkipBackendAdmin(): boolean {
  return !isBackendRealMode() || !hasBackendAdminCredentials();
}
