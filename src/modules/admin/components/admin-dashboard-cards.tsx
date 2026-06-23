import Link from "next/link";

import { adminSectionDescriptions } from "@/modules/admin/utils/admin-section-descriptions";
import { adminNav } from "@/shared/layout/admin-nav";

export function AdminDashboardCards() {
  const sections = adminNav.filter((item) => item.href !== "/admin/dashboard");

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Operational areas
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {sections.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex h-full flex-col gap-1 rounded-lg border border-zinc-200 px-4 py-3 underline-offset-4 hover:border-zinc-300 hover:underline dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {item.label}
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {adminSectionDescriptions[item.href]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
