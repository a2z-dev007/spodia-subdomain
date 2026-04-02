"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getStates } from "@/services/api";
import { useEffect, useState } from "react";

type Props = {
    title?: string;
};

interface State {
    id: number;
    country_name: string;
    country: number;
    name: string;
    description: string;
    file: string | null;
    key_name: string | null;
    created: string;
}

interface StateResponse {
    totalRecords: number;
    status: string;
    records: State[];
}

const PopularStatesSection = ({ title = "Popular Indian States" }: Props) => {
    const [randomStates, setRandomStates] = useState<State[]>([]);
    const defaultImage = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";

    // Fetch states for India (country_id = 1)
    const { data: statesData, isLoading } = useQuery<StateResponse>({
        queryKey: ["states", 1],
        queryFn: async () => {
            const response = await getStates(1);
            return response.data;
        },
    });

    const displayStates = [
        "Rajasthan",
        "Goa",
        "Kerala",
        "Himachal Pradesh",
        "Uttar Pradesh",
        "Maharashtra",
        "Tamil Nadu",
        "West Bengal"
    ];
    const popularStates = [
        {
            name:"Rajasthan",
            img:"/images/places/rajasthan.jpg"
        },
        {
            name:"Goa",
            img:"/images/places/goa.jpg"
        },
        {
            name:"Kerala",
            img:"/images/places/kerala.jpg"
        },
        {
            name:"Himachal Pradesh",
            img:"/images/places/himachal.jpg"
        },
        {
            name:"Uttar Pradesh",
            img:"/images/places/uttarpradesh.jpg"
        },
        {
            name:"Maharashtra",
            img:"/images/places/mumbai.jpg"
        },
        {
            name:"Tamil Nadu",
            img:"/images/places/tamilnadu.jpg"
        },
        {
            name:"West Bengal",
            img:"/images/places/west-bengal.jpg"
        }
    ]

    // Filter states based on displayStates array
    useEffect(() => {
        if (statesData?.records && statesData.records.length > 0) {
            console.log("All states from API:", statesData.records.map(s => s.name));
            const filtered = statesData.records.filter(state =>
                displayStates.includes(state.name)
            );
            console.log("Filtered states:", filtered.map(s => s.name));
            setRandomStates(filtered);
        }
    }, [statesData]);

    return (
        <section className="popular-states-section py-12">
            <div className="bg-white py-8 px-6 rounded-[20px] border-storke">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-gray-800 text-2xl font-semibold">{title}</h2>
                    </div>

                    {/* States Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoading ? (
                            // Loading skeleton
                            Array(8).fill(0).map((_, index) => (
                                <div key={index} className="bg-white rounded-20 border-storke overflow-hidden">
                                    <div className="h-32 bg-gray-200 animate-pulse"></div>
                                </div>
                            ))
                        ) : randomStates.length > 0 ? (
                            randomStates.map((state) => (
                                <div
                                    key={state.id}
                                    className="bg-white rounded-20 border-storke overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                                >
                                    {/* State Image */}
                                    <div className="relative h-32 w-full overflow-hidden">
                                        <Image
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                            alt={state.name}
                                            width={300}
                                            height={200}
                                            src={state.file || defaultImage}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <h3 className="font-bold text-white text-lg">{state.name}</h3>
                                            <p className="text-white/80 text-xs line-clamp-1">
                                                {state.description || `Discover the beauty of ${state.name}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // No data fallback
                            <div className="col-span-full text-center py-8 text-gray-500">
                                No states available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PopularStatesSection;
