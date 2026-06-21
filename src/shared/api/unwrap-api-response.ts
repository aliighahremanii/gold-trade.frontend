import { normalizeApiError, type ProblemResponse } from "@/shared/errors";

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

  throw normalizeApiError({
    status: result.response.status,
    body: result.error,
    fallbackMessage,
  });
}