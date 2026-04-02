// Removed unused import

interface RatingsSummaryProps {
  overallRating: number;
  totalReviews: number;
  starDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  categories: {
    name: string;
    rating: number;
  }[];
}

export function RatingsSummary({ 
  overallRating, 
  totalReviews, 
  starDistribution, 
  categories 
}: RatingsSummaryProps) {
  // Handle NaN values
  const safeOverallRating = isNaN(overallRating) || !isFinite(overallRating) ? 0 : Number(overallRating.toFixed(1));
  const safeTotalReviews = isNaN(totalReviews) || !isFinite(totalReviews) ? 0 : totalReviews;
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`text-lg ${i < rating ? 'text-orange-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const getBarColor = (stars: number) => {
    if (stars === 5) return 'bg-green-500';
    if (stars === 4) return 'bg-orange-400';
    if (stars === 3) return 'bg-yellow-400';
    if (stars === 2) return 'bg-orange-300';
    return 'bg-red-400';
  };

  return (
    <div className="bg-white p-6 ">

      {/* Overall Rating */}
      <div className="flex items-center gap-4 mb-6">
        <div className="gradient-btn  text-white px-3 py-2 rounded-2xl text-lg">
          {safeOverallRating}
        </div>
        <div>
          <div className="text-sm text-orange-600">
            {safeOverallRating >= 4.5 ? 'Excellent' : safeOverallRating >= 3.5 ? 'Very Good' : safeOverallRating >= 2.5 ? 'Good' : safeOverallRating > 0 ? 'Average' : 'No Rating'}
          </div>
          <div className="text-sm text-gray-500">{safeTotalReviews} Ratings</div>
        </div>
      </div>

      {/* Star Distribution */}
      <div className="space-y-2 mb-8">
        {[5, 4, 3, 2, 1].map((stars) => {
          const percentage = starDistribution[stars as keyof typeof starDistribution] || 0;
          const safePercentage = isNaN(percentage) || !isFinite(percentage) ? 0 : percentage;
          
          return (
            <div key={stars} className="flex items-center gap-4">
              <span className="text-sm w-12">{stars === 5 ? 'Excellent' : stars === 4 ? 'Very Good' : stars === 3 ? 'Good' : stars === 2 ? 'Average' : 'Bad'}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full gradient-btn `}
                  style={{ width: `${safePercentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{safePercentage}%</span>
            </div>
          );
        })}
      </div>

      {/* Rating Categories */}
      <div>
        <h3 className="mb-4">Rating Categories</h3>
        <div className="space-y-3">
          {categories.map((category, index) => {
            const safeRating = isNaN(category.rating) || !isFinite(category.rating) ? 0 : Number(category.rating.toFixed(1));
            const getRatingLabel = (rating: number) => {
              if (rating >= 9) return 'Excellent';
              if (rating >= 8) return 'Very Good';
              if (rating >= 7) return 'Good';
              if (rating >= 6) return 'Pleasant';
              if (rating >= 5) return 'Average';
              if (rating > 0) return 'Below Average';
              return 'No Rating';
            };
            
            return (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{category.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">{getRatingLabel(safeRating)}</span>
                  <span className="border border-orange-400 main-color px-2 py-1 rounded text-xs font-semibold">
                    {safeRating}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}