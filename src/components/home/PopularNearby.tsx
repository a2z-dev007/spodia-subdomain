"use client"

import { useState } from "react"
import BookNowButton from "@/components/ui/BookNowButton"
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const PopularNearby = () => {
  const [activeFilter, setActiveFilter] = useState("All")
  const [currentIndex, setCurrentIndex] = useState(0)
  const filters = ["All", "Luxury", "Standard", "Villa", "Cottages", "Townhouses", "Shared Space"]

  const properties = [
    {
      id: 1,
      title: "California Sunset/Twilight Boat Cruise",
      location: "Manchester, England",
      rating: 4.8,
      reviews: 672,
      price: 48.25,
      image: "/placeholder.svg?height=200&width=300",
      badge: "Top Rated",
    },
    {
      id: 2,
      title: "NYC: Food Tastings and Culture Tour",
      location: "Manchester, England",
      rating: 4.9,
      reviews: 524,
      price: 17.32,
      image: "/placeholder.svg?height=200&width=300",
      badge: "Best Seller",
    },
    {
      id: 3,
      title: "Grand Canyon Horseshoe Bend 2 days",
      location: "Manchester, England",
      rating: 5.0,
      reviews: 892,
      price: 15.63,
      image: "/placeholder.svg?height=200&width=300",
      badge: "25% Off",
    },
    {
      id: 4,
      title: "Luxury Beach Resort Experience",
      location: "Miami, Florida",
      rating: 4.7,
      reviews: 445,
      price: 89.99,
      image: "/placeholder.svg?height=200&width=300",
      badge: "New",
    },
    {
      id: 5,
      title: "Mountain Lodge Adventure",
      location: "Colorado, USA",
      rating: 4.6,
      reviews: 321,
      price: 65.5,
      image: "/placeholder.svg?height=200&width=300",
      badge: "Popular",
    },
  ]

  const itemsPerPage = 3
  const maxIndex = Math.max(0, properties.length - itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Nearby</h2>
          <p className="text-gray-600 mb-8">Quality as judged by customers. Book at the ideal price!</p>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {filters?.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeFilter === filter
                    ? "bg-[#FF9530] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
            >
              {properties.map((property) => (
                <div key={property.id} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2 sm:px-4">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <Image
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        width={300}
                        height={200}
                        className="w-full h-40 sm:h-48 object-cover"
                      />
                      {/* <button className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </button> */}
                      {property.badge && (
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#FF9530] text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                          {property.badge}
                        </div>
                      )}
                    </div>

                    <div className="p-4 sm:p-6">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1.5 sm:mb-2 line-clamp-2">{property.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">{property.location}</p>

                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                i < Math.floor(property.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-gray-600">
                          {property.rating} ({property.reviews})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg sm:text-2xl font-bold text-gray-900">${property.price}</span>
                          <span className="text-gray-600 text-xs sm:text-sm"> / person</span>
                        </div>
                        <BookNowButton
                          size="sm"
                          variant="solid"
                          className="bg-[#078ED8] hover:bg-[#0679b8] text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed [-webkit-tap-highlight-color:transparent]"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed [-webkit-tap-highlight-color:transparent]"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default PopularNearby
