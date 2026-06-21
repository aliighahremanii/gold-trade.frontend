import { createQueryKeyFactory } from "@/shared/api";

export const identityQueryKeys = {
  ...createQueryKeyFactory("identity"),
  currentUser: () => ["identity", "current-user"] as const,
  sessions: () => ["identity", "sessions"] as const,
  session: (sessionId: string) => ["identity", "sessions", sessionId] as const,
};
