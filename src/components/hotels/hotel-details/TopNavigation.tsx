import {useState} from "react";

interface TopNavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function TopNavigation({activeTab, onTabChange}: TopNavigationProps) {
    const tabs = [
        {id: "everyone", label: "Everyone"},
        {id: "couple", label: "Couple"},
        {id: "family", label: "Family"},
        {id: "group", label: "Group"},
        {id: "solo", label: "Solo"},
        {id: "business", label: "Business"}
    ];

    return (
        <div className="bg-white ">
            <div className="">
                <h1 className="text-lg font-bold mb-4">User Rating & Reviews</h1>
                {/* <div className="flex flex-wrap gap-8 border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`pb-3 px-1 text-sm transition-colors ${
                                activeTab === tab.id
                                    ? "border-b-2 border-orange-400 text-black font-bold"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div> */}
            </div>
        </div>
    );
}