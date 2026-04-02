// EXAMPLE: How to update hero-section.tsx to use ResponsiveHotelSearchBar

'use client';

import { useRouter } from "next/navigation";
import ResponsiveHotelSearchBar from '../HotelSearchBar/ResponsiveHotelSearchBar';

function HeroSection() {
  const router = useRouter();

  const handleSearch = (params: {
    location: string;
    cityId: string | number | null;
    checkIn: Date | null;
    checkOut: Date | null;
    guests: { adults: number; children: number };
    rooms: number;
    childrenAges: number[];
  }) => {
    const searchParams = new URLSearchParams();

    if (params.cityId) {
      searchParams.set("city", params.cityId.toString());
    }
    if (params.location) {
      searchParams.set("cityName", params.location);
    }
    if (params.checkIn) {
      const year = params.checkIn.getFullYear();
      const month = String(params.checkIn.getMonth() + 1).padStart(2, '0');
      const day = String(params.checkIn.getDate()).padStart(2, '0');
      searchParams.set("start_date", `${year}-${month}-${day}`);
    }
    if (params.checkOut) {
      const year = params.checkOut.getFullYear();
      const month = String(params.checkOut.getMonth() + 1).padStart(2, '0');
      const day = String(params.checkOut.getDate()).padStart(2, '0');
      searchParams.set("end_date", `${year}-${month}-${day}`);
    }
    searchParams.set("no_of_adult", params.guests.adults.toString());
    searchParams.set("no_of_child", params.guests.children.toString());

    if (params.rooms) {
      searchParams.set("rooms", params.rooms.toString());
    }

    if (params.childrenAges && params.childrenAges.length > 0) {
      searchParams.set("childInfo", params.childrenAges.join(','));
    }

    router.push(`/search-results?${searchParams.toString()}`);
  };

  return (
    <section className="relative min-h-[500px] md:py-8 py-2 px-4 bg-hero-pattern bg-cover bg-center bg-no-repeat overflow-hidden z-0">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto md:px-8 lg:px-0 pb-6 pt-4 px-2 lg:mt-32">
        <div className="text-center md:text-left text-white mb-6 px-2">
          <h1 className="md:text-left lg:text-left xl:text-left xxl:text-left sm:text-center hero-text-heading">
            Find Your Next Stay
          </h1>
          <p className="hero-text-subheading max-w-2xl md:text-left lg:text-left xl:text-left xxl:text-left sm:text-center">
            Search deals on Hotels, Resorts, Homestays, Unique Stays, Offbeat Stays, Village Stays & much more...
          </p>
        </div>
        
        {/* Search Form - Now Responsive! */}
        <div className="pt-4">
          <ResponsiveHotelSearchBar 
            callingFrom="home" 
            onSearch={handleSearch} 
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

// CHANGES MADE:
// 1. Replaced: import HotelSearchBar from '../HotelSearchBar/HotelSearchBar';
//    With: import ResponsiveHotelSearchBar from '../HotelSearchBar/ResponsiveHotelSearchBar';
//
// 2. Replaced: <HotelSearchBar callingFrom="home" onSearch={handleSearch} />
//    With: <ResponsiveHotelSearchBar callingFrom="home" onSearch={handleSearch} />
//
// 3. Removed all unused imports and state variables
//
// That's it! The component now automatically shows:
// - Desktop search bar on screens >= 768px
// - Mobile search bar with bottom sheets on screens < 768px
