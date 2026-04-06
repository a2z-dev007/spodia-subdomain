"use client";

import { usePathname } from "next/navigation";
import React from "react";

interface ConditionalShellProps {
  children: React.ReactNode;
}

export default function ConditionalShell({ children }: ConditionalShellProps) {
  const pathname = usePathname();
  const isHotelPage = pathname.startsWith("/hotel/");

  if (isHotelPage) {
    return null;
  }

  return <>{children}</>;
}
