"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQSectionClientProps {
  initialFaqs: FAQ[];
  initialError: string | null;
  title?: string;
  subTitle?: string;
  subTitle2?: string;
}

const FAQSectionClient = ({
  initialFaqs,
  initialError,
  title = "Frequently Asked Questions",
  subTitle = "We're here to make your travel stress-free and unforgettable.",
  subTitle2 = "Our support is fast and focused on you."
}: FAQSectionClientProps) => {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenItem(prev => prev === index ? null : index)
  }

  // Error state
  if (initialError) {
    return (
      <section className="py-16 bg-white rounded-2xl border border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="md:text-2xl text-xl font-bold text-gray-900 capitalize mb-2">{title}</h2>
            <p className="text-sm text-red-600">Failed to load FAQs. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  // No FAQs available
  if (initialFaqs.length === 0) {
    return (
      <section className="py-16 bg-white rounded-2xl border border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="md:text-2xl text-xl font-bold text-gray-900 mb-2 capitalize">{title}</h2>
            <p className="text-sm text-gray-600">No FAQs available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white rounded-2xl border border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center md:mb-12 mb-8">
          <h2 className="md:text-2xl text-xl font-bold text-gray-900 mb-2 capitalize">{title}</h2>
          {subTitle && <p className="text-sm text-gray-600 mb-1">{subTitle}</p>}
          {subTitle2 && <p className="text-sm text-gray-600">{subTitle2}</p>}
        </div>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto px-4">
          {initialFaqs.map((faq, index) => (
            <div key={faq.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggleItem(index)}
                className={`w-full px-6 py-4 text-left flex items-center justify-between transition-all duration-300 ease-in-out ${
                  openItem === index
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

export default FAQSectionClient
