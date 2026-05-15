import React from "react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";
import { 
  Leaf, Heart, Trophy, MapPin, CheckCircle2, ChevronDown, 
  CalendarDays, Star, Banknote
} from "lucide-react";

// Mock data based on the provided prompt structure
const propertyData = {
  name: "The Nandan",
  type: "Hotel", // 'Hotel', 'Resort', 'Homestay', 'B&B'
  location: "Guwahati",
  established: "1995",
  story: "boutique hospitality venture with a vision to blend modern comfort with traditional warmth",
  uniqueOffering: "a seamless blend of luxury and local heritage",
  values: [
    { id: 1, title: "Sustainability", icon: <Leaf className="w-6 h-6 text-[#F97316]" strokeWidth={1.5} />, description: "Zero-Waste Practices · Solar-Powered · Local Sourcing." },
    { id: 2, title: "Community", icon: <Heart className="w-6 h-6 text-[#F97316]" strokeWidth={1.5} />, description: "Supporting Local Artisans · Cultural Workshops." },
    { id: 3, title: "Excellence", icon: <Trophy className="w-6 h-6 text-[#F97316]" strokeWidth={1.5} />, description: "TripAdvisor Excellence Award Winner · 100% Guest Satisfaction." }
  ],
  accommodations: {
    hotel: "Luxury Rooms · Suites · Private Villas",
    homestay: "Cozy Rooms · Shared Common Areas · Garden Access"
  },
  amenities: ["Free WiFi", "Parking", "Air Conditioning", "Spa", "Pool", "Restaurant", "Event Spaces", "Airport Transfers"],
  experiences: {
    resort: "Guided Nature Walks · Cooking Classes · Yoga Retreats",
    homestay: "Homemade Breakfast · Cultural Tours · Farm Activities"
  },
  team: [
    { id: 1, name: "Rajesh Sharma", role: "General Manager", bio: "20+ years of luxury hospitality experience." },
    { id: 2, name: "Anita Desai", role: "Head Chef", bio: "Crafting local flavors with a modern twist." }
  ],
  certifications: ["Eco-Tourism Certified", "Green Key Award"],
  awards: ["Best Boutique Hotel 2023", "Travelers' Choice Winner"],
  reviews: [
    { id: 1, quote: "An absolute oasis in the city. The service was impeccable!", author: "Sarah Jenkins", location: "London, UK" },
    { id: 2, quote: "Loved the sustainable practices and the amazing local food.", author: "Rahul Verma", location: "Delhi, IN" }
  ],
  localGems: [
    { name: "Kamakhya Temple", distance: "4.5 km" },
    { name: "Brahmaputra River Cruise", distance: "2.0 km" },
    { name: "Assam State Museum", distance: "1.2 km" }
  ],
  partners: ["Assam Tourism Certified Partner", "Green Earth Farms"],
  faqs: [
    { q: "What time is check-in/check-out?", a: "Check-in is from 2:00 PM, and check-out is until 11:00 AM." },
    { q: "Do you offer airport transfers?", a: "Yes, we offer seamless airport pickup and drop-off services for our guests." },
    { q: "Are pets allowed?", a: "We have specific pet-friendly rooms available upon request." }
  ]
};

export default function AboutPage({ params }: { params: { entityKey: string } }) {
  // In a real implementation, you would fetch entity-specific data using params.entityKey
  
  const { name, location, type } = propertyData;
  const isHotel = type === "Hotel" || type === "Resort";
  const isHomestay = type === "Homestay" || type === "B&B";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel/LodgingBusiness",
    "name": name,
    "description": `Discover what makes ${name} unique. Explore our history, amenities, and values.`,
    "image": IMAGES.bgSection.src,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location,
      "addressCountry": "India"
    },
    "amenityFeature": propertyData.amenities.map(a => ({
      "@type": "LocationFeatureSpecification",
      "name": a
    }))
  };

  return (
    <div className="flex flex-col font-manrope bg-white w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section */}
      <section className="relative min-h-[500px] h-[80vh] w-full flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <Image
            src={IMAGES.bgSection.src}
            alt="Hotel Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/45"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto text-center px-6 -mt-10 md:-mt-20">
          <h1 className="text-4xl md:text-6xl lg:text-[80px] font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            {isHotel ? (
               <>Welcome to {name} – <br className="hidden md:block" /> Where Luxury Meets {location}'s Charm.</>
            ) : (
               <>Discover {name} – <br className="hidden md:block" /> Your Home Away from Home in {location}.</>
            )}
          </h1>
          <p className="text-[15px] md:text-[18px] lg:text-[20px] text-white/90 max-w-[900px] mx-auto leading-relaxed font-medium">
            Rooted in sustainability, community, and unmatched excellence. Discover the true meaning of hospitality at {name}.
          </p>
        </div>
      </section>

      {/* 2. Our Story */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
        <div className="text-center mb-16">
           <span className="text-[#F97316] text-[13px] font-bold uppercase tracking-[0.15em] block mb-4">OUR JOURNEY</span>
           <h2 className="text-3xl md:text-[44px] font-bold text-gray-900">Our Story</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Always show an image on the left side */}
          <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
             <Image 
               src={isHomestay ? IMAGES.placeholder.src : IMAGES.eventHero.src} 
               alt={isHomestay ? "Owner Family Photo" : "Our History"} 
               fill 
               className="object-cover" 
             />
          </div>
          
          <div className="space-y-16">
            {/* Founder’s Note (For B&Bs/Homestays) */}
            {isHomestay && (
              <div className="space-y-6">
                <div className="inline-block bg-orange-50 text-[#F97316] border border-orange-100 text-[11px] font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
                  Flexible Block: Homestays
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Founder's Note</h3>
                <p className="text-xl text-gray-600 leading-relaxed font-medium italic">
                  "Founded in {propertyData.established}, {name} began as a {propertyData.story}. Today, we welcome guests to experience {propertyData.uniqueOffering}."
                </p>
              </div>
            )}

            {/* History Timeline (For Established Hotels) */}
            {isHotel && (
              <div>
                <div className="inline-block bg-orange-50 text-[#F97316] border border-orange-100 text-[11px] font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                  Flexible Block: Hotels
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">History Timeline</h3>
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-12">
                    {/* Milestone 1 */}
                    <div className="relative flex items-center group">
                      <div className="absolute left-8 w-16 h-16 bg-white border-4 border-orange-50 rounded-full flex items-center justify-center transform -translate-x-1/2 z-10 shadow-sm">
                        <span className="text-[#F97316] font-bold">1995</span>
                      </div>
                      <div className="w-full pl-24">
                        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 group-hover:border-orange-100 transition-colors">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Opened as a boutique hotel</h3>
                          <p className="text-gray-500">Our journey began with a vision to offer unparalleled hospitality.</p>
                        </div>
                      </div>
                    </div>

                    {/* Milestone 2 */}
                    <div className="relative flex items-center group">
                      <div className="absolute left-8 w-16 h-16 bg-white border-4 border-orange-50 rounded-full flex items-center justify-center transform -translate-x-1/2 z-10 shadow-sm">
                        <span className="text-[#F97316] font-bold">2020</span>
                      </div>
                      <div className="w-full pl-24">
                        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 group-hover:border-orange-100 transition-colors">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Awarded Best Eco-Resort</h3>
                          <p className="text-gray-500">Recognized for our dedication to sustainable and eco-friendly practices.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Mission & Values (Dark Theme) */}
      {propertyData.values && propertyData.values.length > 0 && (
        <section className="bg-[#0A0A0A] py-24 px-6 w-full overflow-hidden relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[600px] h-[600px] bg-[#EA580C]/10 rounded-full blur-[120px] -ml-[300px] pointer-events-none" />
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[600px] h-[600px] bg-[#EA580C]/10 rounded-full blur-[120px] -mr-[300px] pointer-events-none" />
          
          <div className="max-w-[1200px] mx-auto relative z-10 px-4 md:px-8">
            <div className="text-center mb-20">
              <span className="text-[#F97316] text-[13px] font-bold uppercase tracking-[0.15em] block mb-4">
                WHAT DRIVES US
              </span>
              <h2 className="text-3xl md:text-[44px] font-bold text-white leading-tight tracking-tight">
                Mission & Values
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
              {propertyData.values.map((item) => (
                <div key={item.id} className="flex flex-col items-center text-center group">
                  <div className="bg-[#121212] border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] inset-0 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:-translate-y-1">
                    {item.icon}
                  </div>
                  <h3 className="text-[20px] font-bold text-white mb-3 group-hover:text-[#F97316] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-[#9CA3AF] font-normal leading-[1.6] text-[15px] max-w-[300px]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Property Highlights */}
      <section className="py-24 px-6 md:px-12 bg-gray-50 w-full">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#F97316] text-[13px] font-bold uppercase tracking-[0.15em] block mb-4">DISCOVER MORE</span>
            <h2 className="text-3xl md:text-[44px] font-bold text-gray-900 mb-4">Property Highlights</h2>
            <p className="text-gray-600 max-w-[600px] mx-auto text-lg">Everything you need for a memorable stay.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Accommodations */}
            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#FFF4ED] rounded-2xl flex items-center justify-center mb-8">
                <CalendarDays className="w-7 h-7 text-[#F97316]" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Accommodations</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                {isHomestay ? propertyData.accommodations.homestay : propertyData.accommodations.hotel}
              </p>
            </div>

            {/* Amenities */}
            {propertyData.amenities && propertyData.amenities.length > 0 && (
              <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="w-14 h-14 bg-[#FFF4ED] rounded-2xl flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-7 h-7 text-[#F97316]" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {propertyData.amenities.slice(0,6).map((amenity, idx) => (
                    <span key={idx} className="bg-gray-50 text-gray-700 text-sm px-4 py-2 rounded-xl border border-gray-100 font-medium">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experiences */}
            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#FFF4ED] rounded-2xl flex items-center justify-center mb-8">
                <MapPin className="w-7 h-7 text-[#F97316]" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Unique Experiences</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                {isHomestay ? propertyData.experiences.homestay : propertyData.experiences.resort}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Team Section */}
      {propertyData.team && propertyData.team.length > 0 && (
        <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
          <div className="text-center mb-20">
            <span className="text-[#F97316] text-[13px] font-bold uppercase tracking-[0.15em] block mb-4">FACES BEHIND THE MAGIC</span>
            <h2 className="text-3xl md:text-[44px] font-bold text-gray-900">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[800px] mx-auto">
            {propertyData.team.map(member => (
              <div key={member.id} className="text-center group">
                <div className="relative w-56 h-56 mx-auto rounded-[2rem] bg-gray-200 mb-8 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <Image src={IMAGES.placeholder.src} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-[#F97316] font-bold text-sm uppercase tracking-wider mb-4">{member.role}</p>
                <p className="text-gray-500 text-[15px] max-w-[280px] mx-auto leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <p className="text-2xl md:text-3xl font-medium text-gray-800 italic">"We’re not just hosts – we’re your local guides to {location}!"</p>
          </div>
        </section>
      )}

      {/* 6. Sustainability & Awards */}
      {(propertyData.certifications?.length > 0 || propertyData.awards?.length > 0) && (
        <section className="py-24 bg-[#0A0A0A] text-white w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[120px] -mr-[400px] -mt-[400px] pointer-events-none" />
          
          <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
            <div className="md:w-1/2">
              <span className="text-[#F97316] text-[13px] font-bold uppercase tracking-[0.15em] block mb-4">ACCOLADES</span>
              <h2 className="text-3xl md:text-[44px] font-bold mb-6 leading-tight">Recognized for Excellence</h2>
              <p className="text-gray-400 text-[18px] mb-10 leading-relaxed max-w-[480px]">We are committed to sustainable practices and providing an award-winning experience for every guest.</p>
              {propertyData.certifications && propertyData.certifications.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {propertyData.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-full hover:bg-white/10 transition-colors">
                      <Leaf className="w-5 h-5 text-green-400" />
                      <span className="text-[15px] font-semibold">{cert}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="md:w-1/2 flex flex-wrap gap-6 justify-center md:justify-end">
              {propertyData.awards && propertyData.awards.map((award, i) => (
                <div key={i} className="bg-[#121212] border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-8 rounded-3xl text-center w-[220px] transform hover:-translate-y-2 transition-transform duration-300">
                  <Trophy className="w-12 h-12 text-[#F97316] mx-auto mb-6" strokeWidth={1.5} />
                  <p className="font-bold text-[16px] text-white/90 leading-snug">{award}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Guest Love */}
      {propertyData.reviews && propertyData.reviews.length > 0 && (
        <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[#F97316] text-[13px] font-bold uppercase tracking-[0.15em] block mb-4">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-[44px] font-bold text-gray-900">Guest Love</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {propertyData.reviews.map(review => (
              <div key={review.id} className="bg-white p-10 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-[20px] text-gray-800 font-medium mb-10 leading-relaxed">"{review.quote}"</p>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 font-bold text-xl">{review.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{review.author}</p>
                    <p className="text-[15px] text-gray-500">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
             <a href="#reviews" className="inline-flex items-center text-[#F97316] font-bold text-lg hover:underline transition-all">
               Read More Reviews <span className="ml-2">→</span>
             </a>
          </div>
        </section>
      )}

      {/* 8. Explore Location */}
      <section className="py-24 px-6 bg-gray-50 w-full">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <span className="text-[#F97316] text-[13px] font-bold uppercase tracking-[0.15em] block mb-4">NEIGHBORHOOD</span>
            <h2 className="text-3xl md:text-[44px] font-bold text-gray-900 mb-10">Explore {location}</h2>
            <div className="space-y-6">
              {propertyData.localGems && propertyData.localGems.map((gem, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-[#FFF4ED] rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-[#F97316]" strokeWidth={1.5} />
                    </div>
                    <span className="font-bold text-gray-900 text-[17px]">{gem.name}</span>
                  </div>
                  <span className="text-[14px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl">{gem.distance}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 w-full h-[500px] bg-white border border-gray-200 rounded-[32px] overflow-hidden relative shadow-sm">
            {/* Placeholder for map */}
            <div className="absolute inset-0 flex items-center justify-center flex-col text-gray-400 bg-gray-50">
               <MapPin className="w-16 h-16 mb-4 opacity-40 text-gray-400" />
               <p className="font-bold text-lg">Interactive Map Integration</p>
               <p className="text-sm mt-2 opacity-60">To be replaced with a live map component</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Partnerships */}
      {propertyData.partners && propertyData.partners.length > 0 && (
        <section className="py-20 px-6 max-w-[1200px] mx-auto w-full border-b border-gray-100">
          <div className="text-center mb-12">
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-[0.2em]">PROUD PARTNERS</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {propertyData.partners.map((partner, i) => (
               <div key={i} className="text-xl md:text-2xl font-black text-gray-400 cursor-default hover:text-gray-900 transition-colors duration-300">
                 {partner}
               </div>
             ))}
          </div>
        </section>
      )}

      {/* 10. FAQs */}
      {propertyData.faqs && propertyData.faqs.length > 0 && (
        <section className="py-24 px-6 max-w-[800px] mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[#F97316] text-[13px] font-bold uppercase tracking-[0.15em] block mb-4">SUPPORT</span>
            <h2 className="text-3xl md:text-[44px] font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-5">
            {propertyData.faqs.map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden shadow-sm">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-bold text-gray-900 text-lg">
                  {faq.q}
                  <ChevronDown className="w-6 h-6 text-gray-400 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed text-[15px]">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
          <div className="mt-12 text-center">
             <a href="#faqs" className="inline-flex items-center text-[#F97316] font-bold text-lg hover:underline transition-all">
               Visit Full FAQs <span className="ml-2">→</span>
             </a>
          </div>
        </section>
      )}

      {/* Footer (Placeholder matching Spodia requirements to be discussed at design) */}
      <footer className="bg-[#0A0A0A] text-white py-16 px-6 w-full border-t border-white/10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-xl font-bold mb-6 text-[#F97316]">Contact Us</h4>
            <div className="space-y-4 text-gray-400">
              <p>123 {location} Road, {location}, India</p>
              <p>Phone: +91 12345 67890</p>
              <p>Email: info@{name.toLowerCase().replace(/\s/g, '')}.com</p>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-6 text-[#F97316]">Social Media</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F97316] hover:text-white transition-colors duration-300 text-gray-400">FB</a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F97316] hover:text-white transition-colors duration-300 text-gray-400">IG</a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F97316] hover:text-white transition-colors duration-300 text-gray-400">TW</a>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-6 text-[#F97316]">Legal</h4>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
           © {new Date().getFullYear()} {name}. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
