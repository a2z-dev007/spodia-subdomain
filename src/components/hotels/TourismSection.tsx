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

const TourismSection = ({ title, cityName }: Props) => {
    const [randomCities, setRandomCities] = useState<City[]>([]);
    const defaultImage = "/placeholder.jpg";

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

    // Select 4 random cities when data is available
    useEffect(() => {
        if (stateCitiesData?.records && stateCitiesData.records.length > 0) {
            const cities = [...stateCitiesData.records];
            const shuffled = cities.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 4);
            setRandomCities(selected);
        }
    }, [stateCitiesData]);
    return (
        <section className="tourism-section py-12 ">
            {/* Tourism Section */}
            <div className="bg-white py-8 px-6 rounded-[20px] border-storke">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-3 h-3 gradient-orange-bg rotate-[135deg]"></div>
                        <h2 className="text-gray-800 text-lg">{title}</h2>
                        <div className="w-3 h-3 rotate-[135deg] gradient-orange-bg"></div>
                        <div className="w-3 h-3  rotate-[135deg] gradient-orange-bg ml-1 "></div>
                        <div
                            className="w-[130px] h-1  bg-gradient-to-r from-orange-300 via-orange-50 to-white ml-1 "></div>
                    </div>

                    {/* Tourism Cards */}
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 bg-[#FFF8ED] py-8 px-6 rounded-[20px]  border border-[#FFDAA8]">
                        {randomCities.length > 0 ? (
                            randomCities.map((city) => (
                                <div key={city.id} className="text-center">
                                    <div
                                        className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-4 border-orange-200">
                                        <Image
                                            src={city.file || defaultImage}
                                            alt={`${city.name} Tourism`}
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-gray-800 mb-2">{city.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                        {city.description
                                            ? city.description
                                            : `Explore the beauty and culture of ${city.name}`}
                                    </p>
                                </div>
                            ))
                        ) : (
                            // Fallback skeleton or placeholder
                            Array(4).fill(0).map((_, index) => (
                                <div key={index} className="text-center">
                                    <div
                                        className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-4 border-orange-200 bg-gray-200 animate-pulse">
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            ))
                        )}
                    </div>


                </div>
            </div>
        </section>
    );
};

export default TourismSection;