/**
 * Responsive Loader Component
 * Adapts size and spacing based on screen size
 */

import { Loader2 } from "lucide-react"

interface ResponsiveLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  message?: string
  variant?: 'spinner' | 'dots' | 'pulse'
  color?: 'orange' | 'blue' | 'gray'
}

export function ResponsiveLoader({ 
  size = 'md', 
  message, 
  variant = 'spinner',
  color = 'orange'
}: ResponsiveLoaderProps) {
  
  // Size classes for different screen sizes
  const sizeClasses = {
    sm: 'w-6 h-6 sm:w-8 sm:h-8',
    md: 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12',
    lg: 'w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16',
    xl: 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20'
  }

  // Color classes
  const colorClasses = {
    orange: 'border-orange-500 text-orange-500',
    blue: 'border-blue-500 text-blue-500',
    gray: 'border-gray-500 text-gray-500'
  }

  // Text size classes
  const textSizeClasses = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
    xl: 'text-lg sm:text-xl'
  }

  if (variant === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 p-4">
        <div 
          className={`animate-spin rounded-full border-b-4 ${sizeClasses[size]} ${colorClasses[color]}`}
          role="status"
          aria-label="Loading"
        />
        {message && (
          <p className={`text-gray-600 font-medium text-center ${textSizeClasses[size]}`}>
            {message}
          </p>
        )}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 p-4">
        <div className="flex items-center gap-2">
          <div className={`rounded-full bg-orange-500 animate-bounce ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'}`} style={{ animationDelay: '0ms' }} />
          <div className={`rounded-full bg-orange-500 animate-bounce ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'}`} style={{ animationDelay: '150ms' }} />
          <div className={`rounded-full bg-orange-500 animate-bounce ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'}`} style={{ animationDelay: '300ms' }} />
        </div>
        {message && (
          <p className={`text-gray-600 font-medium text-center ${textSizeClasses[size]}`}>
            {message}
          </p>
        )}
      </div>
    )
  }

  // Pulse variant using Loader2 icon
  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 p-4">
      <Loader2 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        aria-label="Loading"
      />
      {message && (
        <p className={`text-gray-600 font-medium text-center ${textSizeClasses[size]}`}>
          {message}
        </p>
      )}
    </div>
  )
}

/**
 * Full Page Loader - Responsive
 */
export function FullPageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4">
      <ResponsiveLoader size="lg" message={message} variant="spinner" color="orange" />
    </div>
  )
}

/**
 * Inline Loader - Small, for buttons and inline elements
 */
export function InlineLoader({ color = 'white' }: { color?: 'white' | 'orange' | 'blue' }) {
  const colorClass = color === 'white' ? 'border-white' : color === 'orange' ? 'border-orange-500' : 'border-blue-500'
  
  return (
    <div 
      className={`animate-spin rounded-full w-4 h-4 sm:w-5 sm:h-5 border-2 border-t-transparent ${colorClass}`}
      role="status"
      aria-label="Loading"
    />
  )
}

/**
 * Card Loader - For loading cards/sections
 */
export function CardLoader({ message }: { message?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <ResponsiveLoader size="md" message={message} variant="spinner" color="orange" />
    </div>
  )
}

/**
 * Button Loader - For loading states in buttons
 */
export function ButtonLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <InlineLoader color="white" />
      <span className="text-sm sm:text-base">{text}</span>
    </div>
  )
}
