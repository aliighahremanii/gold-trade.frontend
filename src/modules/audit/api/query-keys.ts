import { createQueryKeyFactory } from "@/shared/api";

export const auditQueryKeys = {
  ...createQueryKeyFactory("audit"),
  records: (filters: Record<string, string | number | boolean | undefined>) =>
    ["audit", "records", filters] as const,
  record: (recordId: string) => ["audit", "records", recordId] as const,
};
