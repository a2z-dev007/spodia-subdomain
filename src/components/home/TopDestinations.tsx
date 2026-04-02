import Image from "next/image";
import { IoFlag } from "react-icons/io5";
import { IoArrowForward } from "react-icons/io5";
import Link from "next/link";

const destinations = [
  {
    name: "Agra",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1591018653367-9c01498b3320?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Taj Mahal
    tours: 356,
  },
  {
    name: "Mumbai",
    country: "India",
    image:
      "https://plus.unsplash.com/premium_photo-1661962392861-c3cb1cf6dd82?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Marine Drive
    tours: 356,
  },
  {
    name: "Darjeeling",
    country: "India",
    image:
      "https://plus.unsplash.com/premium_photo-1697730350129-de0e9f2b1e82?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Tea gardens
    tours: 356,
  },
  {
    name: "Chennai",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Marina Beach
    tours: 356,
  },
  {
    name: "Lucknow",
    country: "India",
    image:
      "https://plus.unsplash.com/premium_photo-1697730410005-1d916de26345?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Bara Imambara
    tours: 356,
  },
  {
    name: "Shillong",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1623751814896-dc6f8d237165?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Hills and greens
    tours: 356,
  },
  {
    name: "Noida",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1592394675778-4239b838fb2c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Urban skyline
    tours: 356,
  },
  {
    name: "Guwahati",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1594803205835-d121cb46e518?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // River Brahmaputra
    tours: 360,
  },
];

const TopDestinations = () => {
  return (
    <section className="  pb-16  pt-14 bg-white">
      <div className="max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4">
        <div className="text-center mb-10 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Top Searched Destinations
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
            Favorite destinations of professional tourists
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {destinations.map((destination, index) => (
            <Link
              target="_blank"
              href={`/in/hotels/${encodeURIComponent(destination?.name?.toLowerCase())}/hotels`}
              key={index}
              className="flex items-center bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-3 sm:px-6 sm:py-4 space-x-2 sm:space-x-4 hover:shadow-md transition-all duration-300 cursor-pointer group"
            >
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-inner">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs sm:text-lg text-gray-900 truncate group-hover:text-orange-500 transition-colors">
                  {destination.name}
                </h3>
              </div>
              <div className="bg-gray-50 rounded-full p-1.5 sm:p-2 group-hover:bg-orange-500 group-hover:text-white transition-all hidden sm:block">
                <IoArrowForward className="w-3 h-3 sm:w-5 sm:h-5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDestinations;
