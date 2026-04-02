import ShimmerCardLoader from "./ShimmerCardLoader";

export default function TopRatedHotelsSkeleton() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4">
        <div className="flex flex-col gap-4 md:flex-row items-center justify-between mb-6">
          <div className="w-full md:w-auto">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4 mx-auto md:mx-0"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto md:mx-0"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="py-4 px-2 sm:py-6 sm:px-4">
              <ShimmerCardLoader />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
