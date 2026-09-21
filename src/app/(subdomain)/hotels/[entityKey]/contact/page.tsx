import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import { propertyData } from "@/lib/hotel/mockData";
import { fetchHotelDetails } from "@/lib/api/hotelDetails";
import { Phone, Mail, MapPin, MessageSquare, Send, Clock, ShieldCheck, Award, Lock, RotateCcw, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";
import ContactGoogleMap from "@/components/hotel/ContactGoogleMap";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  const hotelData = await fetchHotelDetails(entityKey);
  const name = hotelData?.name || propertyData.name;
  const location = hotelData?.address || (hotelData?.city_name ? `${hotelData.city_name}, ${hotelData.state_name || ''}` : propertyData.location);
  
  return {
    title: `Contact ${name} | Address, Phone & Support | ${location}`,
    description: `Reach ${name} via phone, email, or live chat. Find our address, business hours, and quick-contact form. We’re here to assist!`,
  };
}

export default async function ContactPage({ params }: Props) {
  const { entityKey } = await params;
  const hotelData = await fetchHotelDetails(entityKey);
  const name = hotelData?.name || propertyData.name;
  const location = hotelData?.address || (hotelData?.city_name ? `${hotelData.city_name}, ${hotelData.state_name || ''}` : propertyData.location);
  const phone = (hotelData as any)?.mobile_number || "+91 7399888855";
  const email = (hotelData as any)?.email || `bookings@spodia.com`;

  const mapLat = hotelData?.latitude ? parseFloat(hotelData.latitude.toString()) : 26.1445;
  const mapLng = hotelData?.longitude ? parseFloat(hotelData.longitude.toString()) : 91.7362;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": location,
      "addressLocality": hotelData?.city_name || location,
      "addressCountry": "India"
    },
    "telephone": phone,
    "email": email,
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  };


  return (
    <HotelPageShell entityKey={entityKey}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center pt-12 pb-16 md:pt-32 md:pb-24 min-h-[380px] md:min-h-[500px]">
        <Image 
          src={IMAGES.bgSection.src} 
          alt="Hotel Entrance" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-[1000px] w-full flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight px-2">
            Get in Touch <br className="block sm:hidden" />
            <span className="hidden sm:inline">–</span> <span className="text-[#FF9530]">We’re Here to Help!</span>
          </h1>
          <p className="text-sm sm:text-xl md:text-2xl text-white/90 font-medium mb-8 sm:mb-12">
            24/7 Support · Quick Responses · Seamless Bookings.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-full">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors whitespace-nowrap shrink-0">
              <Award className="w-4 h-4 text-[#FF9530]" />
              <span className="text-white font-bold text-xs md:text-sm">TripAdvisor Excellence</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors whitespace-nowrap shrink-0">
              <Lock className="w-4 h-4 text-[#FF9530]" />
              <span className="text-white font-bold text-xs md:text-sm">Secure Booking</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors whitespace-nowrap shrink-0">
              <RotateCcw className="w-4 h-4 text-[#FF9530]" />
              <span className="text-white font-bold text-xs md:text-sm">Free Cancellation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Contact Details Section */}
      <section className="pt-12 pb-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center justify-center gap-3 bg-orange-50 px-5 py-2 rounded-full mb-4">
            <div className="w-8 h-1 bg-[#FF9530] rounded-full" />
            <span className="text-[#FF9530] font-black uppercase tracking-widest text-xs sm:text-sm">Reach Out</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900">Contact Details</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info Cards */}
          <div className="space-y-4 sm:space-y-6">
            {/* Address */}
            <div className="bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF9530]" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] sm:text-sm font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 truncate">{name}</h4>
                <p className="text-[13px] sm:text-lg font-bold text-gray-900 leading-relaxed">
                  123 MG Road, {location}, Assam – 781001
                </p>
              </div>
            </div>

            {/* Phones */}
            <div className="bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF9530]" />
              </div>
              <div className="flex flex-col items-center lg:items-start gap-4 sm:gap-6 w-full">
                <div>
                  <h4 className="text-[11px] sm:text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Reservations</h4>
                  <p className="text-sm sm:text-xl font-bold text-gray-900">+91 98765 43210</p>
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Inquiries</h4>
                  <p className="text-sm sm:text-xl font-bold text-gray-900">+91 01234 56789</p>
                </div>
              </div>
            </div>

            {/* Emails */}
            <div className="bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF9530]" />
              </div>
              <div className="flex flex-col items-center lg:items-start gap-4 sm:gap-6 w-full">
                <div>
                  <h4 className="text-[11px] sm:text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Bookings</h4>
                  <p className="text-sm sm:text-lg font-bold text-gray-900">bookings@{name.toLowerCase().replace(/\s/g, "")}.com</p>
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Support</h4>
                  <p className="text-sm sm:text-lg font-bold text-gray-900">support@{name.toLowerCase().replace(/\s/g, "")}.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-full min-h-[400px] w-full bg-gray-100 rounded-[32px] overflow-hidden relative border border-gray-100 shadow-sm group">
            <ContactGoogleMap lat={mapLat} lng={mapLng} title={name} />
          </div>
        </div>
      </section>

      {/* 3. Send a Message Section */}
      <section className="pt-12 pb-8 sm:py-16 md:py-24 px-4 sm:px-6 bg-gray-50 border-t border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-[100px] -mr-[250px] -mt-[250px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-[100px] -ml-[250px] -mb-[250px] pointer-events-none" />
        
        <div className="max-w-[1440px] md:px-6 mx-auto w-full relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 sm:mb-4">Send a Message</h2>
            <p className="text-gray-600 text-sm sm:text-lg font-medium px-4">Have a question? We'd love to hear from you.</p>
          </div>
          
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 md:p-12 border border-gray-100 shadow-xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name Input */}
                <div className="relative group">
                  <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest ml-3 sm:ml-4 mb-1.5 sm:mb-2 block">Full Name *</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 sm:left-4 text-gray-400 group-focus-within:text-[#FF9530] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <input required type="text" placeholder="John Doe" className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-14 pr-3 sm:pr-4 text-sm sm:text-base text-gray-900 font-bold focus:border-[#FF9530] focus:ring-4 focus:ring-orange-50 transition-all outline-none" />
                  </div>
                </div>

                {/* Email Input */}
                <div className="relative group">
                  <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest ml-3 sm:ml-4 mb-1.5 sm:mb-2 block">Email Address *</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 sm:left-4 text-gray-400 group-focus-within:text-[#FF9530] transition-colors">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    </div>
                    <input required type="email" placeholder="john@example.com" className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-14 pr-3 sm:pr-4 text-sm sm:text-base text-gray-900 font-bold focus:border-[#FF9530] focus:ring-4 focus:ring-orange-50 transition-all outline-none" />
                  </div>
                </div>

                {/* Phone Input */}
                <div className="relative group">
                  <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest ml-3 sm:ml-4 mb-1.5 sm:mb-2 block">Phone Number</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 sm:left-4 text-gray-400 group-focus-within:text-[#FF9530] transition-colors">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    </div>
                    <input type="tel" placeholder="+91 98765 43210" className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-14 pr-3 sm:pr-4 text-sm sm:text-base text-gray-900 font-bold focus:border-[#FF9530] focus:ring-4 focus:ring-orange-50 transition-all outline-none" />
                  </div>
                </div>

                {/* Inquiry Type Select */}
                <div className="relative group">
                  <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest ml-3 sm:ml-4 mb-1.5 sm:mb-2 block">Inquiry Type</label>
                  <div className="relative flex items-center">
                    <select className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-4 sm:pl-5 pr-10 sm:pr-12 text-sm sm:text-base text-gray-900 font-bold focus:border-[#FF9530] focus:ring-4 focus:ring-orange-50 transition-all outline-none appearance-none cursor-pointer">
                      <option>Room Booking</option>
                      <option>Event or Banquet</option>
                      <option>General Support</option>
                      <option>Feedback</option>
                    </select>
                    <div className="absolute right-3.5 sm:right-4 text-gray-400 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Textarea */}
              <div className="relative group">
                <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest ml-3 sm:ml-4 mb-1.5 sm:mb-2 block">Your Message (Max 500 chars)</label>
                <div className="relative">
                  <div className="absolute left-3.5 sm:left-4 top-4 sm:top-5 text-gray-400 group-focus-within:text-[#FF9530] transition-colors">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                  </div>
                  <textarea maxLength={500} rows={5} placeholder="How can we assist you today?" className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-14 pr-3 sm:pr-4 text-sm sm:text-base text-gray-900 font-bold focus:border-[#FF9530] focus:ring-4 focus:ring-orange-50 transition-all outline-none resize-none"></textarea>
                </div>
              </div>
              
              {/* Submit Action */}
              <div className="pt-2 sm:pt-4 space-y-4 sm:space-y-5">
                <button type="button" className="w-full bg-[#0A0A0A] hover:bg-[#FF9530] text-white px-4 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3 shadow-xl hover:shadow-[#FF9530]/30 group">
                  <span className="whitespace-nowrap">Send Message</span>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[10px] sm:text-[11px] text-gray-400 font-bold text-center uppercase tracking-widest px-2">
                  We respect your privacy. Read our <span className="text-[#FF9530] underline cursor-pointer">Privacy Policy</span>.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 4. Business Hours */}
      <section className="pt-8 pb-16 sm:py-16 md:py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 sm:mb-6 whitespace-nowrap">Business Hours</h2>
            <p className="text-gray-600 text-sm sm:text-xl font-medium px-4">When you can reach our administrative teams.</p>
          </div>
          
          <div className="w-full bg-white rounded-[32px] sm:rounded-[40px] border border-gray-100 shadow-xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
            {/* Decorative background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none opacity-60" />
            
            <div className="space-y-4 relative z-10">
              {[
                { day: 'Monday - Friday', hours: '8:00 AM - 8:00 PM', icon: '🗓️', active: true },
                { day: 'Saturday', hours: '9:00 AM - 6:00 PM', icon: '✨', active: false },
                { day: 'Sunday', hours: '10:00 AM - 5:00 PM', icon: '🎈', active: false },
              ].map((item, idx) => (
                <div key={idx} className={`flex flex-wrap items-center justify-between p-4 sm:p-6 md:p-8 rounded-[20px] sm:rounded-3xl border transition-all duration-300 gap-4 ${item.active ? 'bg-orange-50/50 border-orange-200 shadow-sm' : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0 max-w-full pr-2">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-sm shrink-0 ${item.active ? 'bg-white' : 'bg-white border border-gray-100'}`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 truncate">{item.day}</h4>
                      {item.active && <p className="text-[10px] sm:text-xs font-bold text-[#FF9530] uppercase tracking-widest mt-0.5 sm:mt-1">Primary Hours</p>}
                    </div>
                  </div>
                  <div className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl inline-flex font-black tracking-wide text-sm sm:text-base whitespace-nowrap shrink-0 ${item.active ? 'bg-[#FF9530] text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200'}`}>
                    {item.hours}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-1 bg-gray-100 rounded-full" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">
                All times are in IST (Indian Standard Time)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Social Media */}
      <section className="py-8 sm:py-16 md:py-24 px-4 sm:px-6 text-center">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-6 sm:mb-12 whitespace-nowrap">Connect With Us</h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8 sm:mb-16">
            <div className="flex flex-col items-center gap-2 sm:gap-4 group cursor-pointer w-20 sm:w-24">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:bg-[#1877F2] group-hover:text-white transition-all duration-300 shadow-sm">
                <Facebook className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className="font-black text-gray-900 uppercase tracking-widest text-[10px] sm:text-xs">Facebook</span>
            </div>
            <div className="flex flex-col items-center gap-2 sm:gap-4 group cursor-pointer w-20 sm:w-24">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:bg-[#E4405F] group-hover:text-white transition-all duration-300 shadow-sm">
                <Instagram className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className="font-black text-gray-900 uppercase tracking-widest text-[10px] sm:text-xs">Instagram</span>
            </div>
            <div className="flex flex-col items-center gap-2 sm:gap-4 group cursor-pointer w-20 sm:w-24">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:bg-[#0A66C2] group-hover:text-white transition-all duration-300 shadow-sm">
                <Linkedin className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className="font-black text-gray-900 uppercase tracking-widest text-[10px] sm:text-xs">LinkedIn</span>
            </div>
            <div className="flex flex-col items-center gap-2 sm:gap-4 group cursor-pointer w-20 sm:w-24">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:bg-[#1DA1F2] group-hover:text-white transition-all duration-300 shadow-sm">
                <Twitter className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className="font-black text-gray-900 uppercase tracking-widest text-[10px] sm:text-xs">Twitter</span>
            </div>
          </div>
          <div className="inline-block bg-[#FF9530] text-white px-4 sm:px-10 py-3 sm:py-4 rounded-full font-black text-[11px] sm:text-xl shadow-lg whitespace-nowrap max-w-full">
            Tag Us: #{name.replace(/\s/g, "")}<span className="opacity-70">Spodia</span>
          </div>
        </div>
      </section>

    </HotelPageShell>
  );
}
