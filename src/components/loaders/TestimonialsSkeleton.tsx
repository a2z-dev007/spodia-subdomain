import { Skeleton } from "@/components/ui/skeleton"

export default function TestimonialsSkeleton() {
  return (
    <section className="py-14 bg-section-color">
      <div className="max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4">
        {/* Header Badge Skeleton */}
        <div className="flex mb-4">
          <Skeleton className="h-10 w-48 rounded-full" />
        </div>
        
        {/* Title Skeleton */}
        <Skeleton className="h-10 w-80 mx-auto mb-8 md:mb-12" />
        
        {/* Testimonial Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
              {/* Title */}
              <Skeleton className="h-6 w-3/4 mb-4" />
              
              {/* Description */}
              <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              
              {/* User Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
