import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReviewCard } from "./ReviewCard";


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Review {
    id: number;
    rating: number;
    title: string;
    description: string;
    travelMonth: string;
    travelYear: number;
    roomType: string;
    helpful: number;
    author?: string;
    location?: string;
    category?: string;
}

interface ReviewsListProps {
    reviews: Review[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalReviews?: number;
}

export function ReviewsList({ reviews, currentPage, totalPages, onPageChange, totalReviews }: ReviewsListProps) {
    const [activeFilter, setActiveFilter] = useState("All Reviews");
    const [sortBy, setSortBy] = useState("Latest first");
    const reviewsSectionRef = useRef<HTMLDivElement>(null);

    const Pagination = () => {
        const getVisiblePages = () => {
            const delta = 2; // Number of pages to show on each side of current page
            const range = [];
            const rangeWithDots = [];

            for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
                range.push(i);
            }

            if (currentPage - delta > 2) {
                rangeWithDots.push(1, '...');
            } else {
                rangeWithDots.push(1);
            }

            rangeWithDots.push(...range);

            if (currentPage + delta < totalPages - 1) {
                rangeWithDots.push('...', totalPages);
            } else {
                if (totalPages > 1) rangeWithDots.push(totalPages);
            }

            return rangeWithDots;
        };

        return (
            <div className="flex justify-center items-center gap-1 mt-8">
                {/* Previous Button */}
                <button
                    onClick={() => {
                        if (currentPage > 1) {
                            onPageChange(currentPage - 1);
                            setTimeout(() => {
                                reviewsSectionRef.current?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }, 100);
                        }
                    }}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded flex items-center justify-center border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                {getVisiblePages().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (typeof page === 'number') {
                                onPageChange(page);
                                setTimeout(() => {
                                    reviewsSectionRef.current?.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                }, 100);
                            }
                        }}
                        disabled={page === '...'}
                        className={`w-8 h-8 rounded flex items-center justify-center text-sm ${page === currentPage
                                ? 'bg-orange-400 text-white'
                                : page === '...'
                                    ? 'cursor-default'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Next Button */}
                <button
                    onClick={() => {
                        if (currentPage < totalPages) {
                            onPageChange(currentPage + 1);
                            setTimeout(() => {
                                reviewsSectionRef.current?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }, 100);
                        }
                    }}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded flex items-center justify-center border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        );
    };

    return (
        <div ref={reviewsSectionRef} className="bg-white ">
            {/* Header */}
            {/* <div className="px-6 py-5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                    <div className="mb-4 lg:mb-0">
                        <h2 className="text-lg mb-1">Reviews Summary</h2>
                        <p className="text-sm text-gray-600 mb-3">Posted by Prem AI</p>
                        <p className="text-sm text-gray-700 leading-relaxed max-w-2xl">
                            Primo Bom Terra Verde offers a serene escape amidst lush greenery, making it ideal for
                            nature lovers. Guests highlight the beautiful wooden cottages, well-maintained pool, and
                            proximity to both Baga and Calangute beaches. The property allows for couples stay here.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm text-gray-600">Sort by:</span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-32 h-8 text-sm border-gray-300">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Latest first">Latest first</SelectItem>
                                <SelectItem value="Oldest first">Oldest first</SelectItem>
                                <SelectItem value="Highest rated">Highest rated</SelectItem>
                                <SelectItem value="Lowest rated">Lowest rated</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

               
                <div className="space-y-3">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <p className="text-sm text-gray-600 mb-2 lg:mb-0">Filter By:</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={activeFilter === "All Reviews" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveFilter("All Reviews")}
                            className={`text-xs h-8 px-3 rounded-md ${activeFilter === "All Reviews"
                                    ? "gradient-btn hover:bg-orange-500 text-white border-orange-400"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            All Reviews
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 px-3 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Resort Cleanliness
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 px-3 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Staff Courtesy
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 px-3 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Service Quality
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 px-3 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Location
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 px-3 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Room Quality
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 px-3 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cottages
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 px-3 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Distance from Beach
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 px-3 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Room Cleanliness
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 px-3 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Pool
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 px-3 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Restaurant
                        </Button>
                    </div>
                </div>
            </div> */}

            {/* Separator */}
            {/* <div className="border-t border-gray-200"></div> */}

            {/* Reviews */}
            <div className="px-6 ">
                <div className="">
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            rating={review.rating}
                            title={review.title}
                            description={review.description}
                            travelMonth={review.travelMonth}
                            travelYear={review.travelYear}
                            roomType={review.roomType}
                            helpful={review.helpful}
                            author={review.author}
                            location={review.location}
                        />
                    ))}
                </div>

                {/* Only show pagination if there are 5 or more total reviews */}
                {totalReviews && totalReviews >= 5 && <Pagination />}
            </div>
        </div>
    );
}