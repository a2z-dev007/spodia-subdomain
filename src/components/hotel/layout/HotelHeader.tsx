"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Menu, X, ChevronRight } from "lucide-react";
import { IMAGES } from "@/assets/images";

interface NavItem {
  label: string;
  href: string;
}

interface HotelHeaderProps {
  entityKey: string;
  hotelName?: string;
  location?: string;
}

const HotelHeader: React.FC<HotelHeaderProps> = ({
  entityKey,
  hotelName = "The Grand Casa",
  location = "Guwahati, Assam, India",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--hotel-header-height",
          `${height}px`,
        );
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      updateHeight();
    };

    updateHeight();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateHeight);

    // Initial delay to capture transition end
    const timer = setTimeout(updateHeight, 300);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateHeight);
      clearTimeout(timer);
    };
  }, [isScrolled, isMenuOpen]);

  const navItems: NavItem[] = [
    { label: "Overview", href: `/hotel/${entityKey}` },
    // { label: "Overview", href: `/hotel/${entityKey}/overview` },
    { label: "About Us", href: `/hotel/${entityKey}/about` },
    { label: "Rooms", href: `/hotel/${entityKey}/rooms` },
    { label: "Dining", href: `/hotel/${entityKey}/dine` },
    { label: "Weddings", href: `#` },
    { label: "Events", href: `/hotel/${entityKey}/events` },
    { label: "Facilities", href: `/hotel/${entityKey}/services` },
    { label: "Places to Visit", href: `/hotel/${entityKey}/explore` },
    { label: "Packages", href: `/hotel/${entityKey}/tariff` },
    { label: "Gallery", href: `/hotel/${entityKey}/gallery` },
    { label: "Sitemap", href: `/hotel/${entityKey}/sitemap` },
    { label: "Reviews", href: `/hotel/${entityKey}/reviews` },
    { label: "FAQs", href: `/hotel/${entityKey}/faqs` },
    { label: "Contact", href: `/hotel/${entityKey}/contact` },
  ];

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-[100] flex flex-col font-manrope transition-all duration-500"
    >
      {/* Top Bar - Hide on scroll */}
      <div
        className={`bg-[#1A1A1A] text-white transition-all duration-500 overflow-hidden ${isScrolled ? "max-h-0 py-0" : "max-h-20 py-2"} px-4 md:px-8 flex flex-wrap justify-between items-center text-[10px] md:text-xs uppercase tracking-wider font-semibold`}
      >
        <div className="flex items-center space-x-4 md:space-x-8">
          <a
            href="tel:+917399888855"
            className="flex items-center hover:text-[#FF9530] transition-colors"
          >
            <Phone size={14} className="mr-2 text-[#FF9530]" />
            +91 7399888855
          </a>
          <a
            href="tel:+919999880803"
            className="flex items-center hover:text-[#FF9530] transition-colors"
          >
            <Phone size={14} className="mr-2 text-[#FF9530]" />
            +91 9999880803
          </a>
        </div>
        <div className="hidden sm:block text-[#FF9530]">
          BEST & LAST MINUTE OFFERS - GET MINIMUM RATES & BEST DISCOUNTS
        </div>
      </div>

      {/* Main Nav - Sticky and shadow on scroll */}
      <nav
        className={`bg-white transition-all duration-300 ${isScrolled ? "shadow-lg py-4" : "py-4"} px-4 md:px-8 border-b border-gray-100`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Logo and Hotel Info */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link href={`/hotel/${entityKey}`} className="flex items-center">
              <Image
                src={IMAGES.logo.src}
                alt="Spodia Logo"
                width={120}
                height={40}
                className={`w-auto transition-all duration-300 ${isScrolled ? "h-6 md:h-8" : "h-8 md:h-10"}`}
              />
            </Link>
            <div className="hidden md:block h-10 w-[1px] bg-gray-200"></div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm md:text-lg font-bold text-[#1A1A1A] leading-tight">
                {hotelName}
              </span>
              <span className="text-[10px] md:text-xs text-gray-500 font-medium">
                {location}
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center space-x-1 xl:space-x-3">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname === `${item.href}/`;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`px-2 py-2 text-[11px] xl:text-[12px] font-bold transition-colors whitespace-nowrap ${
                      isActive
                        ? "text-[#FF9530]"
                        : "text-[#555555] hover:text-[#FF9530]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Book Now Button */}
          <div className="flex items-center space-x-4">
            <Link
              href={`/hotel/${entityKey}/book`}
              className={`bg-[#FF9530] text-white transition-all duration-300 ${isScrolled ? "px-3 md:px-6 py-1.5 md:py-2" : "px-4 md:px-8 py-2 md:py-3"} rounded-md md:rounded-full font-bold text-[10px] md:text-sm uppercase tracking-wider hover:bg-[#e8851c] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0`}
            >
              BOOK NOW
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-[#1A1A1A] p-1"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black/60 z-[60] lg:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-[#1A1A1A] leading-tight">
                  {hotelName}
                </span>
                <span className="text-xs text-gray-500">{location}</span>
              </div>
              <button
                className="text-gray-500 hover:text-[#1A1A1A]"
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={28} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between py-2 text-base font-bold text-[#1A1A1A] border-b border-gray-50 hover:text-[#FF9530] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                      <ChevronRight size={18} className="text-gray-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-100">
              <Link
                href={`/hotel/${entityKey}/book`}
                className="block w-full bg-[#FF9530] text-center text-white py-4 rounded-xl font-bold uppercase tracking-wider mb-6 shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                BOOK NOW
              </Link>
              <div className="space-y-2 text-sm text-gray-600 font-medium">
                <p className="flex items-center">
                  <Phone size={16} className="mr-3 text-[#FF9530]" /> +91
                  7399888855
                </p>
                <p className="flex items-center">
                  <Mail size={16} className="mr-3 text-[#FF9530]" />{" "}
                  bookings@spodia.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HotelHeader;
