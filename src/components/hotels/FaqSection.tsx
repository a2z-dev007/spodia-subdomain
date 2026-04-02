"use client"

import {useState} from "react"
import {Plus, X} from "lucide-react"

type Props = {
    data?: any,
    title?: string,
    subTitle?: string
    subTitle2?: string,
    type?: string
}
const FaqSection = ({
                        data,
                        type = "listing",
                        title = "FAQ",
                        subTitle2 = "Our support is fast and focused on you.",
                        subTitle = "We’re here to make your travel stress-free and unforgettable."
                    }: Props) => {
    const [openItem, setOpenItem] = useState<number | null>(1) // Second item open by default

    const faqs = [
        {
            id: "item-1",
            question: "Where are your offices located?",
            answer: "Our offices are located in major cities across India including Delhi, Mumbai, Bangalore, and Chennai. You can find detailed addresses on our contact page."
        },
        {
            id: "item-2",
            question: "How do I contact Spodla support?",
            answer: "You can reach our support team through our Contact Us page, by emailing care@spodla.com"
        },
        {
            id: "item-3",
            question: "Can I modify or cancel my booking?",
            answer: "Yes, you can modify or cancel your booking up to 24 hours before your travel date. Cancellation charges may apply based on our terms and conditions."
        },
        {
            id: "item-4",
            question: "Are there any cancellation fees?",
            answer: "Cancellation fees vary depending on the timing of your cancellation and the type of booking. Please refer to our cancellation policy for detailed information."
        },
        {
            id: "item-5",
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, debit cards, net banking, UPI, and digital wallets including Paytm, PhonePe, and Google Pay."
        },
        {
            id: "item-6",
            question: "How can I get a refund?",
            answer: "Refunds are processed according to our refund policy. Eligible refunds are typically processed within 7-10 business days to your original payment method."
        },
        {
            id: "item-7",
            question: "Do you offer travel insurance?",
            answer: "Yes, we offer comprehensive travel insurance options to protect your trip against unforeseen circumstances. You can add insurance during the booking process."
        },
        {
            id: "item-8",
            question: "What documents do I need for travel?",
            answer: "Required documents vary by destination. Generally, you'll need a valid passport, visa (if required), and any health certificates. Check specific requirements for your destination."
        },
        {
            id: "item-9",
            question: "Can I book for someone else?",
            answer: "Yes, you can book travel for family members or friends. You'll need to provide their accurate personal details and ensure they have the required documents."
        },
        {
            id: "item-10",
            question: "How do I check my booking status?",
            answer: "You can check your booking status by logging into your account or using the 'Manage Booking' option with your booking reference number."
        },
        {
            id: "item-11",
            question: "What if my flight is delayed or cancelled?",
            answer: "In case of flight delays or cancellations, our support team will assist you with rebooking or refund options. We'll also help you claim compensation if eligible."
        },
        {
            id: "item-12",
            question: "Do you offer group discounts?",
            answer: "Yes, we offer special discounts for group bookings of 10 or more passengers. Contact our group booking team for customized packages and pricing."
        },
        {
            id: "item-13",
            question: "How early should I arrive at the airport?",
            answer: "We recommend arriving 2 hours early for domestic flights and 3 hours early for international flights. Check with your airline for specific requirements."
        },
        {
            id: "item-14",
            question: "Can I select my seat?",
            answer: "Yes, seat selection is available during booking or through the manage booking option. Some airlines may charge extra for preferred seating."
        },
        {
            id: "item-15",
            question: "What is your customer service number?",
            answer: "Our 24/7 customer service number is 1800-XXX-XXXX. You can also reach us through WhatsApp, email, or live chat on our website."
        },
        {
            id: "item-16",
            question: "Do you offer holiday packages?",
            answer: "Yes, we offer comprehensive holiday packages including flights, hotels, transfers, and sightseeing. Browse our packages section for exciting deals."
        },
        {
            id: "item-17",
            question: "How do I apply a promo code?",
            answer: "You can apply promo codes during the payment process. Enter your code in the 'Promo Code' field and click apply to see the discount reflected in your total."
        },
        {
            id: "item-18",
            question: "What happens if I miss my flight?",
            answer: "If you miss your flight, contact our support team immediately. We'll help you with rebooking options, though additional charges may apply depending on your ticket type."
        },
        {
            id: "item-19",
            question: "Are there any age restrictions for travel?",
            answer: "Age restrictions vary by airline and destination. Unaccompanied minors may require special arrangements. Contact us for specific requirements for your travel plans."
        },
        {
            id: "item-20",
            question: "How do I download my e-ticket?",
            answer: "After successful booking, your e-ticket will be sent to your registered email. You can also download it from the 'My Bookings' section in your account."
        }
    ];


    const toggleItem = (index: number) => {
        setOpenItem(prev => prev === index ? null : index)
    }

    return (
        <section className=" py-16 bg-white rounded-2xl border-storke">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center md:mb-12 mb-8">

                    <h2 className="md:text-2xl text-xl  font-bold text-gray-900 mb-6">{title}</h2>

                </div>


                <div className="space-y-4 h-[50vh] overflow-y-auto px-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300">
                            <button
                                onClick={() => toggleItem(index)}
                                className={`w-full px-6 py-4 text-left flex items-center justify-between transition-all duration-300 ease-in-out ${openItem === index
                                    ? 'text-white gradient-orange-bg'
                                    : 'text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <h3 className="font-medium text-sm md:text-base pr-4">{faq.question}</h3>
                                <div className={`flex-shrink-0 transition-transform duration-300 ease-in-out ${openItem === index ? 'rotate-45' : 'rotate-0'}`}>
                                    <Plus className={`w-5 h-5 transition-colors duration-300 ${openItem === index ? 'text-white' : 'text-gray-600'}`} />
                                </div>
                            </button>
                            <div 
                                className={`grid gradient-orange-bg text-white transition-all duration-300 ease-in-out ${
                                    openItem === index 
                                        ? 'grid-rows-[1fr]' 
                                        : 'grid-rows-[0fr]'
                                }`}
                            >
                                <div className="overflow-hidden">
                                    <div className="px-6 pb-4 pt-2">
                                        <p className="text-sm md:text-base">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FaqSection