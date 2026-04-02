"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { searchCityByName, getCitiesByStateId } from "@/services/api";
import { useEffect, useState } from "react";

type Props = {
    title?: string;
    cityName?: string;
};

interface City {
    id: number;
    country_name: string;
    country: number;
    state_name: string;
    state: number;
    name: string;
    description: string;
    file: string | null;
    key_name: string | null;
    created: string;
}

interface CityResponse {
    totalRecords: number;
    status: string;
    records: City[];
}

const FamousMarketsSection = ({ title = "Famous Markets in Popular Cities", cityName }: Props) => {
    const [randomCities, setRandomCities] = useState<City[]>([]);
    const defaultImage = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";

    // Fetch city by name to get state_id
    const { data: cityData } = useQuery<CityResponse>({
        queryKey: ["cityByName", cityName],
        queryFn: async () => {
            if (!cityName) return { totalRecords: 0, status: "success", records: [] };
            const response = await searchCityByName(cityName);
            return response.data;
        },
        enabled: !!cityName,
    });

    // Get state_id from the city result
    const stateId = cityData?.records?.[0]?.state;

    // Fetch all cities in the same state
    const { data: stateCitiesData } = useQuery<CityResponse>({
        queryKey: ["stateCities", stateId],
        queryFn: async () => {
            if (!stateId) return { totalRecords: 0, status: "success", records: [] };
            const response = await getCitiesByStateId(stateId);
            return response.data;
        },
        enabled: !!stateId,
    });

    // Select random cities when data is available
    useEffect(() => {
        if (stateCitiesData?.records && stateCitiesData.records.length > 0) {
            const cities = [...stateCitiesData.records];
            const shuffled = cities.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 12);
            setRandomCities(selected);
        }
    }, [stateCitiesData]);

    return (
        <section className="famous-markets-section py-12">
            <div className="bg-white py-8 px-6 rounded-[20px] border-storke">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-gray-800 text-2xl font-semibold">{title}</h2>
                    </div>

                    {/* Markets Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {randomCities.length > 0 ? (
                            randomCities.map((city) => (
                                <div 
                                    key={city.id} 
                                    className="text-center hover:scale-105 transition-transform cursor-pointer"
                                >
                                    <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden border-2 border-orange-200">
                                        <Image
                                            src={city.file || defaultImage}
                                            alt={`${city.name} Market`}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-gray-800 text-sm font-medium">{city.name}</h3>
                                    <p className="text-gray-500 text-xs">Best for Markets</p>
                                </div>
                            ))
                        ) : (
                            // Fallback skeleton
                            Array(12).fill(0).map((_, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gray-200 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-1 animate-pulse"></div>
                                    <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FamousMarketsSection;
