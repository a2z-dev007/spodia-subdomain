import React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '../ui/card'

const cardData = [
    {
        icon: <Image src="/images/listing/onboarding.svg" alt="Onboarding Icon" width={80} height={80} />,
        title: "Instant Digital Onboarding",
        description: "Get started in minutes with a smooth, guided setup experience.",
    },
    {
        icon: <Image src="/images/listing/pricing.svg" alt="Pricing Icon" width={80} height={80} />,
        title: "Complete Control Over Pricing & Stock",
        description: "Update rates and inventory instantly — any time, anywhere.",
    },
    {
        icon: <Image src="/images/listing/insights.svg" alt="Insights Icon" width={80} height={80} />,
        title: "Real-Time Insights for Smarter Decisions",
        description: "Track trends, monitor performance, and act with confidence.",
    },
    {
        icon: <Image src="/images/listing/offers.svg" alt="Offers Icon" width={80} height={80} />,
        title: "Targeted Promotions & Special Offers",
        description: "Engage customers with customized deals that convert.",
    },
    {
        icon: <Image src="/images/listing/rating.svg" alt="Rating Icon" width={80} height={80} />,
        title: "Boost Reputation with Reviews & Ratings",
        description: "Collect feedback, showcase your best reviews, and build trust.",
    },
]

const Empower = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* --- HEADER SECTION --- */}
                <div className="mb-16">
                    <div className="text-orange-500 text-sm font-medium mb-2">Features</div>
                    {/* CHANGE 1: Stack header on mobile, row on medium screens and up */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 max-w-md">
                            Empower & Expand Your Business with Spodia
                        </h2>
                        {/* CHANGE 2: Align text based on screen size */}
                        <p className="text-gray-600 w-full md:max-w-sm text-left md:text-right">
                            Everything you need to manage, optimize, and grow — all in one intuitive platform.
                        </p>
                    </div>
                </div>

                {/* --- GRID SECTION --- */}
                <div className=" flex justify-center   gap-8 md:px-16 flex-wrap">
                    {cardData?.map((card, idx) => (
                        <Card
                            key={idx}
                            // CHANGE 3: Removed fixed width (w-72) to allow responsiveness
                            className="p-8 hover:shadow-xl w-[280px] border transition-shadow rounded-2xl shadow-sm flex flex-col items-center"
                        >
                            <CardContent className="p-0 text-center flex flex-col items-center">
                                {/* CHANGE 4: Responsive icon size */}
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center mb-6">
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{card.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Empower