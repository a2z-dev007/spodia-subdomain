"use client";

import Header from "@/components/layout/Header";
import { usePathname } from "next/navigation";

/**
 * Shared shell for tenant traffic rewritten to `/site/*` and `/hotel/*`.
 * Footer and bottom tab remain in the root layout.
 */
export default function SubdomainShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--header-height)' }}>
        {children}
      </main>
    </>
  );
}
