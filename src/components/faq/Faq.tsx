"use client"

import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { getFAQsByCategory } from "@/services/api"

type Props={
    data?:any,
    title?:string,
    subTitle?:string
    subTitle2?:string,
    type?:string
    categoryId?: number
}

interface FAQ {
    id: number
    question: string
    answer: string
}

const FAQ = ({
    data,
    type="listing",
    title="FAQ",
    subTitle2="Our support is fast and focused on you.",
    subTitle="We're here to make your travel stress-free and unforgettable.",
    categoryId = 3
}:Props) => {
    const [openItem, setOpenItem] = useState<number | null>(null)
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                setLoading(true)
                const response = await getFAQsByCategory(categoryId)
                const data = response.data
                
                if (data.status === "success" && data.records) {
                    setFaqs(data.records)
                } else {
                    setFaqs([])
                }
            } catch (err) {
                console.error("Error fetching FAQs:", err)
                setError("Failed to load FAQs")
            } finally {
                setLoading(false)
            }
        }

        fetchFAQs()
    }, [categoryId])

    const toggleItem = (index: number) => {
        setOpenItem(prev => prev === index ? null : index)
    }

    return (
        <section className="py-16 ">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                
                    <h2 className="text-2xl heading-text font-bold text-gray-900 mb-6">{title}</h2>
                    <div className="max-w-2xl mx-auto">
                        <p className="subheading-color  px-4 py-2 rounded-xl ">
                           {subTitle} {subTitle2}
                        </p>
                        <p className="subheading-color">
                             
                        </p>
                    </div>
                </div>

               
                

                {/* Loading State */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-100 rounded-lg h-16 animate-pulse"></div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-8">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* No FAQs */}
                {!loading && !error && faqs.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No FAQs available at the moment.</p>
                    </div>
                )}

                {/* FAQs List */}
                {!loading && !error && faqs.length > 0 && (
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={faq.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => toggleItem(index)}
                                    className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors ${openItem === index
                                        ? 'text-white gradient-orange-bg'
                                        : 'text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    <h3 className="font-medium text-lg">{faq.question}</h3>
                                    {openItem === index ? (
                                        <X className="w-5 h-5" />
                                    ) : (
                                        <Plus className="w-5 h-5 text-gray-600" />
                                    )}
                                </button>
                                {openItem === index && (
                                    <div className="px-6 pb-4 gradient-orange-bg text-white">
                                        <p className="leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default FAQ
