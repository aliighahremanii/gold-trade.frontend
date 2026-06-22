import Link from "next/link";
import type { ReactNode } from "react";

import { SessionStatusPanel } from "@/modules/identity/components/session-status-panel";
import { SignOutButton } from "@/modules/identity/components/sign-out-button";
import { AppShellNav } from "@/shared/layout/app-shell-nav";
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <AppShellNav area={area} navItems={navItems} />
            <div className="flex items-center gap-4">
              <SessionStatusPanel />
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
