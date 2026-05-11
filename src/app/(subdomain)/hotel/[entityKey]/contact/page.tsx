import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import { propertyData } from "@/lib/hotel/mockData";
import { Phone, Mail, MapPin, MessageSquare, Instagram, Facebook, Twitter, Send, Clock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ entityKey: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "contact" });
}

export default async function ContactPage({ params }: Props) {
  const { entityKey } = await params;
  const { name, location } = propertyData;

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple 
        title={`Get in Touch with ${name}`}
        subtitle="We're here to make your stay extraordinary. Reach out for bookings, inquiries, or special requests."
      />

      {/* 2. Direct Actions & Contact Details */}
      <section className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Cards */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 group hover:bg-[#FF9530] transition-all duration-500">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <Phone className="w-7 h-7 text-[#FF9530]" />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-white transition-colors">Call Us Directly</h3>
               <p className="text-gray-600 font-medium group-hover:text-white/80 transition-colors mb-6">Available 24/7 for your needs.</p>
               <p className="text-xl font-black text-gray-900 group-hover:text-white transition-colors">+91 12345 67890</p>
               <p className="text-lg font-bold text-gray-900 group-hover:text-white transition-colors opacity-60">+91 09876 54321</p>
            </div>

            <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 group hover:bg-gray-900 transition-all duration-500">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <Mail className="w-7 h-7 text-[#FF9530]" />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-white transition-colors">Email Inquiries</h3>
               <p className="text-gray-600 font-medium group-hover:text-white/80 transition-colors mb-6">We usually respond within 2 hours.</p>
               <p className="text-xl font-black text-gray-900 group-hover:text-white transition-colors">info@{name.toLowerCase().replace(/\s/g, '')}.com</p>
               <p className="text-lg font-bold text-gray-900 group-hover:text-white transition-colors opacity-60">reservations@{name.toLowerCase().replace(/\s/g, '')}.com</p>
            </div>

            <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 group hover:border-[#FF9530] transition-all duration-500">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <MapPin className="w-7 h-7 text-[#FF9530]" />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-4">Visit Us</h3>
               <p className="text-gray-600 font-medium mb-6">Located in the heart of the city.</p>
               <p className="text-lg font-bold text-gray-900 leading-relaxed">
                 123 {location} Road, Near Central Mall, <br />
                 {location}, Assam, 781001
               </p>
            </div>
          </div>

          {/* 3. Inquiry Form */}
          <div className="lg:col-span-2 bg-white rounded-[48px] p-10 md:p-16 border border-gray-100 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-50 rounded-full blur-[100px] -mr-[200px] -mt-[200px] pointer-events-none opacity-50" />
             
             <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8">Send a Message</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                   <div className="flex flex-col gap-3">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Full Name</label>
                      <input type="text" placeholder="John Doe" className="bg-gray-50 border-none rounded-2xl p-5 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] transition-all outline-none" />
                   </div>
                   <div className="flex flex-col gap-3">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Email Address</label>
                      <input type="email" placeholder="john@example.com" className="bg-gray-50 border-none rounded-2xl p-5 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] transition-all outline-none" />
                   </div>
                   <div className="flex flex-col gap-3">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Mobile Number</label>
                      <input type="tel" placeholder="+91 98765 43210" className="bg-gray-50 border-none rounded-2xl p-5 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] transition-all outline-none" />
                   </div>
                   <div className="flex flex-col gap-3">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Subject</label>
                      <select className="bg-gray-50 border-none rounded-2xl p-5 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] transition-all outline-none appearance-none">
                         <option>General Inquiry</option>
                         <option>Room Booking</option>
                         <option>Event Hosting</option>
                         <option>Feedback</option>
                      </select>
                   </div>
                </div>
                <div className="flex flex-col gap-3 mb-10">
                   <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">Your Message</label>
                   <textarea rows={5} placeholder="How can we help you?" className="bg-gray-50 border-none rounded-2xl p-6 text-gray-900 font-bold focus:ring-2 focus:ring-[#FF9530] transition-all outline-none resize-none"></textarea>
                </div>
                <button className="w-full md:w-auto bg-gradient-to-r from-[#FF9530] to-[#FFB347] text-white px-12 py-5 rounded-2xl font-bold text-xl hover:shadow-[0_10px_30px_rgba(255,149,48,0.4)] transition-all active:scale-95 flex items-center justify-center gap-4 group">
                   Submit Inquiry
                   <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Map Placeholder */}
      <section className="w-full h-[600px] relative bg-gray-200">
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
               <MapPin className="w-16 h-16 text-[#FF9530] mx-auto mb-4 animate-bounce" />
               <p className="text-xl font-bold text-gray-500">Interactive Map Integration Here</p>
               <p className="text-gray-400">Google Maps / OpenStreetMap</p>
            </div>
         </div>
         {/* Overlapping Card */}
         <div className="absolute bottom-12 left-6 md:left-12 bg-white/90 backdrop-blur-md p-8 rounded-[32px] shadow-2xl max-w-[400px] border border-white/50">
            <h4 className="text-2xl font-black text-gray-900 mb-6">Getting Here</h4>
            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                     <Clock className="w-5 h-5 text-[#FF9530]" />
                  </div>
                  <div>
                     <p className="font-bold text-gray-900">Airport: 45 Mins</p>
                     <p className="text-sm text-gray-500">Shuttle services available on request.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                     <Clock className="w-5 h-5 text-[#FF9530]" />
                  </div>
                  <div>
                     <p className="font-bold text-gray-900">Railway Station: 15 Mins</p>
                     <p className="text-sm text-gray-500">Taxi & auto services are frequent.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. Department-wise Contacts */}
      <section className="py-24 px-6 bg-gray-50">
         <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Our Departments</h2>
               <p className="text-gray-600 text-lg">Direct lines to our specialized teams.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 {title: "Front Desk", phone: "+91 123 456 0001", email: "frontdesk@hotel.com"},
                 {title: "Reservations", phone: "+91 123 456 0002", email: "book@hotel.com"},
                 {title: "Corporate Events", phone: "+91 123 456 0003", email: "events@hotel.com"}
               ].map((dept, i) => (
                 <div key={i} className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:border-[#FF9530] transition-colors">
                    <h4 className="text-xl font-bold text-gray-900 mb-6">{dept.title}</h4>
                    <div className="space-y-4">
                       <p className="flex items-center gap-3 text-gray-600 font-medium"><Phone className="w-4 h-4 text-[#FF9530]"/> {dept.phone}</p>
                       <p className="flex items-center gap-3 text-gray-600 font-medium"><Mail className="w-4 h-4 text-[#FF9530]"/> {dept.email}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Social Feed Placeholder */}
      <section className="py-24 px-6 text-center">
         <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-16">Follow Our Story</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-[1440px] mx-auto">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="aspect-square bg-gray-100 rounded-3xl overflow-hidden relative group cursor-pointer">
                 <Image src={IMAGES.bgSection.src} alt="Social" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Instagram className="w-8 h-8" />
                 </div>
              </div>
            ))}
         </div>
      </section>

    </HotelPageShell>
  );
}
