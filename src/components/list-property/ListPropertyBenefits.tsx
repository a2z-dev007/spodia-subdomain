import { Users, Building2, BarChart3, Smartphone } from "lucide-react"
import Image from "next/image"

const ListPropertyBenefits = () => {
  const benefits = [
    {
      icon: "/images/listing/assistant.svg",
      title: "24/7 Multilingual Assistance",
      description: "Get round-the-clock support in 30+ languages, making it easy to manage your property from anywhere, anytime.",
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600"
    },
    {
      icon: "/images/listing/all-in-one.svg",
      title: "All-in-One Hotel Service Management",
      description: "From rooms and banquet halls to spas and restaurants — manage every service your property offers in one unified platform.",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      icon: "/images/listing/smart-data.svg",
      title: "Smart Data Insights",
      description: "Gain a deeper understanding of customer behavior with advanced analytics to boost performance and strategy.",
      bgColor: "bg-teal-100",
      iconColor: "text-teal-600"
    },
    {
      icon: "/images/listing/controls.svg",
      title: "First Control",
      description: "Stay in control of bookings, messages, and rates on the go with Spodia's mobile dashboard.",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Spodia?</h2>
          <p className="text-lg subheading-color max-w-2xl mx-auto leading-relaxed">
            We’re not just here to answer queries. We’re here to make your travel stress-free, secure, and unforgettable. Our support is fast, friendly, and focused on you.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start bg-[#FAFAFA] px-6 py-7 rounded-2xl ">
          {/* Left Column - Benefits List */}
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-5 bg-white p-5 rounded-2xl border-stroke-opacity">
                {/* Icon Container */}
                <Image src={benefit.icon} alt={benefit.title} width={68} height={68} className="" />

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">{benefit.title}</h3>
                  <p className="subheading-color text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Image */}
          <div className="lg:pl-6">
            <div className="relative">
              <img
                src="/images/listing/why-spodia.svg"
                alt="Customer support team at work"
                className="w-full h-auto rounded-2xl shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ListPropertyBenefits