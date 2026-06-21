"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
};

type AppShellNavProps = {
  area: string;
  navItems: NavItem[];
};

export function isNavItemActive(pathname: string, href: string) {
  if (pathname === href) {
    return true;
  }

  if (href === "/dashboard") {
    return false;
  }

  if (href === "/delivery/request" && pathname.startsWith("/delivery/")) {
    return true;
  }

  return pathname.startsWith(`${href}/`);
}

export function AppShellNav({ area, navItems }: AppShellNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={`${area} navigation`}>
      <ul className="flex flex-wrap gap-3 text-sm">
        {navItems.map((item) => {
          const active = isNavItemActive(pathname, item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "font-semibold text-zinc-900 underline underline-offset-4 dark:text-zinc-50"
                    : "text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
                }
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
