import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import { propertyData } from "@/lib/hotel/mockData";
import { Phone, Mail, MapPin, MessageSquare, Send, Clock, ShieldCheck, Award, Lock, RotateCcw, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  const { name, location } = propertyData;
  return {
    title: `Contact ${name} | Address, Phone & Support | ${location}`,
    description: `Reach ${name} via phone, email, or live chat. Find our address, business hours, and quick-contact form. We’re here to assist!`,
  };
}

export default async function ContactPage({ params }: Props) {
  const { entityKey } = await params;
  const { name, location } = propertyData;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 MG Road",
      "addressLocality": location,
      "addressRegion": "Assam",
      "postalCode": "781001",
      "addressCountry": "India"
    },
    "telephone": "+91 12345-67890",
    "email": `support@${name.toLowerCase().replace(/\s/g, "")}.com`,
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "20:00"
    }
  };

  return (
    <HotelPageShell entityKey={entityKey}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        <Image 
          src={IMAGES.bgSection.src} 
          alt="Hotel Entrance" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-6 max-w-[900px]">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight">
            Get in Touch – <span className="text-[#FF9530]">We’re Here to Help!</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-medium mb-12">
            24/7 Support · Quick Responses · Seamless Bookings.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <Award className="w-5 h-5 text-[#FF9530]" />
              <span className="text-white font-bold text-sm">TripAdvisor Excellence Award</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <Lock className="w-5 h-5 text-[#FF9530]" />
              <span className="text-white font-bold text-sm">Secure Booking</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <RotateCcw className="w-5 h-5 text-[#FF9530]" />
              <span className="text-white font-bold text-sm">Free Cancellation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Contact Options Grid */}
      <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Column A: Contact Details */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-8 flex items-center gap-4">
                <span className="w-12 h-1 bg-[#FF9530] rounded-full" />
                Contact Details
              </h2>
              
              <div className="space-y-8">
                {/* Address */}
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-7 h-7 text-[#FF9530]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">📍 {name}</h4>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      123 MG Road, {location}, Assam – 781001
                    </p>
                    <div className="mt-6 w-full h-[250px] bg-gray-100 rounded-[32px] overflow-hidden relative border border-gray-100 shadow-sm">
                      <div className="absolute inset-0 flex items-center justify-center">
                         <p className="text-gray-400 font-bold">Google Maps Embed Placeholder</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone className="w-7 h-7 text-[#FF9530]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div>
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">📞 Reservations</h4>
                      <p className="text-xl font-bold text-gray-900">+91 98765 43210</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">📞 General Inquiries</h4>
                      <p className="text-xl font-bold text-gray-900">+91 01234 56789</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="w-7 h-7 text-[#FF9530]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div>
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">✉️ Bookings</h4>
                      <p className="text-xl font-bold text-gray-900">bookings@{name.toLowerCase().replace(/\s/g, "")}.com</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">✉️ Support</h4>
                      <p className="text-xl font-bold text-gray-900">support@{name.toLowerCase().replace(/\s/g, "")}.com</p>
                    </div>
                  </div>
                </div>

                {/* Emergency */}
                <div className="bg-red-50 p-8 rounded-[32px] border border-red-100 flex items-center gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    <RotateCcw className="w-7 h-7 text-red-500 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-red-400 uppercase tracking-widest mb-1">🚨 24/7 Helpline</h4>
                    <p className="text-2xl font-black text-red-600">+91 91191 19119</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column B: Contact Form */}
          <div className="bg-white rounded-[48px] p-10 md:p-16 border border-gray-100 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-50 rounded-full blur-[100px] -mr-[200px] -mt-[200px] pointer-events-none opacity-50" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8">Send a Message</h2>
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Name (Required)</label>
                    <input required type="text" placeholder="John Doe" className="bg-gray-50 border-none rounded-2xl p-5 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] transition-all outline-none" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Email (Required)</label>
                    <input required type="email" placeholder="john@example.com" className="bg-gray-50 border-none rounded-2xl p-5 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] transition-all outline-none" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Phone</label>
                    <input type="tel" placeholder="+91 98765 43210" className="bg-gray-50 border-none rounded-2xl p-5 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] transition-all outline-none" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Inquiry Type</label>
                    <select className="bg-gray-50 border-none rounded-2xl p-5 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] transition-all outline-none appearance-none">
                      <option>Booking</option>
                      <option>Event</option>
                      <option>Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Message (Max 500 characters)</label>
                  <textarea maxLength={500} rows={5} placeholder="How can we help you?" className="bg-gray-50 border-none rounded-2xl p-6 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] transition-all outline-none resize-none"></textarea>
                </div>
                
                <div className="space-y-6">
                  <button className="w-full bg-gradient-to-r from-[#FF9530] to-[#FFB347] text-white px-12 py-5 rounded-2xl font-bold text-xl hover:shadow-[0_10px_30px_rgba(255,149,48,0.4)] transition-all active:scale-95 flex items-center justify-center gap-4 group">
                    Send Message →
                  </button>
                  <p className="text-xs text-gray-400 font-medium text-center">
                    Privacy Note: "We respect your privacy. Read our <span className="text-[#FF9530] underline cursor-pointer">Privacy Policy</span>."
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Business Hours */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-6">Business Hours</h2>
            <p className="text-gray-600 text-lg font-medium">When you can reach our administrative teams.</p>
          </div>
          
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-10 py-6 text-lg font-black">Day</th>
                  <th className="px-10 py-6 text-lg font-black">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-10 py-8 font-black text-gray-900">Monday–Friday</td>
                  <td className="px-10 py-8 font-bold text-gray-600">8:00 AM – 8:00 PM IST</td>
                </tr>
                <tr>
                  <td className="px-10 py-8 font-black text-gray-900">Saturday</td>
                  <td className="px-10 py-8 font-bold text-gray-600">9:00 AM – 6:00 PM IST</td>
                </tr>
                <tr>
                  <td className="px-10 py-8 font-black text-gray-900">Sunday</td>
                  <td className="px-10 py-8 font-bold text-gray-600">10:00 AM – 5:00 PM IST</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Social Media */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-4xl font-black text-gray-900 mb-12">Connect With Us</h2>
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <div className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center group-hover:bg-[#1877F2] group-hover:text-white transition-all duration-300 shadow-sm">
                <Facebook className="w-8 h-8" />
              </div>
              <span className="font-black text-gray-900 uppercase tracking-widest text-xs">Facebook</span>
            </div>
            <div className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center group-hover:bg-[#E4405F] group-hover:text-white transition-all duration-300 shadow-sm">
                <Instagram className="w-8 h-8" />
              </div>
              <span className="font-black text-gray-900 uppercase tracking-widest text-xs">Instagram</span>
            </div>
            <div className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center group-hover:bg-[#0A66C2] group-hover:text-white transition-all duration-300 shadow-sm">
                <Linkedin className="w-8 h-8" />
              </div>
              <span className="font-black text-gray-900 uppercase tracking-widest text-xs">LinkedIn</span>
            </div>
            <div className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center group-hover:bg-[#1DA1F2] group-hover:text-white transition-all duration-300 shadow-sm">
                <Twitter className="w-8 h-8" />
              </div>
              <span className="font-black text-gray-900 uppercase tracking-widest text-xs">Twitter</span>
            </div>
          </div>
          <div className="inline-block bg-[#FF9530] text-white px-10 py-4 rounded-full font-black text-xl shadow-lg">
            Tag Us: #{name.replace(/\s/g, "")}<span className="opacity-70">Spodia</span>
          </div>
        </div>
      </section>

    </HotelPageShell>
  );
}
