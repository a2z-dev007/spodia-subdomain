import React from 'react';

// Base shimmer animation
const shimmerAnimation = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";

// Hotel Card Shimmer for List View
export const HotelCardListShimmer = () => {
    return (
        <div className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row p-3 sm:p-4 md:p-6 lg:p-[28px]">
            {/* LEFT: Images */}
            <div className="w-full md:w-72 flex flex-col">
                <div className={`relative h-48 sm:h-52 md:h-40 rounded-2xl ${shimmerAnimation}`} />
                <div className="flex gap-2 mt-3">
                    <div className={`flex-1 h-[80px] sm:h-[100px] md:h-[104px] rounded-2xl ${shimmerAnimation}`} />
                    <div className={`flex-1 h-[80px] sm:h-[100px] md:h-[104px] rounded-2xl ${shimmerAnimation}`} />
                    <div className={`flex-1 h-[80px] sm:h-[100px] md:h-[104px] rounded-2xl ${shimmerAnimation}`} />
                </div>
            </div>

            {/* RIGHT: Content */}
            <div className="flex-1 mt-4 md:mt-0 md:pl-4 lg:pl-6 md:flex md:flex-row flex-col justify-between">
                <div className="flex-1">
                    {/* Title */}
                    <div className={`h-6 w-3/4 rounded ${shimmerAnimation} mb-3`} />
                    
                    {/* Stars */}
                    <div className="flex gap-1 mb-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className={`w-4 h-4 rounded ${shimmerAnimation}`} />
                        ))}
                    </div>

                    {/* Location */}
                    <div className={`h-4 w-full rounded ${shimmerAnimation} mb-3`} />
                    <div className={`h-4 w-2/3 rounded ${shimmerAnimation} mb-3`} />

                    {/* Tags */}
                    <div className="flex gap-2 mb-3">
                        <div className={`h-7 w-24 rounded-full ${shimmerAnimation}`} />
                        <div className={`h-7 w-32 rounded-full ${shimmerAnimation}`} />
                    </div>

                    {/* Room Details */}
                    <div className="flex gap-2 mb-3">
                        <div className={`h-6 w-20 rounded-full ${shimmerAnimation}`} />
                        <div className={`h-6 w-24 rounded-full ${shimmerAnimation}`} />
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className={`h-8 w-28 rounded-full ${shimmerAnimation}`} />
                        ))}
                    </div>
                </div>

                <div className="w-[1px] bg-gray-200 md:block hidden ml-2" />

                {/* Right Section */}
                <div className="flex flex-col min-w-[120px] sm:min-w-[140px] items-start sm:items-end sm:ml-4 h-full md:gap-20">
                    {/* Rating */}
                    <div className="flex flex-col items-start sm:items-center gap-2 mb-4">
                        <div className={`h-8 w-24 rounded-full ${shimmerAnimation}`} />
                        <div className={`h-4 w-20 rounded ${shimmerAnimation}`} />
                    </div>

                    {/* Pricing */}
                    <div className="text-left sm:text-right w-full">
                        <div className={`h-8 w-32 rounded ${shimmerAnimation} mb-2`} />
                        <div className={`h-10 w-full rounded-lg ${shimmerAnimation}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Hotel Card Shimmer for Grid View
export const HotelCardGridShimmer = () => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="flex flex-col h-full">
                {/* Main Image */}
                <div className={`w-full h-48 rounded-t-2xl ${shimmerAnimation}`} />

                {/* Thumbnail Images */}
                <div className="flex gap-2 px-2 sm:px-3 pt-2 sm:pt-3">
                    <div className={`flex-1 h-[40px] sm:h-[50px] rounded-xl ${shimmerAnimation}`} />
                    <div className={`flex-1 h-[40px] sm:h-[50px] rounded-xl ${shimmerAnimation}`} />
                    <div className={`flex-1 h-[40px] sm:h-[50px] rounded-xl ${shimmerAnimation}`} />
                </div>

                {/* Content */}
                <div className="flex-1 p-3 sm:p-4 flex flex-col">
                    {/* Title */}
                    <div className={`h-6 w-3/4 rounded ${shimmerAnimation} mb-3`} />
                    
                    {/* Stars */}
                    <div className="flex gap-1 mb-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className={`w-4 h-4 rounded ${shimmerAnimation}`} />
                        ))}
                    </div>

                    {/* Location */}
                    <div className={`h-4 w-full rounded ${shimmerAnimation} mb-2`} />
                    <div className={`h-4 w-2/3 rounded ${shimmerAnimation} mb-3`} />

                    {/* Tags */}
                    <div className="flex gap-2 mb-3">
                        <div className={`h-7 w-24 rounded-full ${shimmerAnimation}`} />
                        <div className={`h-7 w-28 rounded-full ${shimmerAnimation}`} />
                    </div>

                    {/* Room Details */}
                    <div className="flex gap-2 mb-3">
                        <div className={`h-6 w-20 rounded-full ${shimmerAnimation}`} />
                        <div className={`h-6 w-24 rounded-full ${shimmerAnimation}`} />
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className={`h-8 w-24 rounded-full ${shimmerAnimation}`} />
                        ))}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                        <div className={`h-6 w-20 rounded ${shimmerAnimation}`} />
                        <div className={`h-6 w-12 rounded-full ${shimmerAnimation}`} />
                    </div>

                    {/* Pricing */}
                    <div className="mt-auto pt-3 border-t border-gray-100">
                        <div className={`h-6 w-32 rounded ${shimmerAnimation} mb-2`} />
                        <div className={`h-10 w-full rounded-lg ${shimmerAnimation}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Filter Shimmer
export const FilterShimmer = () => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {/* Filter Header */}
            <div className={`h-6 w-32 rounded ${shimmerAnimation} mb-6`} />

            {/* Filter Sections */}
            {[...Array(5)].map((_, sectionIndex) => (
                <div key={sectionIndex} className="mb-6">
                    <div className={`h-5 w-40 rounded ${shimmerAnimation} mb-3`} />
                    <div className="space-y-2">
                        {[...Array(4)].map((_, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded ${shimmerAnimation}`} />
                                <div className={`h-4 flex-1 rounded ${shimmerAnimation}`} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Search Bar Shimmer
export const SearchBarShimmer = () => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-1">
                        <div className={`h-4 w-20 rounded ${shimmerAnimation} mb-2`} />
                        <div className={`h-12 w-full rounded-lg ${shimmerAnimation}`} />
                    </div>
                ))}
                <div className="lg:self-end">
                    <div className={`h-12 w-full lg:w-32 rounded-lg ${shimmerAnimation}`} />
                </div>
            </div>
        </div>
    );
};

// Header Shimmer
export const HeaderShimmer = () => {
    return (
        <div className="mb-6">
            <div className={`h-8 w-64 rounded ${shimmerAnimation} mb-2`} />
            <div className={`h-4 w-48 rounded ${shimmerAnimation}`} />
        </div>
    );
};

// Full Page Shimmer Loader
export const HotelResultsShimmer = ({ viewMode = "list" }: { viewMode?: "list" | "grid" }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb Shimmer */}
            <div className="max-w-7xl mx-auto py-1">
                <div className={`h-4 w-64 rounded ${shimmerAnimation}`} />
            </div>

            <div className="max-w-7xl mx-auto pt-2 pb-6">
                {/* Header Shimmer */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div className={`h-8 w-80 rounded ${shimmerAnimation}`} />
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`h-10 w-48 rounded-xl ${shimmerAnimation}`} />
                        <div className={`h-10 w-32 rounded-full ${shimmerAnimation}`} />
                    </div>
                </div>

                {/* Hotel Cards Shimmer */}
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6" : "space-y-4"}>
                    {[...Array(6)].map((_, i) => (
                        viewMode === "list" ? (
                            <HotelCardListShimmer key={i} />
                        ) : (
                            <HotelCardGridShimmer key={i} />
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

// Famous Markets Shimmer
export const FamousMarketsShimmer = () => {
    return (
        <div className="bg-white relative rounded-[20px] w-full">
            <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[20px]" />
            <div className="flex flex-col items-center relative w-full">
                <div className="box-border flex flex-col gap-4 md:gap-6 items-center justify-start p-6 md:p-10 relative w-full">
                    {/* Header Shimmer */}
                    <div className="flex flex-col items-center gap-2 w-full">
                        <div className={`h-8 w-96 rounded ${shimmerAnimation} mb-2`} />
                        <div className={`h-4 w-64 rounded ${shimmerAnimation}`} />
                    </div>

                    {/* Market Grid Shimmer */}
                    <div className="w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`w-8 h-8 rounded-full ${shimmerAnimation}`} />
                                        <div className="flex-1">
                                            <div className={`h-4 w-20 rounded ${shimmerAnimation} mb-1`} />
                                            <div className={`h-3 w-16 rounded ${shimmerAnimation}`} />
                                        </div>
                                    </div>
                                    <div className={`h-5 w-32 rounded ${shimmerAnimation} mb-2`} />
                                    <div className={`h-4 w-full rounded ${shimmerAnimation} mb-2`} />
                                    <div className={`h-3 w-24 rounded ${shimmerAnimation} mt-3 pt-3`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Hotel Section Shimmer
export const HotelSectionShimmer = () => {
    return (
        <div className="space-y-4 sm:space-y-4">
            {/* Section Header */}
            <div className={`h-6 w-48 mx-auto rounded ${shimmerAnimation}`} />

            {/* Grid of Items */}
            <div className="grid grid-cols-6 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-3 sm:gap-y-2">
                {[...Array(30)].map((_, i) => (
                    <div key={i} className={`h-4 rounded ${shimmerAnimation}`} />
                ))}
            </div>

            {/* More Details Button */}
            <div className="flex justify-center">
                <div className={`h-8 w-32 rounded ${shimmerAnimation}`} />
            </div>
        </div>
    );
};

// Text Content Shimmer
export const TextContentShimmer = () => {
    return (
        <div className="py-4">
            <div className={`h-8 w-3/4 rounded ${shimmerAnimation} mb-4`} />
            <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className={`h-4 w-full rounded ${shimmerAnimation}`} />
                ))}
                <div className={`h-4 w-2/3 rounded ${shimmerAnimation}`} />
            </div>
        </div>
    );
};

// Full Search Listing Page Shimmer
export const SearchListingShimmer = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Skeleton */}
            <div className="h-[80px] bg-white border-b border-gray-100 flex items-center px-4 md:px-8 shrink-0">
                <div className={`h-8 w-32 rounded ${shimmerAnimation}`} />
                <div className="hidden md:flex flex-1 justify-center gap-8 mx-8">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`h-4 w-20 rounded ${shimmerAnimation}`} />
                    ))}
                </div>
                <div className={`h-10 w-24 rounded-full ${shimmerAnimation}`} />
            </div>
            
            {/* Hero Section Shimmer */}
            <div className="w-full bg-gray-200 min-h-[250px] md:min-h-[300px] flex items-center justify-center relative overflow-hidden shrink-0">
                <div className={`absolute inset-0 ${shimmerAnimation} opacity-30`} />
                <div className="max-w-7xl w-full px-4 md:px-8 relative z-10">
                    {/* Search Bar Shimmer Placeholder */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl md:rounded-full h-auto md:h-[76px] w-full flex flex-col md:flex-row items-center p-2 shadow-lg gap-4 md:gap-0">
                        <div className="flex-1 w-full flex flex-col md:flex-row px-4 md:px-6 gap-4">
                            <div className="flex-[1.5] w-full">
                                <div className={`h-3 w-16 mb-2 rounded ${shimmerAnimation}`} />
                                <div className={`h-6 w-full rounded ${shimmerAnimation}`} />
                            </div>
                            <div className="flex-1 w-full border-l border-gray-100 md:pl-4">
                                <div className={`h-3 w-16 mb-2 rounded ${shimmerAnimation}`} />
                                <div className={`h-6 w-full rounded ${shimmerAnimation}`} />
                            </div>
                            <div className="flex-1 w-full border-l border-gray-100 md:pl-4">
                                <div className={`h-3 w-12 mb-2 rounded ${shimmerAnimation}`} />
                                <div className={`h-6 w-full rounded ${shimmerAnimation}`} />
                            </div>
                        </div>
                        <div className={`w-full md:w-14 h-12 md:h-14 rounded-xl md:rounded-full ${shimmerAnimation} shrink-0`} />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Shimmer */}
                <div className="hidden lg:block lg:col-span-1">
                    <FilterShimmer />
                </div>
                
                {/* Results Shimmer */}
                <div className="lg:col-span-3">
                    <div className="mb-6">
                        <div className={`h-8 w-64 rounded ${shimmerAnimation} mb-2`} />
                        <div className={`h-4 w-48 rounded ${shimmerAnimation}`} />
                    </div>
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <HotelCardListShimmer key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
