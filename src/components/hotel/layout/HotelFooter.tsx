"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Mail, ChevronRight } from "lucide-react";
import { IMAGES } from "@/assets/images";

const HotelFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Hotels by Location",
      links: [
        { label: "New York Boutique Stays", href: "#", isAction: false, hasIcon: false },
        { label: "London Classic Collection", href: "#", isAction: false, hasIcon: false },
        { label: "Paris Luxury Suites", href: "#", isAction: false, hasIcon: false },
        { label: "Tokyo Modern Hotels", href: "#", isAction: false, hasIcon: false },
        { label: "Sydney Harbor Views", href: "#", isAction: false, hasIcon: false },
        { label: "View All →", href: "#", isAction: true, hasIcon: false },
      ],
    },
    {
      title: "Homestays & Villas",
      links: [
        { label: "Private Mountain Villas", href: "#", isAction: false, hasIcon: false },
        { label: "Coastal Beach Houses", href: "#", isAction: false, hasIcon: false },
        { label: "Rustic Rural Cottages", href: "#", isAction: false, hasIcon: false },
        { label: "Luxury City Penthouses", href: "#", isAction: false, hasIcon: false },
        { label: "Eco-Friendly Retreats", href: "#", isAction: false, hasIcon: false },
        { label: "View All →", href: "#", isAction: true, hasIcon: false },
      ],
    },
    {
      title: "Recommended & 5 Star",
      links: [
        { label: "The Ritz London", href: "#", isAction: false, hasIcon: false },
        { label: "Marina Bay Sands", href: "#", isAction: false, hasIcon: false },
        { label: "Bellagio Las Vegas", href: "#", isAction: false, hasIcon: false },
        { label: "Burj Al Arab Jumeirah", href: "#", isAction: false, hasIcon: false },
        { label: "The Plaza New York", href: "#", isAction: false, hasIcon: false },
        { label: "View All →", href: "#", isAction: true, hasIcon: false },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Premium Stays", href: "#", isAction: false, hasIcon: false },
        { label: "Press & Newsroom", href: "#", isAction: false, hasIcon: false },
        { label: "Sustainability Initiatives", href: "#", isAction: false, hasIcon: false },
        { label: "Investor Relations", href: "#", isAction: false, hasIcon: false },
        { label: "Careers & Culture", href: "#", isAction: false, hasIcon: false },
        { label: "Contact Us", href: "#", isAction: true, hasIcon: true },
      ],
    },
  ];

  return (
    <footer className="bg-[#F9F9F9] pt-20 pb-10 font-manrope">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col space-y-8">
              <h3 className="text-[18px] font-black text-[#2D3142]">{section.title}</h3>
              <ul className="flex flex-col space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`text-[14px] transition-all flex items-center ${
                        link.isAction 
                          ? "text-[#F97316] font-bold" 
                          : "text-[#64748B] hover:text-[#2D3142]"
                      }`}
                    >
                      {link.label}
                      {link.hasIcon && (
                        <Mail size={16} className="ml-1.5" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-gray-200/50 mb-12"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col space-y-12">
           {/* Logo and Secondary Links */}
           <div className="flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="flex items-center shrink-0">
               <Image
                 src={IMAGES.logo.src}
                 alt="Spodia Logo"
                 width={120}
                 height={40}
                 className="w-auto h-10"
               />
             </div>
             
             <div className="flex flex-wrap justify-center gap-6 md:gap-10">
               <Link href="#" className="text-[14px] font-medium text-[#64748B] hover:text-[#2D3142] transition-colors">Privacy Policy</Link>
               <Link href="#" className="text-[14px] font-medium text-[#64748B] hover:text-[#2D3142] transition-colors">Terms of Service</Link>
               <Link href="#" className="text-[14px] font-medium text-[#64748B] hover:text-[#2D3142] transition-colors">Cookie Settings</Link>
             </div>

             <div className="flex items-center space-x-4">
               <Link href="#" className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#2D3142] hover:bg-[#F97316] hover:text-white hover:border-[#F97316] transition-all transform hover:scale-110">
                 <Facebook size={18} />
               </Link>
               <Link href="#" className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#2D3142] hover:bg-[#F97316] hover:text-white hover:border-[#F97316] transition-all transform hover:scale-110">
                 <Twitter size={18} />
               </Link>
               <Link href="#" className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#2D3142] hover:bg-[#F97316] hover:text-white hover:border-[#F97316] transition-all transform hover:scale-110">
                 <Instagram size={18} />
               </Link>
             </div>
           </div>

           {/* Copyright */}
           <div className="text-center">
             <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.2em] leading-relaxed">
               © {currentYear} SPODIA ACCOMMODATION SERVICES. ALL RIGHTS RESERVED.
             </p>
           </div>
        </div>
      </div>
    </footer>

  );
};

export default HotelFooter;
