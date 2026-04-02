import { ArrowRight, PhoneCall } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const TrustSection = () => {
  const features = [
    {
      img: "/security.png",
      title: "Security Assurance",
      description: "Demonstrates commitment to user data security through encryption and secure payment practices",
      href:"/privacy-policy",
      link: "Learn More",
    },
    {
      img: "/support.png",
      title: "Customer Support",
      description: "Demonstrates commitment to user data security through encryption and secure payment practices",
      link: "Learn More",
      href:"/customer-support"
    },
    {
      img: "/policy.png",
      title: "Transparent Policies",
      description: "Demonstrates commitment to user data security through encryption and secure payment practices",
      link: "Learn More",
      href:"/booking-policy"
    },
    {
      img: "/repu.png",
      title: "Reputable Affiliations",
      description: "Demonstrates commitment to user data security through encryption and secure payment practices",
      link: "Learn More",
      href:"/investor-relations"
    },
  ]

  return (
    <section className="py-4 bg-white">
      <div className="max-w-7xl mx-auto md:px-8 lg:px-8 sm:px-6 px-4">
        <div className="relative flex flex-col lg:flex-row items-center justify-center min-h-[600px]">
          {/* Left features */}
          <div className="flex flex-col gap-10 md:gap-16 lg:gap-24 flex-1 items-center lg:items-end z-10 w-full lg:w-auto mb-8 lg:mb-0">
            {features.slice(0,2).map((feature, index) => (
              <div key={index} className="flex  gap-4 rounded-2xl  p-4 md:p-6 w-full max-w-xs md:max-w-sm">
                <div className="flex-shrink-0 w-16 h-16 md:w-14 md:h-14 bg-white shadow-lg rounded-xl flex items-center justify-center">
                  <Image src={feature.img} alt={feature.title} width={30} height={30} />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1">{feature.title}</h3>
                  <p className="footer-text-color-bold mb-2 text-xs md:text-sm">{feature.description}</p>
                  <Link
                  href={feature.href}
                   className="text-[#078ED8] hover:text-[#0679b8] font-medium text-xs md:text-sm flex items-center gap-1">{feature.link} <span>
                    <ArrowRight className="w-4 h-4" />
                    </span></Link>
                </div>
              </div>
            ))}
          </div>

          {/* Center man image and phone */}
          <div className="relative flex-1 flex flex-col items-center justify-center min-w-[220px] md:min-w-[340px] mb-8 lg:mb-0">
            {/* Dashed path SVG - hide on small screens */}
            <svg className="hidden lg:block absolute left-0 right-0 top-0 bottom-0 w-full h-full z-0" viewBox="0 0 900 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M50 100 Q 200 300 450 300 Q 700 300 850 500" stroke="#D1D5DB" strokeWidth="3" strokeDasharray="10 10" fill="none" />
            </svg>
            <div className="relative z-10 flex flex-col items-center">
              <Image src="/man.png" alt="Happy traveler" width={220} height={270} className="object-contain w-[180px] h-[220px] md:w-[260px] md:h-[320px] lg:w-[340px] lg:h-[420px]" priority />
              {/* Phone number overlay */}
              <div className="absolute w-[max-content] left-1/2 bottom-2 md:bottom-6 transform -translate-x-1/2">
                <div className="bg-white/90 backdrop-blur-sm w-full px-4 py-2 md:px-4 md:py-3 rounded-full shadow-lg flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#FF9530]" />
                  <span className="text-[#FF9530] font-bold text-base md:text-lg">+918800842084</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right features */}
          <div className="flex flex-col gap-10 md:gap-16 lg:gap-24 flex-1 items-center lg:items-start z-10 w-full lg:w-auto">
            {features.slice(2).map((feature, index) => (
              <div key={index} className="flex gap-4  rounded-2xl  p-4 md:p-6 w-full max-w-xs md:max-w-sm">
               
                <div>
                  <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1">{feature.title}</h3>
                  <p className="footer-text-color-bold mb-2 text-xs md:text-sm">{feature.description}</p>
                  <Link href={feature.href} className="text-[#078ED8] hover:text-[#0679b8] font-medium text-xs md:text-sm flex items-center gap-1">{feature.link} <span>
                    <ArrowRight className="w-4 h-4" />
                    </span></Link>
                </div>
                <div className="flex-shrink-0 w-16 h-16 md:w-14 md:h-14 bg-white shadow-lg rounded-xl flex items-center justify-center">
                  <Image src={feature.img} alt={feature.title} width={30} height={30} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustSection

