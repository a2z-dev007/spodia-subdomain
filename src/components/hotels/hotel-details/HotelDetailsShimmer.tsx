import React from 'react';

const HotelDetailsShimmer = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Shimmer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-8 pt-28 md:pt-40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-40 bg-gray-300 rounded animate-pulse"></div>
        </div>

        {/* Search Bar Shimmer */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Hotel Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Images Shimmer */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="h-64 md:h-96 bg-gray-300 animate-pulse"></div>
              <div className="grid grid-cols-4 gap-2 p-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Hotel Title & Rating Shimmer */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-8 w-3/4 bg-gray-300 rounded animate-pulse mb-4"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Tabs Shimmer */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex gap-4 overflow-x-auto">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                ))}
              </div>
            </div>

            {/* Description Shimmer */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Amenities Shimmer */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-6 w-40 bg-gray-300 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms Shimmer */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-6 w-48 bg-gray-300 rounded animate-pulse mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex gap-4">
                      <div className="w-32 h-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="h-6 w-24 bg-gray-300 rounded animate-pulse ml-auto"></div>
                        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-4"></div>
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <div className="flex justify-between mb-2">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between mb-4">
                    <div className="h-5 w-24 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-5 w-20 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                  <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section Shimmer */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
          <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Reviews Shimmer */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
          <div className="h-6 w-40 bg-gray-300 rounded animate-pulse mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-300 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsShimmer