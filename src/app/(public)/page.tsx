import Link from "next/link";

import { siteConfig } from "@/shared/config/site";
import { ScaffoldPage } from "@/shared/layout/scaffold-page";

export default function PublicHomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <p className="text-lg font-semibold">{siteConfig.name}</p>
          <nav aria-label="Public navigation">
            <ul className="flex gap-4 text-sm">
              <li>
                <Link href="/sign-in" className="hover:underline">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:underline">
                  Sign up
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:underline">
                  Customer
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:underline">
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <ScaffoldPage
        title="Trade Platform"
        description="Public landing scaffold for the gold trading and custody platform."
        module="public"
      />
    </div>
  );
}
