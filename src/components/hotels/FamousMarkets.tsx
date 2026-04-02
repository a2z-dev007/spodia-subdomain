import { MapPin, Clock, ShoppingBag } from 'lucide-react';

interface Market {
    name: string;
    specialty: string;
    timing: string;
}

interface CityMarket {
    city: string;
    state: string;
    famousMarkets: Market[];
}

// Market Card Component
function MarketCard({ market, city, state }: { market: Market; city: string; state: string }) {
    return (
        <div className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-orange-300 transition-all duration-300 cursor-pointer hover:-translate-y-1">
            {/* City & State Header */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                    <ShoppingBag className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{city}</h4>
                    <p className="text-xs text-gray-500">{state}</p>
                </div>
            </div>

            {/* Market Name */}
            <h3 className="font-bold text-gray-800 text-base mb-2 group-hover:text-orange-600 transition-colors">
                {market.name}
            </h3>

            {/* Specialty */}
            <div className="flex items-start gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">{market.specialty}</p>
            </div>

            {/* Timing */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500">{market.timing}</p>
            </div>
        </div>
    );
}

// Market Grid Container
function MarketGridContainer() {
    const marketData: CityMarket[] = [
        {
            city: "Jaipur",
            state: "Rajasthan",
            famousMarkets: [
                { name: "Johari Bazaar", specialty: "Jewelry & gemstones", timing: "10 AM - 9 PM" },
                // { name: "Bapu Bazaar", specialty: "Rajasthani handicrafts & textiles", timing: "10 AM - 9 PM" }
            ]
        },
        {
            city: "Udaipur",
            state: "Rajasthan",
            famousMarkets: [
                { name: "Hathi Pol Bazaar", specialty: "Paintings & local art", timing: "9:30 AM - 7 PM" },
                // { name: "Bada Bazaar", specialty: "Traditional clothes & mojris", timing: "10 AM - 8 PM" }
            ]
        },
        {
            city: "Panaji",
            state: "Goa",
            famousMarkets: [
                { name: "Panjim Market", specialty: "Local spices & Goan snacks", timing: "9 AM - 9 PM" },
                // { name: "Mapusa Market", specialty: "Handmade crafts & cashew nuts", timing: "7 AM - 8 PM" }
            ]
        },
        {
            city: "Kochi",
            state: "Kerala",
            famousMarkets: [
                { name: "Broadway Market", specialty: "Spices, fabrics & souvenirs", timing: "10 AM - 9 PM" },
                // { name: "Jew Town Market", specialty: "Antiques & handicrafts", timing: "10 AM - 8 PM" }
            ]
        },
        {
            city: "Shimla",
            state: "Himachal Pradesh",
            famousMarkets: [
                { name: "The Mall Road", specialty: "Local woolens & cafes", timing: "9 AM - 10 PM" },
                // { name: "Lakkar Bazaar", specialty: "Wooden crafts & souvenirs", timing: "9 AM - 8 PM" }
            ]
        },
        {
            city: "Agra",
            state: "Uttar Pradesh",
            famousMarkets: [
                { name: "Sadar Bazaar", specialty: "Leather goods & marble crafts", timing: "11 AM - 11 PM" },
                // { name: "Kinari Bazaar", specialty: "Wedding wear & traditional accessories", timing: "12 PM - 8 PM" }
            ]
        },
        {
            city: "Mumbai",
            state: "Maharashtra",
            famousMarkets: [
                { name: "Colaba Causeway", specialty: "Accessories & street fashion", timing: "9 AM - 10 PM" },
                // { name: "Crawford Market", specialty: "Wholesale goods & spices", timing: "11 AM - 8 PM" }
            ]
        },
        {
            city: "Chennai",
            state: "Tamil Nadu",
            famousMarkets: [
                { name: "T. Nagar Market", specialty: "Sarees & gold jewelry", timing: "10 AM - 9 PM" },
                // { name: "George Town Market", specialty: "Spices, textiles & electronics", timing: "10 AM - 8 PM" }
            ]
        },
        // {
        //     city: "Kolkata",
        //     state: "West Bengal",
        //     famousMarkets: [
        //         { name: "New Market (Hogg Market)", specialty: "Clothing & accessories", timing: "10 AM - 8:30 PM" },
        //         // { name:z "Gariahat Market", specialty: "Sarees & home décor", timing: "10 AM - 9 PM" }
        //     ]
        // }
    ];

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
                {marketData?.map((cityMarket, cityIndex) => (
                    cityMarket.famousMarkets.map((market, marketIndex) => (
                        <MarketCard
                            key={`${cityIndex}-${marketIndex}`}
                            market={market}
                            city={cityMarket.city}
                            state={cityMarket.state}
                        />
                    ))
                ))}
            </div>
        </div>
    );
}

export function FamousMarkets() {
    return (
        <div className="bg-white relative rounded-[20px] w-full">
            <div aria-hidden="true"
                className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[20px]" />
            <div className="flex flex-col items-center relative w-full">
                <div className="box-border flex flex-col gap-4 md:gap-12 items-center justify-start p-6 md:p-10 relative w-full">
                    {/* Header */}
                    <div className="flex flex-col items-center gap-2 w-full">
                        <h2 className="font-bold text-2xl md:text-3xl text-center text-gray-900">
                            Famous Markets in Popular Cities
                        </h2>
                        <p className="text-sm md:text-base text-gray-600 text-center max-w-2xl">
                            Discover the best shopping destinations across India's most vibrant cities
                        </p>
                    </div>

                    {/* Market Grid */}
                    <MarketGridContainer />
                </div>
            </div>
        </div>
    );
}