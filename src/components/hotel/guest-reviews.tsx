import { Star, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock reviews data
const reviewsData = {
  breakdown: {
    cleanliness: 4.8,
    comfort: 4.7,
    location: 4.9,
    service: 4.6,
    value: 4.5,
  },
  distribution: {
    5: 65,
    4: 25,
    3: 7,
    2: 2,
    1: 1,
  },
  recent: [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 5,
      date: '2 days ago',
      title: 'Exceptional stay with amazing views',
      comment: 'The hotel exceeded all expectations. The ocean view from our room was breathtaking, and the staff went above and beyond to make our stay memorable. The breakfast was delicious and the spa was incredibly relaxing.',
      helpful: 12,
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 4,
      date: '1 week ago',
      title: 'Great location and service',
      comment: 'Perfect location near the beach and shopping areas. The room was clean and comfortable. Only minor issue was the Wi-Fi speed in the room, but overall a great experience.',
      helpful: 8,
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 5,
      date: '2 weeks ago',
      title: 'Perfect for families',
      comment: 'Traveled with kids and the hotel was very family-friendly. The pool area was fantastic and the kids club kept our children entertained. Will definitely return!',
      helpful: 15,
    },
  ],
};

interface GuestReviewsProps {
  hotelId: string;
  rating: number;
  reviews: number;
}

export function GuestReviews({ hotelId, rating, reviews }: GuestReviewsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Guest Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{rating}</div>
            <div className="flex items-center justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-gray-600">{reviews} reviews</div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-3">
            {Object.entries(reviewsData.breakdown).map(([category, score]) => (
              <div key={category} className="flex items-center space-x-3">
                <div className="w-20 text-sm text-gray-600 capitalize">
                  {category}
                </div>
                <div className="flex-1">
                  <Progress value={(score / 5) * 100} className="h-2" />
                </div>
                <div className="w-8 text-sm font-medium text-gray-900">
                  {score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">Rating Distribution</h3>
          {Object.entries(reviewsData.distribution)
            .reverse()
            .map(([stars, percentage]) => (
              <div key={stars} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm text-gray-600">{stars}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <Progress value={percentage} className="h-2" />
                </div>
                <div className="w-12 text-sm text-gray-600">{percentage}%</div>
              </div>
            ))}
        </div>

        {/* Recent Reviews */}
        <div className="space-y-6">
          <h3 className="font-semibold text-gray-900">Recent Reviews</h3>
          {reviewsData.recent.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                  <p className="text-gray-600 mb-3">{review.comment}</p>
                  
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}