'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Share2, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  stars: number;
  images: string[];
}

interface HotelImageCarouselProps {
  hotel: Hotel;
}

export function HotelImageCarousel({ hotel }: HotelImageCarouselProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % hotel.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
  };

  return (
    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img
          src={hotel.images[currentImage]}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="sm"
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
        
        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImage + 1} / {hotel.images.length}
        </div>
        
        {/* Hotel Information Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {[...Array(hotel.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  {hotel.name}
                </h1>
                
                <div className="flex items-center space-x-4 text-white/90">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{hotel.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{hotel.rating}</span>
                    </div>
                    <span>({hotel.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button> */}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Thumbnail Strip */}
      <div className="absolute bottom-20 left-6 right-6 hidden md:block">
        <div className="flex space-x-2 overflow-x-auto">
          {hotel.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImage ? 'border-white' : 'border-white/30'
              }`}
            >
              <img
                src={image}
                alt={`${hotel.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}