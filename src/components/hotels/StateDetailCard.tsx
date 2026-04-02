"use client";

import Image from "next/image";
import { MapPin, Calendar, DollarSign, Star, UtensilsCrossed } from "lucide-react";

interface StateDetail {
    state: string;
    tagline: string;
    description: string;
    image: string;
    popularCities: string[];
    bestTimeToVisit: string;
    averageHotelPrice: string;
    topAttractions: string[];
    famousFood: string[];
}

const StateDetailCard = ({ stateData }: { stateData: StateDetail }) => {
    const placeholderImage = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop";

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200">
            {/* Hero Image Section */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden group">
                <Image
                    src={stateData.image || placeholderImage}
                    alt={stateData.state}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.currentTarget.src = placeholderImage;
                    }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                {/* State Name & Tagline */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">{stateData.state}</h2>
                    <p className="text-lg md:text-xl text-gray-200">{stateData.tagline}</p>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 space-y-6">
                {/* Description */}
                <p className="text-gray-700 leading-relaxed text-base">
                    {stateData.description}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Best Time to Visit */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1">Best Time</p>
                            <p className="text-sm text-blue-800 font-medium">{stateData.bestTimeToVisit}</p>
                        </div>
                    </div>

                    {/* Average Hotel Price */}
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-green-900 uppercase tracking-wide mb-1">Hotel Price</p>
                            <p className="text-sm text-green-800 font-medium">{stateData.averageHotelPrice}</p>
                        </div>
                    </div>
                </div>

                {/* Popular Cities */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        <h3 className="text-lg font-bold text-gray-900">Popular Cities</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {stateData.popularCities.map((city, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors cursor-pointer"
                            >
                                {city}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Top Attractions */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Star className="w-5 h-5 text-purple-500" />
                        <h3 className="text-lg font-bold text-gray-900">Top Attractions</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {stateData.topAttractions.map((attraction, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-100"
                            >
                                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                                <p className="text-sm text-purple-900 font-medium">{attraction}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Famous Food */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <UtensilsCrossed className="w-5 h-5 text-red-500" />
                        <h3 className="text-lg font-bold text-gray-900">Famous Food</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {stateData.famousFood.map((food, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors cursor-pointer"
                            >
                                {food}
                            </span>
                        ))}
                    </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Explore Hotels in {stateData.state}
                </button>
            </div>
        </div>
    );
};

export default StateDetailCard;
