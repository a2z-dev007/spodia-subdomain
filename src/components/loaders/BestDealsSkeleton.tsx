import { Skeleton } from "@/components/ui/skeleton";

export default function BestDealsSkeleton() {
  return (
    <section className="py-14 bg-section-color">
      <div className="max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4">
        <div className="flex items-center justify-between flex-col md:flex-row mb-12">
          <div className="">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4 mx-auto md:mx-0"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto md:mx-0"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row"
            >
              {/* Image Skeleton */}
              <div className="relative w-full h-44 md:h-auto md:w-56 overflow-hidden bg-gray-100">
                <Skeleton className="w-full h-full" />
              </div>
              {/* Content Skeleton */}
              <div className="flex-1 p-4 flex flex-col justify-between py-8">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2 mb-2" />

                  <div className="flex items-center justify-between mb-8">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-3 w-3 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mt-2">
                  <div>
                    <Skeleton className="h-6 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
