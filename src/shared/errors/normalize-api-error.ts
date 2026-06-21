import {
  KNOWN_PROBLEM_CODES,
  type ApiErrorKind,
  type NormalizedApiError,
  type ProblemFieldError,
  type ProblemResponse,
} from "./api-error";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asProblemResponse(value: unknown): ProblemResponse | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const message = typeof value.message === "string" ? value.message : undefined;
  if (!message) {
    return undefined;
  }

  const errors = Array.isArray(value.errors)
    ? value.errors
        .filter(isRecord)
        .map((field): ProblemFieldError => ({
          code: typeof field.code === "string" ? field.code : undefined,
          message: typeof field.message === "string" ? field.message : "Validation error",
        }))
    : undefined;

  return {
    code: typeof value.code === "string" ? value.code : undefined,
    message,
    errors,
  };
}

function kindFromStatus(status: number): ApiErrorKind {
  switch (status) {
    case 400:
    case 422:
      return "validation_error";
    case 401:
      return "authentication_error";
    case 403:
      return "authorization_error";
    case 404:
      return "not_found";
    case 409:
      return "conflict";
    case 429:
      return "rate_limited";
    default:
      return "unknown_error";
  }
}

function kindFromProblem(status: number, problem?: ProblemResponse): ApiErrorKind {
  if (problem?.code) {
    const normalizedCode = problem.code.toLowerCase();
    if (KNOWN_PROBLEM_CODES[normalizedCode]) {
      return KNOWN_PROBLEM_CODES[normalizedCode];
    }
  }

  return kindFromStatus(status);
}

export function normalizeApiError(input: {
  status: number;
  body?: unknown;
  fallbackMessage?: string;
}): NormalizedApiError {
  const problem = asProblemResponse(input.body);
  const message = problem?.message ?? input.fallbackMessage ?? "Unexpected API error.";

  return {
    kind: kindFromProblem(input.status, problem),
    status: input.status,
    code: problem?.code,
    message,
    fieldErrors: problem?.errors ?? [],
    raw: input.body,
  };
}

export async function normalizeFetchError(response: Response): Promise<NormalizedApiError> {
  let body: unknown;

  try {
    body = await response.clone().json();
  } catch {
    body = undefined;
  }

  return normalizeApiError({
    status: response.status,
    body,
    fallbackMessage: response.statusText || "Request failed.",
  });
}
