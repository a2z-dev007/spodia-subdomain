"use client";

import StateDetailCard from "./StateDetailCard";

interface StateDetail {
    state: string;
    tagline: string;
    description: string;
    image: string;
    popularCities: string[];
    bestTimeToVisit: string;
    averageHotelPrice: string;
    topAttractions: string[];
    famousFood: string[];
}

const StatesShowcase = () => {
    const statesData: StateDetail[] = [
        {
            state: "Rajasthan",
            tagline: "Palaces, Deserts & Royal Heritage",
            description: "Rajasthan is known for majestic forts, golden deserts, and regal hospitality. A perfect blend of history and culture.",
            image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=600&fit=crop",
            popularCities: ["Jaipur", "Udaipur", "Jaisalmer", "Jodhpur"],
            bestTimeToVisit: "October to March",
            averageHotelPrice: "₹2500 - ₹15000 per night",
            topAttractions: ["City Palace", "Hawa Mahal", "Lake Pichola", "Jaisalmer Fort"],
            famousFood: ["Dal Baati Churma", "Laal Maas"]
        },
        {
            state: "Goa",
            tagline: "Beaches, Parties & Relaxed Vibes",
            description: "A tropical paradise with golden beaches, Portuguese architecture, and vibrant nightlife.",
            image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop",
            popularCities: ["Panaji", "Calangute", "Vagator", "Candolim"],
            bestTimeToVisit: "November to February",
            averageHotelPrice: "₹1800 - ₹12000 per night",
            topAttractions: ["Baga Beach", "Fort Aguada", "Basilica of Bom Jesus"],
            famousFood: ["Fish Curry Rice", "Prawn Balchao"]
        },
        {
            state: "Kerala",
            tagline: "Backwaters & Green Landscapes",
            description: "Kerala offers serene backwaters, lush hills, ayurvedic wellness, and calm beaches.",
            image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop",
            popularCities: ["Kochi", "Munnar", "Alleppey", "Kovalam"],
            bestTimeToVisit: "September to March",
            averageHotelPrice: "₹2000 - ₹15000 per night",
            topAttractions: ["Alleppey Houseboats", "Munnar Tea Gardens"],
            famousFood: ["Appam with Stew", "Kerala Sadya"]
        },
        {
            state: "Himachal Pradesh",
            tagline: "Mountains, Valleys & Adventure",
            description: "A scenic mountain escape with snow peaks, peaceful valleys, and adventure sports.",
            image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop",
            popularCities: ["Shimla", "Manali", "Dharamshala", "Kasol"],
            bestTimeToVisit: "March to June & December to February (snow season)",
            averageHotelPrice: "₹1500 - ₹10000 per night",
            topAttractions: ["Rohtang Pass", "Mall Road", "Triund Trek"],
            famousFood: ["Siddu", "Chana Madra"]
        },
        {
            state: "Uttar Pradesh",
            tagline: "History, Spirituality & Heritage",
            description: "Home to iconic monuments and spiritual landmarks, from the Taj Mahal to holy ghats.",
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop",
            popularCities: ["Agra", "Varanasi", "Lucknow", "Mathura"],
            bestTimeToVisit: "October to March",
            averageHotelPrice: "₹1200 - ₹10000 per night",
            topAttractions: ["Taj Mahal", "Varanasi Ghats", "Bara Imambara"],
            famousFood: ["Tunday Kebab", "Kachori Sabzi"]
        },
        {
            state: "Maharashtra",
            tagline: "Modern Cities & Cultural Mix",
            description: "From bustling Mumbai to hill stations like Lonavala, Maharashtra has something for every traveler.",
            image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800&h=600&fit=crop",
            popularCities: ["Mumbai", "Pune", "Lonavala", "Nashik"],
            bestTimeToVisit: "October to February",
            averageHotelPrice: "₹2000 - ₹20000 per night",
            topAttractions: ["Gateway of India", "Marine Drive", "Ajanta & Ellora Caves"],
            famousFood: ["Vada Pav", "Misal Pav"]
        },
        {
            state: "Tamil Nadu",
            tagline: "Temples, Beaches & Culture",
            description: "A beautiful mix of heritage temples, serene beaches, and classical art traditions.",
            image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop",
            popularCities: ["Chennai", "Madurai", "Kodaikanal", "Ooty"],
            bestTimeToVisit: "November to March",
            averageHotelPrice: "₹1500 - ₹15000 per night",
            topAttractions: ["Meenakshi Temple", "Marina Beach", "Ooty Gardens"],
            famousFood: ["Idli Sambar", "Chettinad Chicken"]
        },
        {
            state: "West Bengal",
            tagline: "Culture, Tea Gardens & Colonial Charm",
            description: "Rich literature, colonial architecture, Darjeeling hills, and artistic soul.",
            image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&h=600&fit=crop",
            popularCities: ["Kolkata", "Darjeeling", "Siliguri", "Digha"],
            bestTimeToVisit: "October to April",
            averageHotelPrice: "₹1600 - ₹12000 per night",
            topAttractions: ["Victoria Memorial", "Darjeeling Himalayan Railway"],
            famousFood: ["Rosogolla", "Macher Jhol"]
        }
    ];

    return (
        <div className="bg-gray-50 py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Discover India's Most Beautiful States
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Explore the diverse landscapes, rich culture, and unforgettable experiences across India
                    </p>
                </div>

                {/* States Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                    {statesData.map((state, index) => (
                        <StateDetailCard key={index} stateData={state} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatesShowcase;
