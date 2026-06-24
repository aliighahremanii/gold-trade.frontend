import { sanitizeForLog } from "@/shared/observability/sanitize-for-log";

type LogContext = Record<string, unknown>;

function shouldLogToConsole(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function logOperationalEvent(event: string, context: LogContext = {}) {
  if (!shouldLogToConsole()) {
    return;
  }

  console.info(`[operational] ${event}`, sanitizeForLog(context));
}

export function logOperationalWarning(event: string, context: LogContext = {}) {
  if (!shouldLogToConsole()) {
    return;
  }

  console.warn(`[operational] ${event}`, sanitizeForLog(context));
}

export function logOperationalError(event: string, context: LogContext = {}) {
  if (!shouldLogToConsole()) {
    return;
  }

  console.error(`[operational] ${event}`, sanitizeForLog(context));
}
