"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export interface HotelSectionItem {
    label: string;
    href: string;
}

interface HotelSectionProps {
    title: string;
    items: HotelSectionItem[];
}

export function HotelSection({ title, items }: HotelSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Only use actual API data, no fallback
    const normalizedItems = items;

    // Mobile: 2 rows × 6 columns = 12 items
    // Desktop: 5 rows × 6 columns = 30 items
    const mobileInitialItems = 12; // 2 rows on mobile
    const desktopInitialItems = 30; // 5 rows on desktop
    
    const displayItems = isExpanded ? normalizedItems : normalizedItems.slice(0, desktopInitialItems);

    // Don't render if no items
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="pt-4 ">
            {/* Section Header */}
            <h2 className="text-center text-black tracking-wider px-4 pb-2">{title}</h2>

            {/* Grid of Hotel Items */}
            <div
                className="
          grid
          md:grid-cols-4 lg:grid-cols-6
         grid-cols-3
          gap-x-2 md:gap-x-6 lg:gap-x-8
          gap-y-3 sm:gap-y-2
        "
            >
                {displayItems.map((item, index) => {
                    // Hide items beyond 2 rows on mobile (items after index 11)
                    const hiddenOnMobile = !isExpanded && index >= mobileInitialItems;
                    
                    return (
                        <Link
                            key={index}
                            target="_blank"
                            href={item.href}
                            className={`text-gray-600 text-xs sm:text-sm px-1 sm:px-0 hover:text-orange-500 transition-colors ${
                                hiddenOnMobile ? 'hidden sm:block' : ''
                            }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            {/* More Details Link - Only show if there are more items than initial display */}
            {normalizedItems.length > desktopInitialItems && (
                <div className="flex justify-center ">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-orange-500 text-sm hover:text-orange-600 transition-colors px-4 py-2"
                    >
                        {isExpanded ? (
                            <span className="flex items-center gap-2">
                                Show less <ChevronUp />
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                More details <ChevronDown />
                            </span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
