import { createQueryKeyFactory } from "@/shared/api";

export const complianceQueryKeys = {
  ...createQueryKeyFactory("compliance"),
  reviewCases: () => ["compliance", "review-cases"] as const,
  reviewCase: (caseId: string) => ["compliance", "review-cases", caseId] as const,
};
