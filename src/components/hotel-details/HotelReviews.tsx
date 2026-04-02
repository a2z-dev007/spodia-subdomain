import { Star } from "lucide-react"
import Image from "next/image"

interface HotelReviewsProps {
  hotelId: string
}

const HotelReviews = ({ hotelId }: HotelReviewsProps) => {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      date: "2 days ago",
      title: "Exceptional stay!",
      content:
        "The hotel exceeded all expectations. The staff was incredibly friendly and helpful, the room was spacious and clean, and the location was perfect for exploring the city.",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "San Francisco, USA",
      rating: 4,
      date: "1 week ago",
      title: "Great value for money",
      content:
        "Really enjoyed our stay here. The amenities were top-notch and the breakfast was delicious. Would definitely recommend to anyone visiting the area.",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      id: 3,
      name: "Emma Wilson",
      location: "London, UK",
      rating: 5,
      date: "2 weeks ago",
      title: "Perfect location",
      content:
        "Couldn't have asked for a better location. Walking distance to all major attractions and the hotel itself was beautiful. The spa was a wonderful bonus!",
      avatar: "/placeholder.svg?height=50&width=50",
    },
  ]

  const averageRating = 4.8
  const totalReviews = 1247

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xl font-bold text-gray-900">{averageRating}</span>
          <span className="text-gray-600">({totalReviews} reviews)</span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-600">{review.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{review.date}</span>
                  </div>
                </div>

                <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                <p className="text-gray-600 leading-relaxed">{review.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HotelReviews
