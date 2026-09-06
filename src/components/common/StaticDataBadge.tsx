import React from "react";

type Props = {
  text?: string;
  className?: string;
};

export default function StaticDataBadge({
  text = "static data - need this data on the api",
  className = "",
}: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-300/80 shadow-xs ${className}`}
      title="Backend API integration pending for this specific field/section"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      ({text})
    </span>
  );
}
