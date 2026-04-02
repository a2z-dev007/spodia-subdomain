import { ThumbsUp } from "lucide-react";
import TextAvatar from "@/components/ui/TextAvatar";
import Image from "next/image";

interface ReviewCardProps {
  rating: number;
  title: string;
  description: string;
  travelMonth: string;
  travelYear: number;
  roomType: string;
  helpful: number;
  author?: string;
  location?: string;
  profileImage?: string;
  ratings?: {
    cleanliness: number;
    comfort: number;
    facilities: number;
    valueForMoney: number;
    staff: number;
    location: number;
  };
}

export function ReviewCard({ 
  rating, 
  title, 
  description, 
  travelMonth, 
  travelYear, 
  roomType, 
  helpful,
  author,
  location,
  profileImage,
  ratings
}: ReviewCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'bg-green-500';
    if (rating >= 8) return 'bg-orange-400';
    if (rating >= 7) return 'bg-yellow-500';
    if (rating >= 6) return 'bg-orange-300';
    return 'bg-red-500';
  };

  const getRatingText = (rating: number) => {
    if (rating >= 9) return 'Excellent';
    if (rating >= 8) return 'Very Good';
    if (rating >= 7) return 'Good';
    if (rating >= 6) return 'Pleasant';
    if (rating >= 5) return 'Average';
    return 'Below Average';
  };

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <div className="flex items-start gap-4 py-5">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {profileImage ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={profileImage}
                alt={author || "User"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <TextAvatar 
              name={author || "Anonymous"} 
              identifier={author || "anonymous"} 
              size="md" 
            />
          )}
        </div>

        {/* Rating Badge */}
        <div className="flex flex-col items-center gap-1 min-w-[60px]">
          <div className={`${getRatingColor(rating)} text-white px-2 py-1 rounded text-sm min-w-[40px] text-center`}>
            {rating}
          </div>
          <span className="text-xs text-gray-500">{getRatingText(rating)}</span>
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h4 className="text-base mb-1">{title}</h4>
            {author && location && (
              <p className="text-sm text-gray-600">{author} • {location}</p>
            )}
          </div>
          
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">{description}</p>
          
          {/* Rating Pills */}
          {ratings && (
            <div className="flex flex-wrap gap-2 mb-4">
              {ratings.cleanliness > 0 && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200">
                  Cleanliness: {ratings.cleanliness}
                </span>
              )}
              {ratings.comfort > 0 && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs border border-purple-200">
                  Comfort: {ratings.comfort}
                </span>
              )}
              {ratings.facilities > 0 && (
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">
                  Facilities: {ratings.facilities}
                </span>
              )}
              {ratings.valueForMoney > 0 && (
                <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs border border-yellow-200">
                  Value: {ratings.valueForMoney}
                </span>
              )}
              {ratings.staff > 0 && (
                <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs border border-pink-200">
                  Staff: {ratings.staff}
                </span>
              )}
              {ratings.location > 0 && (
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs border border-indigo-200">
                  Location: {ratings.location}
                </span>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
            <div className="flex flex-wrap items-center gap-1">
              <span>Travel Month: <span className="text-gray-700">{travelMonth} {travelYear}</span></span>
              <span className="hidden sm:inline mx-2">|</span>
              <span className="block sm:inline">Room: <span className="text-gray-700">{roomType}</span></span>
            </div>
            
            {/* <div className="flex items-center gap-2">
              <span className="text-gray-600">Helpful</span>
              <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                <ThumbsUp className="w-4 h-4" />
                <span>{helpful}</span>
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}