"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS: { segment: string; label: string }[] = [
  { segment: "", label: "Home" },
  { segment: "overview", label: "Overview" },
  { segment: "about", label: "About" },
  { segment: "rooms", label: "Rooms" },
  { segment: "tariff", label: "Tariff" },
  { segment: "services", label: "Services" },
  { segment: "dine", label: "Dine" },
  { segment: "events", label: "Events" },
  { segment: "gallery", label: "Gallery" },
  { segment: "explore", label: "Explore" },
  { segment: "contact", label: "Contact" },
  { segment: "book", label: "Book online" },
];

type Props = { entityKey: string };

export default function HotelSubdomainSubnav({ entityKey }: Props) {
  const pathname = usePathname();
  const base = `/hotel/${entityKey}`;

  return (
    <nav
      className="border-b border-gray-200/90 bg-white/95 backdrop-blur-md"
      aria-label="Hotel sections"
    >
      <div className="mx-auto max-w-7xl px-4">
        <ul className="-mx-1 flex gap-1 overflow-x-auto py-3 text-sm scrollbar-thin md:flex-wrap md:justify-center md:overflow-visible">
          {LINKS.map(({ segment, label }) => {
            const href = segment ? `${base}/${segment}` : base;
            const active = pathname === href || (segment === "" && pathname === base);
            return (
              <li key={segment || "home"} className="shrink-0 px-1">
                <Link
                  href={href}
                  className={`block rounded-full px-3 py-1.5 transition-colors ${
                    active
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
