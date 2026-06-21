import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/shared/config/site";

type NavItem = {
  href: string;
  label: string;
};

type AppShellProps = {
  children: ReactNode;
  navItems: NavItem[];
  area: "customer" | "admin";
};

export function AppShell({ children, navItems, area }: AppShellProps) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {area}
            </p>
            <Link href="/" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {siteConfig.name}
            </Link>
          </div>
          <nav aria-label={`${area} navigation`}>
            <ul className="flex flex-wrap gap-3 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
