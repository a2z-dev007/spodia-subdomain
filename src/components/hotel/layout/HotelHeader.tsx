"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone, Mail, Menu, X, ChevronRight, ChevronDown, Sparkles,
  Bed, Utensils, Calendar, MapPin, Image as ImageIcon, Star, HelpCircle,
  FileText, Info, Compass, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGES } from "@/assets/images";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
  minBreakpoint?: "lg" | "xl" | "2xl";
}

interface HotelHeaderProps {
  entityKey: string;
  hotelName?: string;
  location?: string;
}

const HotelHeader: React.FC<HotelHeaderProps> = ({
  entityKey,
  hotelName = "Mayur Gardens Resort",
  location = "Guwahati, Assam, India",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--hotel-header-height",
          `${height}px`
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
    const timer = setTimeout(updateHeight, 300);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateHeight);
      clearTimeout(timer);
    };
  }, [isScrolled, isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Consistent muted gray icon styling (No multi-color)
  const navItems: NavItem[] = [
    { label: "Overview", href: `/hotel/${entityKey}`, icon: <Info className="w-4 h-4 text-gray-400" />, minBreakpoint: "lg" },
    { label: "Rooms", href: `/hotel/${entityKey}/rooms`, icon: <Bed className="w-4 h-4 text-gray-400" />, minBreakpoint: "lg" },
    { label: "Dining", href: `/hotel/${entityKey}/dine`, icon: <Utensils className="w-4 h-4 text-gray-400" />, minBreakpoint: "lg" },
    { label: "Events", href: `/hotel/${entityKey}/events`, icon: <Calendar className="w-4 h-4 text-gray-400" />, minBreakpoint: "lg" },
    { label: "Packages", href: `/hotel/${entityKey}/tariff`, icon: <Sparkles className="w-4 h-4 text-gray-400" />, minBreakpoint: "lg" },
    { label: "Gallery", href: `/hotel/${entityKey}/gallery`, icon: <ImageIcon className="w-4 h-4 text-gray-400" />, minBreakpoint: "lg" },
    { label: "Facilities", href: `/hotel/${entityKey}/services`, icon: <ShieldCheck className="w-4 h-4 text-gray-400" />, description: "Pools, spas, gym & amenities", minBreakpoint: "xl" },
    { label: "Places to Visit", href: `/hotel/${entityKey}/explore`, icon: <Compass className="w-4 h-4 text-gray-400" />, description: "Sightseeing near property", minBreakpoint: "xl" },
    { label: "Reviews", href: `/hotel/${entityKey}/reviews`, icon: <Star className="w-4 h-4 text-gray-400" />, description: "Ratings & guest reviews", minBreakpoint: "2xl" },
    { label: "About Us", href: `/hotel/${entityKey}/about`, icon: <Info className="w-4 h-4 text-gray-400" />, description: "Our story & heritage", minBreakpoint: "2xl" },
    { label: "FAQs", href: `/hotel/${entityKey}/faqs`, icon: <HelpCircle className="w-4 h-4 text-gray-400" />, description: "Policies, check-in & FAQs", minBreakpoint: "2xl" },
    { label: "Contact", href: `/hotel/${entityKey}/contact`, icon: <MapPin className="w-4 h-4 text-gray-400" />, description: "Location, phone & directions" },
    { label: "Sitemap", href: `/hotel/${entityKey}/sitemap`, icon: <FileText className="w-4 h-4 text-gray-400" />, description: "Overview of all links" },
  ];

  const isItemActive = (href: string) => pathname === href || pathname === `${href}/`;

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-[9999] flex flex-col font-manrope transition-all duration-300"
    >
      {/* Top Contact & Offer Banner */}
      <div
        className={`bg-[#18181B] text-white transition-all duration-300 overflow-hidden ${
          isScrolled ? "max-h-0 py-0 opacity-0" : "max-h-16 py-2 opacity-100"
        } px-4 md:px-8 border-b border-white/10`}
      >
        <div className="max-w-[1440px] mx-auto flex justify-between items-center text-[11px] md:text-xs font-semibold">
          <div className="flex items-center space-x-6">
            <a
              href="tel:+917399888855"
              className="flex items-center hover:text-[#FF9530] transition-colors gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF9530]" />
              <span>+91 7399888855</span>
            </a>
            <a
              href="tel:+919999880803"
              className="hidden sm:flex items-center hover:text-[#FF9530] transition-colors gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF9530]" />
              <span>+91 9999880803</span>
            </a>
            <a
              href="mailto:bookings@spodia.com"
              className="hidden lg:flex items-center hover:text-[#FF9530] transition-colors gap-1.5 text-gray-300"
            >
              <Mail className="w-3.5 h-3.5 text-[#078ED8]" />
              <span>bookings@spodia.com</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 bg-[#FF9530]/15 text-[#FF9530] border border-[#FF9530]/30 px-3 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider">
              <Sparkles className="w-3 h-3 animate-spin" />
              Best Rate Guarantee
            </span>
            <span className="text-gray-300 text-[11px]">Direct Member Savings Available</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`bg-white/95 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? "shadow-md py-2.5" : "py-3.5"
        } px-4 md:px-8 border-b border-gray-150`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Logo + Property Identity */}
          <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
            <Link href={`/hotel/${entityKey}`} className="flex items-center">
              <Image
                src={IMAGES.logo.src}
                alt="Spodia"
                width={120}
                height={40}
                className={`w-auto transition-all duration-300 ${
                  isScrolled ? "h-7 md:h-8" : "h-8 md:h-9"
                }`}
                priority
              />
            </Link>
            <div className="hidden md:block h-7 w-[1px] bg-gray-200" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs md:text-sm xl:text-base font-black text-gray-900 leading-tight truncate">
                {hotelName}
              </span>
              <span className="text-[10px] md:text-[11px] text-gray-500 font-semibold truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FF9530] shrink-0" />
                <span className="truncate">{location}</span>
              </span>
            </div>
          </div>

          {/* Desktop Adaptive Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 relative" ref={dropdownRef}>
            {/* Always visible on lg+ (1024px+) */}
            {navItems.slice(0, 6).map((item) => {
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-bold transition-all rounded-lg ${
                    active
                      ? "text-[#FF9530] bg-orange-50/80 font-extrabold"
                      : "text-gray-700 hover:text-[#FF9530] hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="activeHeaderPill"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#FF9530] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Extended visible on xl+ (1280px+) */}
            {navItems.slice(6, 8).map((item) => {
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`hidden xl:inline-flex relative px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-bold transition-all rounded-lg ${
                    active
                      ? "text-[#FF9530] bg-orange-50/80 font-extrabold"
                      : "text-gray-700 hover:text-[#FF9530] hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="activeHeaderPill"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#FF9530] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Extended visible on 2xl+ (1536px+) */}
            {navItems.slice(8, 11).map((item) => {
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`hidden 2xl:inline-flex relative px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-bold transition-all rounded-lg ${
                    active
                      ? "text-[#FF9530] bg-orange-50/80 font-extrabold"
                      : "text-gray-700 hover:text-[#FF9530] hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="activeHeaderPill"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#FF9530] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Smart Overflow "More..." Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs xl:text-sm font-bold transition-all rounded-lg ${
                  isMoreDropdownOpen
                    ? "text-[#078ED8] bg-blue-50/80 font-extrabold"
                    : "text-gray-700 hover:text-[#078ED8] hover:bg-gray-50"
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMoreDropdownOpen ? "rotate-180 text-[#078ED8]" : "text-gray-400"
                  }`}
                />
              </button>

              {/* Dynamic Dropdown Panel (Row / Column Grid for Desktop) */}
              <AnimatePresence>
                {isMoreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-[560px] bg-white rounded-2xl shadow-2xl border border-gray-150 p-4 z-50 divide-y divide-gray-100"
                  >
                    <div className="pb-3 px-1 flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                        More Property Pages
                      </span>
                      <span className="text-[10px] font-bold text-[#FF9530] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                        Explore &amp; Info
                      </span>
                    </div>

                    <div className="pt-3 grid grid-cols-2 gap-2">
                      {navItems.slice(6).map((item) => {
                        const active = isItemActive(item.href);
                        const hideClass =
                          item.minBreakpoint === "xl"
                            ? "xl:hidden"
                            : item.minBreakpoint === "2xl"
                            ? "2xl:hidden"
                            : "";

                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMoreDropdownOpen(false)}
                            className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all ${hideClass} ${
                              active
                                ? "bg-orange-50/80 text-[#FF9530] font-extrabold border-orange-200"
                                : "hover:bg-orange-50/40 hover:border-orange-200 border-gray-100/70 text-gray-800"
                            }`}
                          >
                            <div className={`p-2 rounded-lg bg-gray-100/80 shrink-0 mt-0.5 ${active ? "text-[#FF9530]" : "text-gray-400"}`}>
                              {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-extrabold leading-tight truncate">
                                {item.label}
                              </p>
                              {item.description && (
                                <p className="text-[10px] text-gray-500 font-medium leading-tight line-clamp-1 mt-0.5">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Book Now Button + Mobile Menu Trigger */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href={`/hotel/${entityKey}/book`}
              className={`bg-gradient-to-r from-[#FF9530] to-[#FF8000] text-white font-black text-xs md:text-sm uppercase tracking-wider rounded-xl md:rounded-full transition-all duration-300 shadow-md hover:shadow-orange-500/25 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                isScrolled ? "px-4 md:px-5 py-2" : "px-5 md:px-6 py-2.5"
              }`}
            >
              Book Now
            </Link>

            <button
              type="button"
              className="lg:hidden text-gray-800 p-2 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer Overlay (High z-index to overlay FABs) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/65 z-[99999] lg:hidden backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-md bg-white z-[100000] lg:hidden shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-base font-black text-gray-900 truncate">
                    {hotelName}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#FF9530]" />
                    {location}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="grid grid-cols-1 gap-1">
                  {navItems.map((item) => {
                    const active = isItemActive(item.href);
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between p-3 rounded-xl font-bold text-sm transition-all ${
                          active
                            ? "bg-orange-50 text-[#FF9530] font-extrabold border border-orange-200"
                            : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={active ? "text-[#FF9530]" : "text-gray-400"}>
                            {item.icon}
                          </span>
                          {item.label}
                        </span>
                        <ChevronRight size={16} className="text-gray-300" />
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-3">
                <Link
                  href={`/hotel/${entityKey}/book`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-[#FF9530] to-[#FF8000] text-center text-white py-3.5 rounded-xl font-black uppercase tracking-wider shadow-lg shadow-orange-500/20 text-sm"
                >
                  BOOK NOW
                </Link>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-gray-700 pt-1">
                  <a
                    href="tel:+917399888855"
                    className="flex items-center justify-center gap-1.5 p-2 bg-white rounded-lg border border-gray-200 hover:border-[#FF9530]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#FF9530]" />
                    Call Hotel
                  </a>
                  <a
                    href={`/hotel/${entityKey}/contact`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 p-2 bg-white rounded-lg border border-gray-200 hover:border-[#078ED8]"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#078ED8]" />
                    Location
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default HotelHeader;
