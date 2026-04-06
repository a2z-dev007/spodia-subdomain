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
  const pathname = usePathname();
  const isHotelPage = pathname.startsWith("/hotel/");

  if (isHotelPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--header-height)' }}>
        {children}
      </main>
    </>
  );
}
