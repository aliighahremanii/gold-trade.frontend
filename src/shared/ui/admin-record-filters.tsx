import { AuthFormField } from "@/modules/identity/components/auth-form-field";

import type { AdminRecordFilterState } from "@/shared/utils/admin-record-filters";

type AdminRecordFiltersProps = {
  filters: AdminRecordFilterState;
  onChange: (next: AdminRecordFilterState) => void;
  onReset: () => void;
};

export function AdminRecordFilters({ filters, onChange, onReset }: AdminRecordFiltersProps) {
  return (
    <form
      className="grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-2 lg:grid-cols-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <AuthFormField
        id="admin-filter-status"
        label="Status"
        value={filters.status}
        onChange={(event) => onChange({ ...filters, status: event.target.value })}
        placeholder="pending"
      />
      <AuthFormField
        id="admin-filter-user"
        label="User ID"
        value={filters.userId}
        onChange={(event) => onChange({ ...filters, userId: event.target.value })}
      />
      <AuthFormField
        id="admin-filter-reference"
        label="Reference"
        value={filters.reference}
        onChange={(event) => onChange({ ...filters, reference: event.target.value })}
        placeholder="bank or gateway ref"
      />
      <AuthFormField
        id="admin-filter-from"
        label="Updated from"
        type="date"
        value={filters.fromDate}
        onChange={(event) => onChange({ ...filters, fromDate: event.target.value })}
      />
      <AuthFormField
        id="admin-filter-to"
        label="Updated to"
        type="date"
        value={filters.toDate}
        onChange={(event) => onChange({ ...filters, toDate: event.target.value })}
      />
      <div className="flex items-end sm:col-span-2 lg:col-span-5">
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50"
        >
          Clear filters
        </button>
      </div>
    </form>
  );
}
