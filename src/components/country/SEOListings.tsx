import Link from "next/link";

interface SEOListingsProps {
  seoData: {
    nearbyCities: Array<{ name: string; slug: string }>;
    bestHotels: Array<{ name: string; slug: string; city: string }>;
    categories: string[];
  };
}

export default function SEOListings({ seoData }: SEOListingsProps) {
  return (
    <section className="py-12 md:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Nearby Cities */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Popular Cities in India
            </h3>
            <ul className="space-y-2">
              {seoData.nearbyCities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/site/${city.slug}`}
                    className="text-gray-600 hover:text-[#FF9530] transition-colors text-sm md:text-base"
                  >
                    Hotels in {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Best Hotels */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Top Rated Hotels
            </h3>
            <ul className="space-y-2">
              {seoData.bestHotels.map((hotel) => (
                <li key={hotel.slug}>
                  <Link
                    href={`/hotels/${hotel.slug}`}
                    className="text-gray-600 hover:text-[#FF9530] transition-colors text-sm md:text-base"
                  >
                    {hotel.name}, {hotel.city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {seoData.categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/hotels?category=${encodeURIComponent(category)}`}
                  className="text-sm bg-white hover:bg-[#FF9530] hover:text-white text-gray-700 px-3 py-1.5 rounded-full transition-colors border border-gray-200"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
