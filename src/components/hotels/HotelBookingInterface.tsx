import React from "react";
import { Star, Users, Calendar, MapPin, Wifi, Wind } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HotelBookingInterfaceProps {
  hotels?: any[];
  isLoading?: boolean;
  title?: string;
}

const HotelBookingInterface = ({
  hotels = [],
  isLoading = false,
  title = "Available Rooms",
}: HotelBookingInterfaceProps) => {
  const availableRooms = hotels.length > 0 ? hotels : [];

  const indianStates = [
    {
      state: "Rajasthan",
      tagline: "Palaces, Deserts & Royal Heritage",
      description:
        "Rajasthan is known for majestic forts, golden deserts, and regal hospitality. A perfect blend of history and culture.",
      image: "/images/places/rajasthan.jpg",
    },
    {
      state: "Goa",
      tagline: "Beaches, Parties & Relaxed Vibes",
      description: "A tropical paradise with golden beaches, Portuguese ",
      image: "/images/places/goa.jpg",
    },
    {
      state: "Kerala",
      tagline: "Backwaters & Green Landscapes",
      description:
        "Kerala offers serene backwaters, lush hills, ayurvedic wellness, and calm beaches.",
      image: "/images/places/kerala.jpg",
    },
    {
      state: "Himachal Pradesh",
      tagline: "Mountains, Valleys & Adventure",
      description:
        "A scenic mountain escape with snow peaks, peaceful valleys, and adventure sports.",
      image: "/images/places/himachal.jpg",
    },
    {
      state: "Uttar Pradesh",
      tagline: "History, Spirituality & Heritage",
      description:
        "Home to iconic monuments and spiritual landmarks, from the Taj Mahal to holy ghats.",
      image: "/images/places/uttarpradesh.jpg",
    },
    {
      state: "Maharashtra",
      tagline: "Modern Cities & Cultural Mix",
      description:
        "From bustling Mumbai to hill stations like Lonavala, Maharashtra has something for every traveler.",
      image: "/images/places/mumbai.jpg",
    },
    {
      state: "Tamil Nadu",
      tagline: "Temples, Beaches & Culture",
      description:
        "A beautiful mix of heritage temples, serene beaches, and classical art traditions.",
      image: "/images/places/tamilnadu.jpg",
    },
    {
      state: "West Bengal",
      tagline: "Culture, Tea Gardens & Colonial Charm",
      description:
        "Rich literature, colonial architecture, Darjeeling hills, and artistic soul.",
      image: "/images/places/west-bengal.jpg",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        className={`${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  // Don't render if no hotels and not loading
  if (!isLoading && availableRooms.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen  mt-16 ">
      {/* Available Rooms Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border-storke  rounded-20 p-10">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            {title}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white py-6 px-7 rounded-[20px] border-storke animate-pulse"
                >
                  <div className="h-40 bg-gray-200 rounded-2xl mb-7"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
              {availableRooms.slice(0, 4).map((hotel: any) => {
                const isRealHotel = "name" in hotel && hotel.images;
                const hotelImage = isRealHotel
                  ? hotel.images?.find((img: any) => img.cover_photo)?.file ||
                    hotel.images?.[0]?.file ||
                    "/images/articleImg.png"
                  : hotel.image || "/images/articleImg.png";
                const hotelName = isRealHotel
                  ? hotel.name || "Hotel Name"
                  : hotel.name;
                const hotelRating = isRealHotel
                  ? Math.round(hotel.review_rating || 4)
                  : hotel.rating || 4;
                const hotelReviews = isRealHotel
                  ? hotel.review_rating_count || 0
                  : hotel.reviews || 0;
                const hotelPrice = isRealHotel
                  ? `₹${hotel.sbr_rate?.toLocaleString() || "563"}`
                  : hotel.price || "₹563";
                const hotelLocation = isRealHotel
                  ? `${hotel.city_name || ""}, ${hotel.state_name || ""}`
                      .trim()
                      .replace(/^,\s*|,\s*$/g, "")
                  : "";
                const facilitiesDetails = isRealHotel
                  ? hotel.facilitiesDetails || []
                  : [];
                const hasWifi = facilitiesDetails.some(
                  (f: any) =>
                    f.name?.toLowerCase().includes("wifi") ||
                    f.name?.toLowerCase().includes("wi-fi"),
                );
                const hasAC = facilitiesDetails.some(
                  (f: any) =>
                    f.name?.toLowerCase().includes("air conditioning") ||
                    f.name?.toLowerCase().includes("ac"),
                );

                // Generate URL with hotel name and city like: /hotels/mayur-gardens-guwahati
                const hotelSlug = isRealHotel
                  ? hotel.slug ||
                    `${hotel?.name}-${hotel?.city_name}`
                      .replace(/\s+/g, "-")
                      .toLowerCase()
                  : "#";

                return (
                  <Link
                    key={hotel.id}
                    href={isRealHotel ? `/hotels/${hotelSlug}` : "#"}
                    className="bg-white py-6 px-7 rounded-[20px] border-storke overflow-hidden hover:shadow-lg transition-shadow block"
                  >
                    {/* Hotel Image */}
                    <div className="relative h-40 mb-7">
                      <div className="absolute inset-0">
                        <Image
                          className="object-cover w-full h-full rounded-2xl"
                          alt={hotelName || "Hotel"}
                          width={240}
                          height={200}
                          src={hotelImage}
                        />
                      </div>
                    </div>

                    {/* Hotel Details */}
                    <div className="">
                      <h3 className="font-medium text-gray-800 mb-2 line-clamp-1">
                        {hotelName}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex">{renderStars(hotelRating)}</div>
                        <span className="ml-2 text-xs text-gray-500">
                          ({hotelReviews})
                        </span>
                      </div>

                      {/* Amenities */}
                      <div className="space-y-2 mb-4">
                        {isRealHotel && hotelLocation && (
                          <div className="flex items-center text-xs text-gray-600">
                            <MapPin
                              size={12}
                              className="mr-2 text-gray-400 flex-shrink-0"
                            />
                            <span className="line-clamp-1">
                              {hotelLocation}
                            </span>
                          </div>
                        )}
                        {hasWifi && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Wifi size={12} className="mr-2 text-gray-400" />
                            <span>Free WiFi</span>
                          </div>
                        )}
                        {hasAC && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Wind size={12} className="mr-2 text-gray-400" />
                            <span>AC</span>
                          </div>
                        )}
                        {!isRealHotel && (
                          <>
                            <div className="flex items-center text-xs text-gray-600">
                              <Users size={12} className="mr-2 text-gray-400" />
                              <span>{hotel.guests}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Calendar
                                size={12}
                                className="mr-2 text-gray-400"
                              />
                              <span>{hotel.checkin}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/*Reviews*/}
                      <div className="flex items-center mb-3">
                        <div className="gradient-btn text-center text-white h-8 w-8 text-sm flex justify-center items-center rounded-full">
                          <span>
                            {isRealHotel
                              ? (hotel.review_rating || 4.5).toFixed(1)
                              : "4.5"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 ml-3">
                            {isRealHotel
                              ? (hotel.review_rating || 0) >= 4.5
                                ? "Excellent"
                                : (hotel.review_rating || 0) >= 4
                                  ? "Very Good"
                                  : "Good"
                              : "Awesome Rooms"}
                          </p>
                          <p className="text-xs text-gray-500 ml-3">
                            {hotelReviews} Reviews
                          </p>
                        </div>
                      </div>

                      {/* Price and Details */}
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <span className="text-lg font-bold text-gray-800">
                            {hotelPrice}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            /night
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        {/* Popular Indian States Section */}
        <div className="bg-white p-10 mt-11 border-storke rounded-20">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            Popular Indian States
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {indianStates.map((state, index) => (
              <div
                key={index}
                className="bg-white rounded-20 border-storke overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* State Image */}
                <div className="relative h-32 w-full overflow-hidden">
                  <Image
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    alt={state.state}
                    width={300}
                    height={200}
                    src={state.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-bold text-white text-lg">
                      {state.state}
                    </h3>
                    <p className="text-white/80 text-xs">{state.tagline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingInterface;
