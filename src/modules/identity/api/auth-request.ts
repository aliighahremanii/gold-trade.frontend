import { normalizeFetchError, type NormalizedApiError } from "@/shared/errors";

export function isNormalizedApiError(error: unknown): error is NormalizedApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "kind" in error &&
    "status" in error &&
    "message" in error
  );
}

export async function postAuthRoute<TResponse>(path: string, body?: unknown): Promise<TResponse> {
  const response = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw await normalizeFetchError(response);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}
