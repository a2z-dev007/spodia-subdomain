import {useState, useEffect} from "react";
import {getReviewsPage, mockRatingsData} from "./mockData";
import {TopNavigation} from "./TopNavigation";
import {RatingsSummary} from "./RatingsSummary";
import {ReviewsList} from "./ReviewsList";
import { getReviews } from "@/services/api";


interface UserReviewsProps {
    hotelData?: any;
    hotelId?: number;
}

interface ApiReview {
    id: number;
    reservation: number;
    comment: string;
    cleanliness_rate: number;
    communication_rate: number;
    location_rate: number;
    recommended: boolean;
    traveller_details: {
        first_name: string;
        last_name: string;
        city: string;
        profile_image: string;
    };
    created: string;
    listingdetails: any;
    staff_rate: number;
    valuesformoney_rate: number;
    comfort_rate: number;
    facilities_rate: number;
}

interface ApiResponse {
    status: string;
    records: ApiReview[];
    aggregate_reviews?: {
        cleanliness_rate_avg: number;
        comfort_rate_avg: number;
        facilities_rate_avg: number;
        valuesformoney_rate_avg: number;
        staff_rate_avg: number;
        location_rate_avg: number;
    };
}

export default function UserReviews({ hotelData, hotelId }: UserReviewsProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsData, setReviewsData] = useState(getReviewsPage(1));
    const [activeTab, setActiveTab] = useState("everyone");
    const [apiReviews, setApiReviews] = useState<ApiReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [aggregateRatings, setAggregateRatings] = useState<any>(null);
    const itemsPerPage = 10;

    // Fetch reviews from API
    useEffect(() => {
        if (hotelId) {
            fetchReviews();
        }
    }, [hotelId]);

    const fetchReviews = async () => {
        if (!hotelId) {
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const response = await getReviews(hotelId);
            const data: ApiResponse = response.data;
            
            if (data.status === "success") {
                setApiReviews(data.records);
                if (data.aggregate_reviews) {
                    setAggregateRatings(data.aggregate_reviews);
                }
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        // In a real app, this would filter the data based on the selected tab
        console.log(`Filtering reviews for: ${tab}`);
    };

    // Transform API reviews to match the component's expected format
    const transformedReviews = apiReviews.map((review) => {
        const avgRating = (
            review.cleanliness_rate +
            review.comfort_rate +
            review.facilities_rate +
            review.valuesformoney_rate +
            review.staff_rate +
            review.location_rate
        ) / 6;

        const createdDate = new Date(review.created);
        
        return {
            id: review.id,
            rating: Number(avgRating.toFixed(1)),
            title: review.recommended ? "Recommended Stay" : "Review",
            description: review.comment,
            travelMonth: createdDate.toLocaleString('default', { month: 'long' }),
            travelYear: createdDate.getFullYear(),
            roomType: "Room",
            helpful: 0,
            author: `${review.traveller_details.first_name} ${review.traveller_details.last_name}`,
            location: review.traveller_details.city,
            category: review.recommended ? "Recommended" : "Review",
            profileImage: review.traveller_details.profile_image,
            // Add individual ratings
            ratings: {
                cleanliness: review.cleanliness_rate,
                comfort: review.comfort_rate,
                facilities: review.facilities_rate,
                valueForMoney: review.valuesformoney_rate,
                staff: review.staff_rate,
                location: review.location_rate,
            }
        };
    });

    // Calculate pagination
    const totalPages = Math.ceil(transformedReviews.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedReviews = transformedReviews.slice(startIndex, endIndex);

    // Use API data for ratings if available
    const ratingsData = aggregateRatings ? {
        overallRating: (
            (aggregateRatings.cleanliness_rate_avg || 0) +
            (aggregateRatings.comfort_rate_avg || 0) +
            (aggregateRatings.facilities_rate_avg || 0) +
            (aggregateRatings.valuesformoney_rate_avg || 0) +
            (aggregateRatings.staff_rate_avg || 0) +
            (aggregateRatings.location_rate_avg || 0)
        ) / 6,
        totalReviews: apiReviews.length,
        starDistribution: calculateStarDistribution(transformedReviews),
        categories: [
            { name: "Cleanliness", rating: aggregateRatings.cleanliness_rate_avg || 0 },
            { name: "Comfort", rating: aggregateRatings.comfort_rate_avg || 0 },
            { name: "Facilities", rating: aggregateRatings.facilities_rate_avg || 0 },
            { name: "Value for Money", rating: aggregateRatings.valuesformoney_rate_avg || 0 },
            { name: "Staff", rating: aggregateRatings.staff_rate_avg || 0 },
            { name: "Location", rating: aggregateRatings.location_rate_avg || 0 },
        ],
    } : hotelData ? {
        ...mockRatingsData,
        overallRating: hotelData.review_rating || mockRatingsData.overallRating,
        totalReviews: hotelData.review_rating_count || mockRatingsData.totalReviews,
    } : mockRatingsData;

    function calculateStarDistribution(reviews: any[]) {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            const rating = Math.round(review.rating);
            if (rating >= 1 && rating <= 5) {
                distribution[rating as keyof typeof distribution]++;
            }
        });
        return distribution;
    }

    return (
        <div className=" bg-white rounded-[20px] border border-gray-200 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Top Navigation */}
                <TopNavigation
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : apiReviews.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        {/* Left Side - Ratings Summary */}
                        <div className="xl:col-span-4">
                            <RatingsSummary
                                overallRating={ratingsData.overallRating}
                                totalReviews={ratingsData.totalReviews}
                                starDistribution={ratingsData.starDistribution}
                                categories={ratingsData.categories}
                            />
                        </div>

                        {/* Right Side - Reviews List */}
                        <div className="xl:col-span-8">
                            <ReviewsList
                                reviews={paginatedReviews}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                totalReviews={transformedReviews.length}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reviews Yet</h3>
                        <p className="text-gray-500">Be the first to review this property!</p>
                    </div>
                )}
            </div>
        </div>
    );
}