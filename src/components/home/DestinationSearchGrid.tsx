"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { LINKS } from "@/utils/const";
import { cn } from "@/lib/utils";

type MoreLink = { label: string; href: string };

type DestinationRow = {
  id: string;
  label: string;
  /** Shown when the row header is toggled open */
  moreLinks: MoreLink[];
};

/** 35 rows in column-major order (7 columns × 5 rows) */
const ALL_DESTINATION_ROWS: DestinationRow[] = [
  {
    id: "singapore",
    label: "Singapore hotels",
    moreLinks: [
      { label: "All Singapore hotels", href: LINKS.HOTELS_SINGAPORE },
      { label: "Bangkok hotels", href: LINKS.HOTELS_BANGKOK },
      { label: "Bali hotels", href: LINKS.HOTELS_BALI },
      { label: "Kuala Lumpur hotels", href: LINKS.HOTELS_KUALA_LUMPUR },
    ],
  },
  {
    id: "new-delhi",
    label: "New Delhi hotels",
    moreLinks: [
      { label: "All New Delhi hotels", href: LINKS.HOTELS_DELHI },
      { label: "Connaught Place hotels", href: LINKS.HOTELS_CONNAUGHT_PLACE },
      { label: "Budget hotels in Agra", href: LINKS.BUDGET_HOTELS_AGRA },
      { label: "Jaipur hotels", href: LINKS.HOTELS_JAIPUR },
    ],
  },
  {
    id: "bangalore",
    label: "Bangalore hotels",
    moreLinks: [
      { label: "All Bangalore hotels", href: LINKS.HOTELS_BANGALORE },
      { label: "5-star hotels in Bangalore", href: LINKS.FIVE_STAR_BANGALORE },
      { label: "Chennai hotels", href: LINKS.HOTELS_CHENNAI },
      { label: "Mysore hotels", href: LINKS.HOTELS_MYSORE },
    ],
  },
  {
    id: "hyderabad",
    label: "Hyderabad hotels",
    moreLinks: [
      { label: "All Hyderabad hotels", href: LINKS.HOTELS_HYDERABAD },
      { label: "Chennai hotels", href: LINKS.HOTELS_CHENNAI },
      { label: "Bangalore hotels", href: LINKS.HOTELS_BANGALORE },
      { label: "Pune hotels", href: LINKS.HOTELS_PUNE },
    ],
  },
  {
    id: "kolkata",
    label: "Kolkata hotels",
    moreLinks: [
      { label: "All Kolkata hotels", href: LINKS.HOTELS_KOLKATA },
      { label: "Budget hotels in Gangtok", href: LINKS.BUDGET_HOTELS_GANGTOK },
      { label: "Guwahati hotels", href: LINKS.HOTELS_GUWAHATI },
      { label: "Chennai hotels", href: LINKS.HOTELS_CHENNAI },
    ],
  },
  {
    id: "dubai",
    label: "Dubai hotels",
    moreLinks: [
      { label: "All Dubai hotels", href: LINKS.HOTELS_DUBAI },
      { label: "Abu Dhabi hotels", href: LINKS.HOTELS_ABU_DHABI },
      { label: "Singapore hotels", href: LINKS.HOTELS_SINGAPORE },
      { label: "Bangkok hotels", href: LINKS.HOTELS_BANGKOK },
    ],
  },
  {
    id: "chennai",
    label: "Chennai hotels",
    moreLinks: [
      { label: "All Chennai hotels", href: LINKS.HOTELS_CHENNAI },
      { label: "Budget hotels in Chennai", href: LINKS.BUDGET_HOTELS_CHENNAI },
      { label: "Bangalore hotels", href: LINKS.HOTELS_BANGALORE },
      { label: "Hyderabad hotels", href: LINKS.HOTELS_HYDERABAD },
    ],
  },
  {
    id: "pune",
    label: "Pune hotels",
    moreLinks: [
      { label: "All Pune hotels", href: LINKS.HOTELS_PUNE },
      { label: "Budget hotels in Pune", href: LINKS.BUDGET_HOTELS_PUNE },
      { label: "Mumbai hotels", href: LINKS.HOTELS_MUMBAI },
      { label: "Goa hotels", href: LINKS.HOTELS_GOA },
    ],
  },
  {
    id: "goa",
    label: "Goa hotels",
    moreLinks: [
      { label: "All Goa hotels", href: LINKS.HOTELS_GOA },
      { label: "Budget hotels in Goa", href: LINKS.BUDGET_HOTELS_GOA },
      { label: "Baga hotels", href: LINKS.HOTELS_BAGA },
      { label: "Calangute hotels", href: LINKS.HOTELS_CALANGUTE },
    ],
  },
  {
    id: "jaipur",
    label: "Jaipur hotels",
    moreLinks: [
      { label: "All Jaipur hotels", href: LINKS.HOTELS_JAIPUR },
      { label: "Budget hotels in Jaipur", href: LINKS.BUDGET_HOTELS_JAIPUR },
      { label: "Agra hotels", href: LINKS.HOTELS_AGRA },
      { label: "Udaipur area search", href: LINKS.SEARCH_RESULTS },
    ],
  },
  {
    id: "london",
    label: "London hotels",
    moreLinks: [
      { label: "All London hotels", href: LINKS.HOTELS_LONDON },
      { label: "Paris hotels", href: LINKS.HOTELS_PARIS },
      { label: "Amsterdam hotels", href: LINKS.HOTELS_AMSTERDAM },
      { label: "Rome hotels", href: LINKS.HOTELS_ROME },
    ],
  },
  {
    id: "ahmedabad",
    label: "Ahmedabad hotels",
    moreLinks: [
      { label: "All Ahmedabad hotels", href: LINKS.HOTELS_AHMEDABAD },
      { label: "Budget hotels in Ahmedabad", href: LINKS.BUDGET_HOTELS_AHMEDABAD },
      { label: "Mumbai hotels", href: LINKS.HOTELS_MUMBAI },
      { label: "Jaipur hotels", href: LINKS.HOTELS_JAIPUR },
    ],
  },
  {
    id: "mysore",
    label: "Mysore hotels",
    moreLinks: [
      { label: "All Mysore hotels", href: LINKS.HOTELS_MYSORE },
      { label: "Bangalore hotels", href: LINKS.HOTELS_BANGALORE },
      { label: "Ooty hotels", href: LINKS.HOTELS_OOTY },
      { label: "Coorg homestays", href: LINKS.HOMESTAYS_COORG },
    ],
  },
  {
    id: "agra",
    label: "Agra hotels",
    moreLinks: [
      { label: "All Agra hotels", href: LINKS.HOTELS_AGRA },
      { label: "Budget hotels in Agra", href: LINKS.BUDGET_HOTELS_AGRA },
      { label: "New Delhi hotels", href: LINKS.HOTELS_DELHI },
      { label: "Jaipur hotels", href: LINKS.HOTELS_JAIPUR },
    ],
  },
  {
    id: "manali",
    label: "Manali hotels",
    moreLinks: [
      { label: "All Manali hotels", href: LINKS.HOTELS_MANALI },
      { label: "Shimla hotels", href: LINKS.HOTELS_SHIMLA },
      { label: "Dalhousie 5-star", href: LINKS.FIVE_STAR_DALHOUSIE },
      { label: "Dharamshala 5-star", href: LINKS.FIVE_STAR_DHARAMSHALA },
    ],
  },
  {
    id: "paris",
    label: "Paris hotels",
    moreLinks: [
      { label: "All Paris hotels", href: LINKS.HOTELS_PARIS },
      { label: "London hotels", href: LINKS.HOTELS_LONDON },
      { label: "Rome hotels", href: LINKS.HOTELS_ROME },
      { label: "Zurich hotels", href: LINKS.HOTELS_ZURICH },
    ],
  },
  {
    id: "kochi",
    label: "Kochi hotels",
    moreLinks: [
      { label: "Fort Kochi hotels", href: LINKS.HOTELS_FORT_KOCHI },
      { label: "Ernakulam hotels", href: LINKS.HOTELS_ERNAKULAM },
      { label: "Munnar hotels", href: LINKS.HOTELS_MUNNAR },
      { label: "Alleppey search", href: LINKS.SEARCH_RESULTS },
    ],
  },
  {
    id: "shimla",
    label: "Shimla hotels",
    moreLinks: [
      { label: "All Shimla hotels", href: LINKS.HOTELS_SHIMLA },
      { label: "Manali hotels", href: LINKS.HOTELS_MANALI },
      { label: "Nainital hotels", href: LINKS.HOTELS_NAINITAL },
      { label: "Budget Nainital", href: LINKS.BUDGET_HOTELS_NAINITAL },
    ],
  },
  {
    id: "ooty",
    label: "Ooty hotels",
    moreLinks: [
      { label: "All Ooty hotels", href: LINKS.HOTELS_OOTY },
      { label: "Budget Ooty", href: LINKS.BUDGET_HOTELS_OOTY },
      { label: "Munnar hotels", href: LINKS.HOTELS_MUNNAR },
      { label: "Mysore hotels", href: LINKS.HOTELS_MYSORE },
    ],
  },
  {
    id: "nainital",
    label: "Nainital hotels",
    moreLinks: [
      { label: "All Nainital hotels", href: LINKS.HOTELS_NAINITAL },
      { label: "Budget Nainital", href: LINKS.BUDGET_HOTELS_NAINITAL },
      { label: "5-star Nainital", href: LINKS.FIVE_STAR_NAINITAL },
      { label: "Shimla hotels", href: LINKS.HOTELS_SHIMLA },
    ],
  },
  {
    id: "tokyo",
    label: "Tokyo hotels",
    moreLinks: [
      { label: "Tokyo hotels", href: "/tokyo/hotels" },
      { label: "Bangkok hotels", href: LINKS.HOTELS_BANGKOK },
      { label: "Singapore hotels", href: LINKS.HOTELS_SINGAPORE },
      { label: "Hong Kong hotels", href: LINKS.HOTELS_HONG_KONG },
    ],
  },
  {
    id: "guwahati",
    label: "Guwahati hotels",
    moreLinks: [
      { label: "All Guwahati hotels", href: LINKS.HOTELS_GUWAHATI },
      { label: "Shillong 5-star", href: LINKS.FIVE_STAR_SHILLONG },
      { label: "Kolkata hotels", href: LINKS.HOTELS_KOLKATA },
      { label: "Gangtok budget", href: LINKS.BUDGET_HOTELS_GANGTOK },
    ],
  },
  {
    id: "munnar",
    label: "Munnar hotels",
    moreLinks: [
      { label: "All Munnar hotels", href: LINKS.HOTELS_MUNNAR },
      { label: "Munnar homestays", href: LINKS.HOMESTAYS_MUNNAR },
      { label: "Kochi / Fort Kochi", href: LINKS.HOTELS_FORT_KOCHI },
      { label: "Ooty hotels", href: LINKS.HOTELS_OOTY },
    ],
  },
  {
    id: "mahabaleshwar",
    label: "Mahabaleshwar hotels",
    moreLinks: [
      { label: "All Mahabaleshwar hotels", href: LINKS.HOTELS_MAHABALESHWAR },
      { label: "Panchgani hotels", href: LINKS.HOTELS_PANCHGANI },
      { label: "Pune hotels", href: LINKS.HOTELS_PUNE },
      { label: "Lonavala villas", href: LINKS.VILLAS_LONAVALA },
    ],
  },
  {
    id: "bangkok",
    label: "Bangkok hotels",
    moreLinks: [
      { label: "All Bangkok hotels", href: LINKS.HOTELS_BANGKOK },
      { label: "Pattaya hotels", href: LINKS.HOTELS_PATTAYA },
      { label: "Krabi hotels", href: LINKS.HOTELS_KRABI },
      { label: "Singapore hotels", href: LINKS.HOTELS_SINGAPORE },
    ],
  },
  {
    id: "new-york",
    label: "New York hotels",
    moreLinks: [
      { label: "New York hotels", href: "/new-york/hotels" },
      { label: "London hotels", href: LINKS.HOTELS_LONDON },
      { label: "Paris hotels", href: LINKS.HOTELS_PARIS },
      { label: "Search stays", href: LINKS.SEARCH_RESULTS },
    ],
  },
  {
    id: "rome",
    label: "Rome hotels",
    moreLinks: [
      { label: "All Rome hotels", href: LINKS.HOTELS_ROME },
      { label: "Paris hotels", href: LINKS.HOTELS_PARIS },
      { label: "London hotels", href: LINKS.HOTELS_LONDON },
      { label: "Amsterdam hotels", href: LINKS.HOTELS_AMSTERDAM },
    ],
  },
  {
    id: "amsterdam",
    label: "Amsterdam hotels",
    moreLinks: [
      { label: "All Amsterdam hotels", href: LINKS.HOTELS_AMSTERDAM },
      { label: "London hotels", href: LINKS.HOTELS_LONDON },
      { label: "Paris hotels", href: LINKS.HOTELS_PARIS },
      { label: "Zurich hotels", href: LINKS.HOTELS_ZURICH },
    ],
  },
  {
    id: "bali",
    label: "Bali hotels",
    moreLinks: [
      { label: "All Bali hotels", href: LINKS.HOTELS_BALI },
      { label: "Singapore hotels", href: LINKS.HOTELS_SINGAPORE },
      { label: "Bangkok hotels", href: LINKS.HOTELS_BANGKOK },
      { label: "Maldives hotels", href: LINKS.HOTELS_MALDIVES },
    ],
  },
  {
    id: "hong-kong",
    label: "Hong Kong hotels",
    moreLinks: [
      { label: "All Hong Kong hotels", href: LINKS.HOTELS_HONG_KONG },
      { label: "Singapore hotels", href: LINKS.HOTELS_SINGAPORE },
      { label: "Bangkok hotels", href: LINKS.HOTELS_BANGKOK },
      { label: "Tokyo hotels", href: "/tokyo/hotels" },
    ],
  },
  {
    id: "mumbai",
    label: "Mumbai hotels",
    moreLinks: [
      { label: "All Mumbai hotels", href: LINKS.HOTELS_MUMBAI },
      { label: "Budget Mumbai", href: LINKS.BUDGET_HOTELS_MUMBAI },
      { label: "Bandra hotels", href: LINKS.HOTELS_BANDRA },
      { label: "Juhu hotels", href: LINKS.HOTELS_JUHU },
    ],
  },
  {
    id: "kuala-lumpur",
    label: "Kuala Lumpur hotels",
    moreLinks: [
      { label: "All Kuala Lumpur hotels", href: LINKS.HOTELS_KUALA_LUMPUR },
      { label: "Singapore hotels", href: LINKS.HOTELS_SINGAPORE },
      { label: "Bangkok hotels", href: LINKS.HOTELS_BANGKOK },
      { label: "Bali hotels", href: LINKS.HOTELS_BALI },
    ],
  },
  {
    id: "maldives",
    label: "Maldives hotels",
    moreLinks: [
      { label: "All Maldives hotels", href: LINKS.HOTELS_MALDIVES },
      { label: "Colombo hotels", href: LINKS.HOTELS_COLOMBO },
      { label: "Bali hotels", href: LINKS.HOTELS_BALI },
      { label: "Singapore hotels", href: LINKS.HOTELS_SINGAPORE },
    ],
  },
  {
    id: "colombo",
    label: "Colombo hotels",
    moreLinks: [
      { label: "All Colombo hotels", href: LINKS.HOTELS_COLOMBO },
      { label: "Maldives hotels", href: LINKS.HOTELS_MALDIVES },
      { label: "Bangkok hotels", href: LINKS.HOTELS_BANGKOK },
      { label: "Singapore hotels", href: LINKS.HOTELS_SINGAPORE },
    ],
  },
  {
    id: "kathmandu",
    label: "Kathmandu hotels",
    moreLinks: [
      { label: "All Kathmandu hotels", href: LINKS.HOTELS_KATHMANDU },
      { label: "Dhaka hotels", href: LINKS.HOTELS_DHAKA },
      { label: "Delhi hotels", href: LINKS.HOTELS_DELHI },
      { label: "Search stays", href: LINKS.SEARCH_RESULTS },
    ],
  },
];

const COLS = 7;
const DESTINATION_COLUMNS: DestinationRow[][] = Array.from({ length: COLS }, (_, c) =>
  ALL_DESTINATION_ROWS.slice(c * 5, c * 5 + 5),
);

export default function DestinationSearchGrid() {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = useCallback((id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <section className="border-t border-gray-100 bg-white" aria-labelledby="destination-search-heading">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <h2
          id="destination-search-heading"
          className="mb-8 text-xl font-extrabold tracking-tight text-[#1A202C] sm:mb-10 sm:text-2xl md:text-3xl lg:mb-12"
        >
          Search for places to stay by destination
        </h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 xl:gap-x-10">
          {DESTINATION_COLUMNS.map((column, colIndex) => (
            <div key={colIndex} className="flex min-w-0 flex-col gap-1 sm:gap-y-0.5">
              {column.map((item) => {
                const isOpen = !!open[item.id];
                const panelId = `dest-panel-${item.id}`;
                return (
                  <div key={item.id} className="min-w-0 py-1.5 sm:py-2">
                    <button
                      type="button"
                      id={`dest-trigger-${item.id}`}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(item.id)}
                      className="flex w-full min-w-0 items-center justify-between gap-2 rounded-sm text-left text-sm font-normal text-[#4A5568] hover:text-[#1A202C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9530]/40 focus-visible:ring-offset-2 [-webkit-tap-highlight-color:transparent]"
                    >
                      <span className="min-w-0 leading-snug">{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 text-gray-300 transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                        strokeWidth={2}
                        aria-hidden
                      />
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={`dest-trigger-${item.id}`}
                      hidden={!isOpen}
                    >
                      <ul className="mt-2 space-y-1 border-l border-gray-100 pl-3" role="list">
                        {item.moreLinks.map((link) => (
                          <li key={`${item.id}-${link.href}-${link.label}`}>
                            <Link
                              href={link.href}
                              className="block py-1 text-xs leading-snug text-[#718096] hover:text-[#1A202C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9530]/40 focus-visible:ring-offset-1 rounded-sm"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
