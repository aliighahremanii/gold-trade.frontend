export type AdminRecordFilterState = {
  status: string;
  userId: string;
  reference: string;
  fromDate: string;
  toDate: string;
};

export const EMPTY_ADMIN_RECORD_FILTERS: AdminRecordFilterState = {
  status: "",
  userId: "",
  reference: "",
  fromDate: "",
  toDate: "",
};

type AdminRecordFilterInput = {
  status: string;
  userId?: string;
  updatedAt?: string;
  createdAt?: string;
  references?: Array<string | null | undefined>;
};

export function matchesAdminRecordFilters(
  record: AdminRecordFilterInput,
  filters: AdminRecordFilterState,
): boolean {
  const statusFilter = filters.status.trim().toLowerCase();
  const userFilter = filters.userId.trim().toLowerCase();
  const referenceFilter = filters.reference.trim().toLowerCase();

  if (statusFilter && !record.status.trim().toLowerCase().includes(statusFilter)) {
    return false;
  }

  if (userFilter && !(record.userId ?? "").toLowerCase().includes(userFilter)) {
    return false;
  }

  if (referenceFilter) {
    const haystack = (record.references ?? [])
      .filter((value): value is string => Boolean(value))
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(referenceFilter)) {
      return false;
    }
  }

  const updatedAt = record.updatedAt ?? record.createdAt;

  if (filters.fromDate && updatedAt) {
    const from = new Date(filters.fromDate);

    if (!Number.isNaN(from.getTime()) && new Date(updatedAt) < from) {
      return false;
    }
  }

  if (filters.toDate && updatedAt) {
    const to = new Date(filters.toDate);

    if (!Number.isNaN(to.getTime())) {
      to.setHours(23, 59, 59, 999);

      if (new Date(updatedAt) > to) {
        return false;
      }
    }
  }

  return true;
}

export function parseCommaSeparatedIds(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
}
