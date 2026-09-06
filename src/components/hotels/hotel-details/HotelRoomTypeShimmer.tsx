import React from "react";

const shimmerClass =
  "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer";

export function HotelRoomTypeCardShimmer() {
  return (
    <div className="bg-white rounded-[20px] border border-gray-200 w-full max-w-[1287px] overflow-hidden">
      {/* Mobile layout */}
      <div className="block lg:hidden p-4 space-y-4">
        <div className={`h-48 w-full rounded-2xl ${shimmerClass}`} />
        <div className={`h-6 w-2/3 rounded ${shimmerClass}`} />
        <div className={`h-4 w-full rounded ${shimmerClass}`} />
        <div className={`h-4 w-4/5 rounded ${shimmerClass}`} />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-8 w-24 rounded-full ${shimmerClass}`} />
          ))}
        </div>
        <div className={`h-28 w-full rounded-xl ${shimmerClass}`} />
        <div className={`h-28 w-full rounded-xl ${shimmerClass}`} />
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex flex-row gap-2 p-5">
        <div className="w-[343px] shrink-0 space-y-4">
          <div className={`h-[220px] w-full rounded-2xl ${shimmerClass}`} />
          <div className={`h-6 w-3/4 rounded ${shimmerClass}`} />
          <div className="space-y-2">
            <div className={`h-4 w-full rounded ${shimmerClass}`} />
            <div className={`h-4 w-5/6 rounded ${shimmerClass}`} />
            <div className={`h-4 w-2/3 rounded ${shimmerClass}`} />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-8 w-24 rounded-full ${shimmerClass}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-4 min-w-0">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div className={`h-5 w-32 rounded ${shimmerClass}`} />
                <div className={`h-8 w-24 rounded-full ${shimmerClass}`} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className={`h-10 rounded-lg ${shimmerClass}`} />
                ))}
              </div>
              <div className={`h-12 w-full rounded-xl ${shimmerClass}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HotelRoomTypesListShimmer({ count = 2 }: { count?: number }) {
  return (
    <>
      <div className="flex items-center justify-between gap-2 md:mt-6 mb-4">
        <div className={`h-5 w-52 rounded ${shimmerClass}`} />
        <div className={`hidden lg:block h-6 w-36 rounded-full ${shimmerClass}`} />
      </div>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mb-6">
          <HotelRoomTypeCardShimmer />
        </div>
      ))}
    </>
  );
}
