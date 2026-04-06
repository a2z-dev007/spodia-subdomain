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
        { label: "New York Boutique Stays", href: "#" },
        { label: "London Classic Collection", href: "#" },
        { label: "Paris Luxury Suites", href: "#" },
        { label: "Tokyo Modern Hotels", href: "#" },
        { label: "Sydney Harbor Views", href: "#" },
        { label: "View All →", href: "#", isAction: true },
      ],
    },
    {
      title: "Homestays & Villas",
      links: [
        { label: "Private Mountain Villas", href: "#" },
        { label: "Coastal Beach Houses", href: "#" },
        { label: "Rustic Rural Cottages", href: "#" },
        { label: "Luxury City Penthouses", href: "#" },
        { label: "Eco-Friendly Retreats", href: "#" },
        { label: "View All →", href: "#", isAction: true },
      ],
    },
    {
      title: "Recommended & 5 Star",
      links: [
        { label: "The Ritz London", href: "#" },
        { label: "Marina Bay Sands", href: "#" },
        { label: "Bellagio Las Vegas", href: "#" },
        { label: "Burj Al Arab Jumeirah", href: "#" },
        { label: "The Plaza New York", href: "#" },
        { label: "View All →", href: "#", isAction: true },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Premium Stays", href: "#" },
        { label: "Press & Newsroom", href: "#" },
        { label: "Sustainability Initiatives", href: "#" },
        { label: "Investor Relations", href: "#" },
        { label: "Careers & Culture", href: "#" },
        { label: "Contact Us", href: "#", isAction: true, hasIcon: true },
      ],
    },
  ];

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100 font-manrope">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col space-y-6">
              <h3 className="text-xl font-bold text-[#1A1A1A] tracking-tight">{section.title}</h3>
              <ul className="flex flex-col space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`text-[15px] transition-colors flex items-center ${
                        link.isAction 
                          ? "text-[#FF9530] font-bold hover:text-[#e8851c]" 
                          : "text-gray-500 hover:text-[#FF9530]"
                      }`}
                    >
                      {link.label}
                      {link.hasIcon && (
                        <Mail size={14} className="ml-2" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-gray-100 mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col space-y-8">
           {/* Logo and Secondary Links */}
           <div className="flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex items-center">
               <Image
                 src={IMAGES.logo.src}
                 alt="Spodia Logo"
                 width={100}
                 height={30}
                 className="w-auto h-8 opacity-90"
               />
             </div>
             
             <div className="flex flex-wrap justify-center gap-6 md:gap-10">
               <Link href="#" className="text-sm font-semibold text-gray-500 hover:text-[#FF9530] transition-colors">Privacy Policy</Link>
               <Link href="#" className="text-sm font-semibold text-gray-500 hover:text-[#FF9530] transition-colors">Terms of Service</Link>
               <Link href="#" className="text-sm font-semibold text-gray-500 hover:text-[#FF9530] transition-colors">Cookie Settings</Link>
             </div>

             <div className="flex items-center space-x-6">
               <Link href="#" className="text-[#1A1A1A] hover:text-[#FF9530] transition-colors p-2 rounded-full bg-gray-50 hover:bg-orange-50 transform hover:scale-110 duration-200">
                 <Facebook size={18} fill="currentColor" className="text-inherit" />
               </Link>
               <Link href="#" className="text-[#1A1A1A] hover:text-[#FF9530] transition-colors p-2 rounded-full bg-gray-50 hover:bg-orange-50 transform hover:scale-110 duration-200">
                 <Twitter size={18} fill="currentColor" className="text-inherit" />
               </Link>
               <Link href="#" className="text-[#1A1A1A] hover:text-[#FF9530] transition-colors p-2 rounded-full bg-gray-50 hover:bg-orange-50 transform hover:scale-110 duration-200">
                 <Instagram size={18} className="text-inherit" />
               </Link>
             </div>
           </div>

           {/* Copyright */}
           <div className="text-center md:text-left">
             <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">
               © {currentYear} SPODIA ACCOMMODATION SERVICES. ALL RIGHTS RESERVED.
             </p>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default HotelFooter;
