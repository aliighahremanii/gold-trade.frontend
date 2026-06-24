import { normalizeApiError, type ProblemResponse } from "@/shared/errors";
import { reportApiError } from "@/shared/observability/report-api-error";

type ApiClientResult<TData, TProblem extends ProblemResponse> = {
  data?: TData;
  error?: TProblem;
  response: Response;
};

export function unwrapApiResponse<TData, TProblem extends ProblemResponse>(
  result: ApiClientResult<TData, TProblem>,
  fallbackMessage: string,
): TData {
  if (result.data !== undefined) {
    return result.data;
  }

  const error = normalizeApiError({
    status: result.response.status,
    body: result.error,
    fallbackMessage,
    responseHeaders: result.response.headers,
  });

  reportApiError(error, { scope: "api.read" });

  throw error;
}

export function unwrapApiMutation<TData, TProblem extends ProblemResponse>(
  result: ApiClientResult<TData, TProblem>,
  fallbackMessage: string,
): TData | void {
  if (result.data !== undefined) {
    return result.data;
  }

  if (result.response.ok) {
    return;
  }

  const error = normalizeApiError({
    status: result.response.status,
    body: result.error,
    fallbackMessage,
    responseHeaders: result.response.headers,
  });

  reportApiError(error, { scope: "api.mutation" });

  throw error;
}