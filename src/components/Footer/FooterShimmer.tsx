"use client";

const shimmerAnimation = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";

// Shimmer for expandable footer sections
export const FooterExpandableShimmer = () => {
    return (
        <div className="mb-4">
            <div className="flex items-start gap-2">
                <div className={`h-4 w-48 rounded ${shimmerAnimation}`} />
                <div className={`h-4 flex-1 rounded ${shimmerAnimation}`} />
            </div>
        </div>
    );
};

// Shimmer for footer navigation sections
export const FooterNavigationShimmer = () => {
    return (
        <div className="space-y-4">
            {/* Section Title */}
            <div className={`h-4 w-32 rounded ${shimmerAnimation}`} />
            
            {/* Links */}
            <div className="space-y-2">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className={`h-3 w-full rounded ${shimmerAnimation}`} />
                ))}
            </div>
        </div>
    );
};

// Complete footer shimmer
export const FooterShimmer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4 py-12">
                {/* Expandable Sections Shimmer */}
                <div className="py-8">
                    <div className="max-w-7xl mx-auto space-y-4">
                        {[...Array(6)].map((_, idx) => (
                            <FooterExpandableShimmer key={idx} />
                        ))}
                    </div>
                </div>

                {/* Footer Navigation Shimmer */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2">
                    {[...Array(7)].map((_, index) => (
                        <FooterNavigationShimmer key={index} />
                    ))}
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-200 bg-gray-50">
                <div className="max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4 py-6">
                    <div className="flex md:flex-row flex-col space-y-6 justify-between md:space-y-0">
                        {/* Copyright and Links */}
                        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className={`h-3 w-20 rounded ${shimmerAnimation}`} />
                                ))}
                            </div>
                        </div>

                        {/* Language, Currency, and Social Links */}
                        <div className="flex flex-col sm:flex-row items-center md:justify-between justify-center sm:justify-between space-y-4 gap-6 sm:space-y-0">
                            <div className="flex items-center space-x-2">
                                <div className={`h-4 w-4 rounded ${shimmerAnimation}`} />
                                <div className={`h-3 w-24 rounded ${shimmerAnimation}`} />
                                <div className={`h-3 w-16 rounded ${shimmerAnimation}`} />
                            </div>
                            
                            {/* Social Links */}
                            <div className="flex items-center space-x-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className={`w-5 h-5 rounded-full ${shimmerAnimation}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
