'use client';

import { useState, useRef, useEffect } from "react";
import { IoGolf } from "react-icons/io5";
import { useSwipeable } from "react-swipeable";
import Modal from "@/components/ui/Modal";
import { IMAGE_BASE_URL } from "@/lib/api/apiClient";
import Image from "next/image";
import { Star } from "lucide-react";

// Carousel images
const carouselImages = [
  {
    image: "https://images.unsplash.com/photo-1619780086319-2d26172e3a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwc3dpbW1pbmclMjBwb29sJTIwaG90ZWx8ZW58MXx8fHwxNzU3NzUwNjA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Outdoor swimming pool"
  },
  {
    image: "https://images.unsplash.com/photo-1610402601271-5b4bd5b3eba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBtYXNzYWdlJTIwaG90ZWx8ZW58MXx8fHwxNzU3NzUwNjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Spa"
  },
  {
    image: "https://images.unsplash.com/photo-1660557989710-1a91e7e89d1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzJTIwaG90ZWx8ZW58MXx8fHwxNzU3NzUwNjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Gym"
  },
  {
    image: "https://images.unsplash.com/photo-1667029187077-ecc67da6ba6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjBuYXR1cmUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NzUwNjE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Hiking"
  },
  {
    image: "https://images.unsplash.com/photo-1543539571-2d88da875d21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZGluaW5nJTIwaG90ZWx8ZW58MXx8fHwxNzU3NzUwOTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Restaurant"
  },
  {
    image: "https://images.unsplash.com/photo-1505845753232-f74a87b62db6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGNvbmZlcmVuY2UlMjByb29tJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzU3NzUwOTA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Conference room"
  },
  {
    image: "https://images.unsplash.com/photo-1671798436311-a8f3c1d269bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwaG90ZWwlMjByZXNvcnR8ZW58MXx8fHwxNzU3NzUwOTA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Golf Course"
  },
  {
    image: "https://images.unsplash.com/photo-1712063680618-c1883afb1a5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJhciUyMGxvdW5nZXxlbnwxfHx8fDE3NTc3NTA5MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Bar"
  },
  {
    image: "https://images.unsplash.com/photo-1666196378912-eb6b7c3db693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBjb3VydCUyMHJlc29ydHxlbnwxfHx8fDE3NTc3NTA5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Tennis court"
  }
];

// Icon Components
function GolfIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.5 2L21 7.5v13c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1V7.5L12.5 2z" />
    </svg>
  );
}

function SpaIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" className="w-6 h-6 text-[#4a4a4a]" fill="currentColor"><path d="M360-240v-280h360q66 0 113 47t47 113v120H360Zm80-200v120-120ZM80-120v-80h800v80H80Zm120-120q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T240-360q0-17-11.5-28.5T200-400q-17 0-28.5 11.5T160-360q0 17 11.5 28.5T200-320Zm240 0h360v-40q0-33-23.5-56.5T720-440H440v120Zm-240-40Zm105-240q5-11 6.5-20.5T313-640q0-19-8.5-36.5T279-715q-20-25-30-48.5T239-816q0-14 2-29.5t6-34.5h80q-4 17-5.5 30.5T320-825q0 20 6.5 34.5T348-758q22 26 32.5 51t10.5 54q0 12-1.5 25.5T385-600h-80Zm160 0q5-11 6.5-20.5T473-640q0-19-8.5-36.5T439-715q-20-25-29.5-48.5T400-816q0-14 2-29.5t6-34.5h80q-4 17-6 30.5t-2 24.5q0 20 7 34.5t22 32.5q22 26 32 51t10 54q0 12-1.5 25.5T545-600h-80Zm162 0q5-11 6.5-20.5T635-640q0-19-8.5-36.5T601-715q-20-25-29.5-48.5T562-816q0-14 2-29.5t6-34.5h80q-4 17-6 30.5t-2 24.5q0 20 7 34.5t22 32.5q22 26 32 51t10 54q0 12-1.5 25.5T707-600h-80Z" /></svg>
  );
}

function ParkingIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm-1 8h-2V7h2c1.1 0 2 .9 2 2s-.9 2-2 2z" />
    </svg>
  );
}

function SwimmingIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M2 19.5c.55 0 1.04-.23 1.38-.6.35.37.83.6 1.38.6s1.04-.23 1.38-.6c.35.37.83.6 1.38.6s1.04-.23 1.38-.6c.35.37.83.6 1.38.6s1.04-.23 1.38-.6c.35.37.83.6 1.38.6s1.04-.23 1.38-.6c.35.37.83.6 1.38.6s1.04-.23 1.38-.6c.35.37.83.6 1.38.6s1.04-.23 1.38-.6c.35.37.83.6 1.38.6v1.5c-.55 0-1.04-.23-1.38-.6-.35.37-.83.6-1.38.6s-1.04-.23-1.38-.6c-.35.37-.83.6-1.38.6s-1.04-.23-1.38-.6c-.35.37-.83.6-1.38.6s-1.04-.23-1.38-.6c-.35.37-.83.6-1.38.6s-1.04-.23-1.38-.6c-.35.37-.83.6-1.38.6s-1.04-.23-1.38-.6c-.35.37-.83.6-1.38.6V19.5z" />
    </svg>
  );
}

function HikingIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L9 8.3V13h2V9.6l-.2-.7z" />
    </svg>
  );
}

function GymIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z" />
    </svg>
  );
}

function BarIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11 16.5h2V22h-2zm-2-1.5v-2.38L5.74 8.65c-.45-.45-.74-1.1-.74-1.79s.29-1.34.74-1.79L9 1.81 10.41 3.2 7.15 6.47c-.45.45-.45 1.18 0 1.63L10.5 11.5h3L17 8c.45-.45.45-1.18 0-1.63L13.74 3.2 15.15 1.81l3.26 3.26c.45.45.74 1.1.74 1.79s-.29 1.34-.74 1.79L15 12.62V15h-6z" />
    </svg>
  );
}

function RestaurantIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
    </svg>
  );
}

function ConferenceIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ServiceIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
    </svg>
  );
}

function BusinessIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
    </svg>
  );
}

function CurrencyIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
    </svg>
  );
}

function LuggageIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17 6h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2 0 .55.45 1 1 1s1-.45 1-1h6c0 .55.45 1 1 1s1-.45 1-1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9.5 18H8V9h1.5v9zm3.25 0h-1.5V9h1.5v9zm3.25 0H14V9h1.5v9zm.5-12h-1V4h1v2z" />
    </svg>
  );
}

function LaundryIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.17 16.83c1.56 1.56 4.1 1.56 5.66 0 1.56-1.56 1.56-4.1 0-5.66l-5.66 5.66zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83z" />
    </svg>
  );
}

function DeskIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2z" />
    </svg>
  );
}

function MassageIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
  );
}

function NightclubIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}

function ChildcareIcon() {
  return (
    <svg className="w-6 h-6 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.5 10.5c.9 0 1.73-.37 2.32-.96.6-.6.96-1.42.96-2.32s-.37-1.73-.96-2.32-.97-.96-2.32-.96-1.73.37-2.32.96-.96 1.42-.96 2.32.37 1.73.96 2.32c.59.59 1.42.96 2.32.96zM22 22H2c0-3.93 3.07-7 7-7 1.03 0 2.01.25 2.87.69.86-.44 1.84-.69 2.87-.69 3.93 0 7 3.07 7 7z" />
    </svg>
  );
}

interface AmenityItemProps {
  icon: React.ReactNode;
  name: string;
  badge?: string;
  badgeColor?: string;
}

export function AmenityItem({ icon, name, badge, badgeColor }: AmenityItemProps) {
  return (
    <div className="flex items-center gap-2 ">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="text-[#4a4a4a] text-[14px] leading-[18px] ">
        {name}
      </span>
      {badge && (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-medium ${badgeColor === 'orange'
            ? 'bg-orange-100 text-orange-600 border border-orange-300'
            : 'bg-green-100 text-green-600 border border-green-300'
            }`}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

interface CarouselCardProps {
  image: string;
  title: string;
}

function CarouselCard({ image, title }: CarouselCardProps) {
  return (
    <div className="relative rounded-[16px] overflow-hidden flex-shrink-0 w-[287px] h-[168px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <h3 className="text-white text-[18px] font-['Lato:Bold'] leading-[normal]">
          {title}
        </h3>
      </div>
    </div>
  );
}

interface ServicesCarouselProps {
  services?: any[];
  onImageClick?: (images: string[], index: number) => void;
}

function ServicesCarousel({ services, onImageClick }: ServicesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Use API data only (no fallback to static images)
  const displayServices = services && services.length > 0 ? services : [];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -303, behavior: 'smooth' }); // 287px card width + 16px gap
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 303, behavior: 'smooth' }); // 287px card width + 16px gap
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: scrollRight,
    onSwipedRight: scrollLeft,
    trackMouse: true
  });

  const handleCardClick = (service: any) => {
    if (onImageClick && service.images && service.images.length > 0) {
      const imageUrls = service.images.map((img: any) => img.file);
      onImageClick(imageUrls, 0);
    }
  };

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white [-webkit-tap-highlight-color:transparent]"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white [-webkit-tap-highlight-color:transparent]"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Carousel Container */}
      <div
        {...handlers}
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
          {displayServices.map((service: any, index: number) => {
            // Get the image URL or use placeholder
            const imageUrl = service.images?.[0]?.file || service.image || '/placeholder.jpg';

            return (
              <div
                key={index}
                onClick={() => handleCardClick(service)}
                className="relative rounded-[16px] overflow-hidden flex-shrink-0 w-[287px] h-[168px] cursor-pointer hover:opacity-90 transition-opacity group"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Image count badge */}
                {service.images && service.images.length > 1 && (
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {service.images.length}
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-[18px] font-['Lato:Bold'] leading-[normal] mb-1">
                    {service.serviceType || service.title}
                  </h3>
                  {/* {service.name && service.name !== service.serviceType && (
                  <p className="text-white/90 text-[12px] truncate">
                    {service.name}
                  </p>
                )} */}
                  {service.openTime && service.closeTime && (
                    <p className="text-white/80 text-[11px] mt-1">
                      {service.openTime} - {service.closeTime}
                    </p>
                  )}
                </div>
              </div>
            )
          }
          )}
        </div>
      </div>
    </div>
  );
}

interface AmenityData {
  icon: React.ReactNode;
  name: string;
  badge?: string;
  badgeColor?: string;
}

interface ServicesAmenitiesProps {
  hotelData?: any;
  onImageClick?: (images: string[], index: number) => void;
}

export default function ServicesAmenities({ hotelData, onImageClick }: ServicesAmenitiesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Early return if hotelData is not available yet
  if (!hotelData) {
    return (
      <div className="bg-white rounded-[20px] border border-gray-200 w-full mx-auto p-6 md:p-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading services...</span>
        </div>
      </div>
    );
  }

  // Map amenities from hotel data
  const getAmenityIcon = (name: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Air Conditioning': <SwimmingIcon />,
      'Wifi': <WifiIcon />,
      'Mini Fridge': <CarIcon />,
      'Bathtub': <SpaIcon />,
      'BBQ Grill': <RestaurantIcon />,
      'Room service': <ServiceIcon />,
      'Telephone': <DeskIcon />,
      'TV': <BusinessIcon />,
      'Jetspray': <SpaIcon />,
      'Kettle': <RestaurantIcon />,
      'Mineral Water': <RestaurantIcon />,
      'Mini Bar': <BarIcon />,
      'Housekeeping': <LaundryIcon />,
      'Hairdryer': <SpaIcon />,
      'Heater': <SwimmingIcon />,
      'Hot & Cold Water': <SpaIcon />,
      'Jaccuzi': <SpaIcon />,
      'Fireplace': <RestaurantIcon />,
      'Geyser': <SpaIcon />,
      'Hammam': <SpaIcon />,
      'Induction': <RestaurantIcon />,
      'Ironing': <LaundryIcon />,
      'Microwave': <RestaurantIcon />,
      'Mosquito Net': <ServiceIcon />,
      'Sofa': <BusinessIcon />,
      'Toiletries': <LaundryIcon />,
      'Western Toilet Seat': <SpaIcon />,
      'Blanket': <ServiceIcon />,
      'Charging points': <BusinessIcon />,
      'Child safety socket covers': <ChildcareIcon />,
      'Closet': <LuggageIcon />,
      'Cook & Butler Service': <RestaurantIcon />,
      'Cooking Basics': <RestaurantIcon />,
      'Couch': <BusinessIcon />,
      'Cupboards with locks': <LuggageIcon />,
      'Dental Kit': <SpaIcon />,
      'Dining Area': <RestaurantIcon />,
      'Dishes and Silverware': <RestaurantIcon />,
      'Dishwasher': <RestaurantIcon />,
      'Ensuite Bay Bathroom': <SpaIcon />,
      'Fan': <SwimmingIcon />,
      'Fireplace Guards': <RestaurantIcon />,
      'Hypoallergenic Bedding': <ServiceIcon />,
      'In Room dining': <RestaurantIcon />,
      'Limited duration': <ServiceIcon />,
      'Shaving Mirror': <SpaIcon />,
      'Bidet': <SpaIcon />,
      'Blackout curtains': <ServiceIcon />,
      'Bubble Bath': <SpaIcon />,
      'Center Table': <BusinessIcon />,
      'Chair': <BusinessIcon />,
      'Dining Table': <RestaurantIcon />
    };
    return iconMap[name] || <ServiceIcon />;
  };

  const hotelAmenities = hotelData?.facilitiesDetails?.map((facility: any) => {
    // Ensure facility.name is a string and not undefined/null
    const facilityName = facility?.name || 'Unknown Facility';

    return {
      icon: facility.image ? (
        <div className="w-5 h-5 flex-shrink-0">
          <Image
            src={`${IMAGE_BASE_URL}${facility.image}`}
            alt={facilityName}
            width={20}
            height={20}
            className="w-5 h-5 object-contain"
            onError={(e) => {
              // Fallback to star icon if image fails to load
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = '<svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
              }
            }}
          />
        </div>
      ) : <Star className="w-5 h-5 text-gray-500" />,
      name: facilityName,
      badge: facilityName.toLowerCase().includes('spa') || facilityName.toLowerCase().includes('massage') ? "Additional charge" : undefined,
      badgeColor: facilityName.toLowerCase().includes('spa') || facilityName.toLowerCase().includes('massage') ? "orange" : undefined
    };
  }) || [];

  const defaultAmenities = [
    { icon: <IoGolf />, name: "Golf Course" },
    { icon: <SwimmingIcon />, name: "Outdoor swimming pool" },
    { icon: <HikingIcon />, name: "Hiking" },
    { icon: <SpaIcon />, name: "Spa", badge: "Additional charge", badgeColor: "orange" },
    { icon: <MassageIcon />, name: "Massage room" },
    { icon: <GymIcon />, name: "Gym" },
    { icon: <ParkingIcon />, name: "Private parking", badge: "Free", badgeColor: "green" },
    { icon: <CarIcon />, name: "Car rentals" },
    { icon: <BarIcon />, name: "Bar" },
    { icon: <NightclubIcon />, name: "Nightclub" },
    { icon: <RestaurantIcon />, name: "Restaurant" },
    { icon: <ConferenceIcon />, name: "Conference room", badge: "Additional charge", badgeColor: "orange" },
    { icon: <BusinessIcon />, name: "Business center" },
    { icon: <ChildcareIcon />, name: "Childcare service", badge: "Additional charge", badgeColor: "orange" },
    { icon: <ServiceIcon />, name: "Tour and ticket booking service" },
    { icon: <CurrencyIcon />, name: "Currency exchange" },
    { icon: <DeskIcon />, name: "24-hour front desk" },
    { icon: <WifiIcon />, name: "Wi-Fi in public areas" },
    { icon: <LuggageIcon />, name: "Luggage storage" },
    { icon: <LaundryIcon />, name: "Laundry room" }
  ];

  // Filter out any invalid amenities and ensure all have valid names and icons
  const validHotelAmenities = hotelAmenities.filter((amenity: AmenityData) =>
    amenity &&
    typeof amenity.name === 'string' &&
    amenity.name.trim() !== '' &&
    amenity.icon !== null &&
    amenity.icon !== undefined
  );

  const amenities = validHotelAmenities.length > 0 ? validHotelAmenities : defaultAmenities;

  // Mobile: Show 2 items initially, Desktop: Show 8 items initially (2 rows of 4)
  const initialItemCount = isMobile ? 2 : 8;
  const displayedAmenities = showAllAmenities ? amenities : amenities.slice(0, initialItemCount);
  const hasMoreAmenities = amenities.length > initialItemCount;

  return (
    <div className="bg-white rounded-[20px] border border-gray-200 w-full mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-bold text-black text-[24px] leading-[normal] mb-1">
          Services & Amenities
        </h2>
        <p className="text-[#4a44a4a] text-[18px] leading-[normal]">
          Most popular business facilities
        </p>
      </div>

      {/* Amenities Grid */}
      <div className="grid md:grid-cols-4 grid-cols-1 gap-y-3 gap-x-4 mb-4 md:w-[90%]">
        {displayedAmenities.map((amenity: AmenityData, index: number) => (
          <AmenityItem
            key={index}
            icon={amenity.icon}
            name={amenity.name}
            badge={amenity.badge}
            badgeColor={amenity.badgeColor}
          />
        ))}
      </div>

      {/* Show More/Less Button - Always use Modal */}
      {hasMoreAmenities && (
        <div className="mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-6 text-orange-500 hover:text-orange-600 font-medium text-sm border border-orange-200 hover:border-orange-300 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Show All Amenities ({amenities.length - initialItemCount} more)
          </button>
        </div>
      )}

      {/* Amenities Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSearchTerm("");
        }}
        title="All Amenities"
        maxWidth="2xl"
      >
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search amenities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
          {amenities
            .filter((amenity: AmenityData) => amenity.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((amenity: AmenityData, index: number) => (
              <AmenityItem
                key={index}
                icon={amenity.icon}
                name={amenity.name}
                badge={amenity.badge}
                badgeColor={amenity.badgeColor}
              />
            ))}
          {amenities.filter((amenity: AmenityData) => amenity.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No amenities found matching "{searchTerm}"
            </div>
          )}
        </div>
      </Modal>

      {/* Services Carousel - Only show if there are services from API */}
      {((hotelData?.services && hotelData.services.length > 0) || (hotelData?.servicedetails && hotelData.servicedetails.length > 0)) && (
        <>
          <div className="mb-4 mt-8">
            <h3 className="font-bold text-black text-[20px] leading-[normal]">
              Special Services
            </h3>
            <p className="text-gray-600 text-[14px] mt-1">
              Click on any service to view all photos
            </p>
          </div>
          <ServicesCarousel services={hotelData?.services || hotelData?.servicedetails} onImageClick={onImageClick} />
        </>
      )}
    </div>
  );
}