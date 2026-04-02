// components/contact/WhyContactSpodia.tsx
import React from "react";
import { Clock, Headphones, Globe2 } from "lucide-react";

const WhyContactSpodia = () => {
    const features = [
        {
            title: "Quick Response Time",
            description:
                "Our team is committed to getting back to you within hours, not days.",
            icon: <Clock className="w-6 h-6 text-orange-500" />,
        },
        {
            title: "Dedicated Support",
            description:
                "Real people. Real help. No bots just passionate humans ready to assist.",
            icon: <Headphones className="w-6 h-6 text-orange-500" />,
        },
        {
            title: "Travel Experts",
            description:
                "We know travel inside out and we'll guide you through every step.",
            icon: <Globe2 className="w-6 h-6 text-orange-500" />,
        },
    ];

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 py-5">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:text-[40px]">
                        Why Contact Spodia
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed md:text-[18px]">
                        We’re not just here to answer queries. We’re here to make your travel
                        stress-free, secure, and unforgettable. Our support is fast, friendly,
                        and focused on you.
                    </p>
                </div>
            </div>
            <section className=" max-w-7xl mx-auto px-4 py-5 bg-gray-100 rounded-xl mb-10">

                {/* Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ">
                    {/* Left: Image */}
                    <div className="rounded-2xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=800&q=80"
                            alt="Support representative"
                            className="w-full h-[380px] object-cover"
                        />
                    </div>
                    {/* Right: Features in Department Style */}
                    <div className="flex flex-col gap-5">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex flex-col sm:flex-row sm:items-start items-center text-center sm:text-left gap-4 sm:gap-6 py-7 bg-white border border-gray-100 rounded-2xl shadow-sm p-5"
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 shrink-0 mb-3 sm:mb-0">
                                    {feature.icon}
                                </div>

                                {/* Text */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1 md:text-[22px]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed md:text-[18px]">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </section>
        </>

    );
};

export default WhyContactSpodia;