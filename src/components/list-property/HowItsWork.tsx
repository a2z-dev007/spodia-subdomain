import React from 'react'
import StepCard from './StepCard'

const HowItsWork = () => {
    const data = [
        {
            title: "Create Your Account",
            description: "Sign up for free and complete your profile in just a few minutes.",
            icon: "/images/listing/login-security.svg",
            step: "Step 1"
        },
        {
            title: "Share Your Property",
            description: "Upload photos, add details, and let our experts help optimize your listing.",
            icon: "/images/listing/businessman-signing-new-home-contract.svg",
            step: "Step 2"
        },
        {
            title: "Get Your Terms",
            description: "We'll help you set the right price and terms for a quick sale.",
            icon: "/images/listing/real-estate-business-investment.svg",
            step: "Step 3"
        },
        {
            title: "Go Live & Get Seen",
            description: "Your property goes live and starts attracting qualified buyers immediately.",
            icon: "/images/listing/house-price-increasing-day-by-day.svg",
            step: "Step 4"
        }
    ]
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        With Spodia, selling your property is easy and transparent. Just list your details, get verified, connect with genuine buyers, and close the deal all in one platform.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {
                        data.map((item) => (
                            <StepCard
                                step={item.step}
                                title={item.title}
                                description={item.description}
                                image={item.icon}
                            />
                        ))
                    }
                </div>
            </div>
        </section>

    )
}

export default HowItsWork
