import ShimmerCardLoader from "./ShimmerCardLoader";

export default function SectionGridFeaturePlacesSkeleton() {
  return (
    <section className="py-14 bg-section-color">
      <div className="max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4 mx-auto md:mx-0"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto md:mx-0"></div>
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-full w-24"></div>
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ShimmerCardLoader key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
