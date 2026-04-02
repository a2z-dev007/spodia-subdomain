import React from 'react'

const ShimmerCardLoader = () => {
  return (
    <div>
      
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
    {/* Image placeholder */}
    <div className="relative h-48 bg-gray-200">
      <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 rounded-full"></div>
    </div>
    
    {/* Content */}
    <div className="p-4 space-y-3">
      {/* Title */}
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      
      {/* Location */}
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      
      {/* Rating and reviews */}
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-3 bg-gray-200 rounded w-12"></div>
      </div>
      
      {/* Price */}
      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      
      {/* Features */}
      <div className="flex space-x-2">
        <div className="h-3 bg-gray-200 rounded w-8"></div>
        <div className="h-3 bg-gray-200 rounded w-8"></div>
        <div className="h-3 bg-gray-200 rounded w-8"></div>
      </div>
    </div>
  </div>

    </div>
  )
}

export default ShimmerCardLoader;