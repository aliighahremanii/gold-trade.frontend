import Link from "next/link";

import { customerNav } from "@/shared/layout/customer-nav";

export function CustomerQuickLinks() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Customer workflows
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {customerNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-900 underline-offset-4 hover:border-zinc-300 hover:underline dark:border-zinc-800 dark:text-zinc-50 dark:hover:border-zinc-700"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
