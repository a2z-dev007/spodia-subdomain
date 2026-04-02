"use client"

import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  message?: string
  fullScreen?: boolean
}

export default function LoadingScreen({
  message = "Loading...",
  fullScreen = true,
}: LoadingScreenProps) {
  const containerClass = fullScreen
    ? "fixed inset-0 z-50 bg-white"
    : "w-full py-20"

  return (
    <div className={`${containerClass} flex items-center justify-center`}>
      <div className="text-center">
        {/* Logo or Brand */}
        <div className="mb-6">
          <div className="text-4xl font-bold text-[#FF9530] mb-2">Spodia</div>
          <div className="text-sm text-gray-500">Your Travel Companion</div>
        </div>

        {/* Spinner */}
        <div className="flex justify-center mb-4">
          <Loader2 className="w-12 h-12 text-[#FF9530] animate-spin" />
        </div>

        {/* Message */}
        <p className="text-gray-600 text-sm">{message}</p>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-2 h-2 bg-[#FF9530] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-[#FF9530] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-[#FF9530] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}

// Skeleton loader for content
export function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  )
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl p-4 animate-pulse">
      <div className="flex space-x-4">
        <div className="w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  )
}
