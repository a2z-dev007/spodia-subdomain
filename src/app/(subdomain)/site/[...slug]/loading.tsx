import { Skeleton } from "@/components/ui/skeleton";

export default function CountryPageLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Skeleton */}
      <section className="relative min-h-[85vh] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <Skeleton className="h-12 md:h-16 lg:h-20 w-3/4 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-6 md:h-8 w-1/2 mx-auto bg-white/20" />
          </div>
          <Skeleton className="h-64 md:h-72 rounded-2xl md:rounded-3xl bg-white/90 max-w-5xl mx-auto" />
        </div>
      </section>

      {/* Trending Destinations Skeleton */}
      <section className="py-12 md:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <Skeleton className="h-8 md:h-10 w-1/3 mb-2" />
          <Skeleton className="h-5 w-1/2 mb-8" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Why Spodia Skeleton */}
      <section className="py-12 md:py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <Skeleton className="h-8 md:h-10 w-1/3 mx-auto mb-2" />
          <Skeleton className="h-5 w-1/2 mx-auto mb-10" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Chains Skeleton */}
      <section className="py-12 md:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <Skeleton className="h-8 md:h-10 w-1/3 mx-auto mb-2" />
          <Skeleton className="h-5 w-1/2 mx-auto mb-10" />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Travel Inspiration Skeleton */}
      <section className="py-12 md:py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <Skeleton className="h-8 md:h-10 w-1/3 mb-2" />
          <Skeleton className="h-5 w-1/2 mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden">
                <Skeleton className="aspect-video" />
                <div className="p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Ecosystem Skeleton */}
      <section className="py-12 md:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <Skeleton className="h-8 md:h-10 w-1/2 mx-auto mb-2" />
          <Skeleton className="h-5 w-2/3 mx-auto mb-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100">
                <Skeleton className="aspect-[4/3]" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-8 w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Skeleton */}
      <section className="py-12 md:py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <Skeleton className="h-8 md:h-10 w-1/3 mx-auto mb-2" />
          <Skeleton className="h-5 w-1/2 mx-auto mb-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl bg-gradient-to-br from-orange-200 to-red-200" />
            ))}
          </div>
        </div>
      </section>

      {/* SEO Listings Skeleton */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-7 w-1/2 mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
