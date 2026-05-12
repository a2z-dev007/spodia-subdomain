"use client";

import React, { useState, useMemo, useEffect } from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import { propertyData } from "@/lib/hotel/mockData";
import { 
  Play, Instagram, Filter, Download, X, ChevronLeft, ChevronRight, 
  Maximize2, Share2, Camera, MapPin, Eye, FileText, Smartphone
} from "lucide-react";
import Image from "next/image";
import { IMAGES } from "@/assets/images";

const categories = [
  "All", "Rooms & Suites", "Dining & Bars", "Event Venues", 
  "Spa & Wellness", "Local Attractions", "Guest Moments"
];

const filters = ["Most Popular", "Newest", "Staff Picks"];

const getGalleryItems = () => [
  { id: 1, category: "Rooms & Suites", title: "Presidential Suite Master Bedroom", src: IMAGES.bgSection.src, caption: "Spacious master bedroom with floor-to-ceiling windows and city views." },
  { id: 2, category: "Dining & Bars", title: "Rooftop Fine Dining", src: IMAGES.eventHero.src, caption: "Al-fresco dining with panoramic views of the city skyline." },
  { id: 3, category: "Event Venues", title: "Grand Ballroom Wedding Setup", src: IMAGES.herobg.src, caption: "Opulent wedding decor in our pillar-free grand ballroom." },
  { id: 4, category: "Rooms & Suites", title: "Premium Suite Living Area", src: IMAGES.bgSection.src, caption: "Modern living space with contemporary art and premium finishes." },
  { id: 5, category: "Spa & Wellness", title: "Infinity Edge Pool", src: IMAGES.eventHero.src, caption: "Our temperature-controlled rooftop pool overlooking the mountains." },
  { id: 6, category: "Local Attractions", title: "Historic City Temple", src: IMAGES.herobg.src, caption: "A 500-year-old architectural marvel located just 10 mins away." },
  { id: 7, category: "Guest Moments", title: "Sunset Yoga Session", src: IMAGES.bgSection.src, caption: "A guest enjoying a peaceful sunrise yoga session on the terrace." },
  { id: 8, category: "Dining & Bars", title: "Signature Cocktail Bar", src: IMAGES.eventHero.src, caption: "Expert mixologists crafting bespoke cocktails with local ingredients." },
  { id: 9, category: "Event Venues", title: "Corporate Conference Setup", src: IMAGES.herobg.src, caption: "State-of-the-art AV technology for your business summits." },
  { id: 10, category: "Spa & Wellness", title: "Ayurvedic Treatment Room", src: IMAGES.bgSection.src, caption: "Traditional healing therapies in a serene, eco-friendly setting." },
  { id: 11, category: "Rooms & Suites", title: "Deluxe Twin Room", src: IMAGES.eventHero.src, caption: "Perfect for business travelers or friends exploring the city." },
  { id: 12, category: "Guest Moments", title: "Traditional Welcome", src: IMAGES.herobg.src, caption: "Our warm staff welcoming guests with traditional rituals." },
];

const GalleryPage = ({ params }: { params: Promise<{ entityKey: string }> }) => {
  const { entityKey } = React.use(params);
  const { name, location } = propertyData;
  
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilter, setActiveFilter] = useState("Most Popular");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const galleryItems = useMemo(() => getGalleryItems(), []);

  const heroSlides = useMemo(() => [
    { id: 1, title: "Visual Journeys", subtitle: `Discover ${name} Through Our Lens.`, src: IMAGES.herobg.src },
    { id: 2, title: "Moments Captured", subtitle: `Experience the charm and hospitality of ${location}.`, src: IMAGES.eventHero.src },
    { id: 3, title: "Architectural Marvel", subtitle: "Where modern luxury meets traditional aesthetics.", src: IMAGES.bgSection.src },
  ], [name, location]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const filteredItems = useMemo(() => {
    return activeTab === "All" 
      ? galleryItems 
      : galleryItems.filter(item => item.category === activeTab);
  }, [activeTab, galleryItems]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": `${name} Gallery`,
    "description": `Visual gallery of ${name} showcasing rooms, event venues, and dining experiences.`,
    "image": galleryItems.map(item => item.src)
  };

  const handleNextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const handlePrevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") handleNextLightbox();
      if (e.key === "ArrowLeft") handlePrevLightbox();
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  return (
    <HotelPageShell entityKey={entityKey}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentHeroSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image 
              src={slide.src} 
              alt={slide.title} 
              fill 
              className="object-cover" 
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="max-w-[1000px]">
            <span className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white font-black uppercase tracking-[0.3em] text-xs mb-8 animate-fade-in">
              The Official Gallery
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-tight drop-shadow-2xl">
              {heroSlides[currentHeroSlide].title}
            </h1>
            <p className="text-xl md:text-3xl text-white/80 font-medium mb-12">
              {heroSlides[currentHeroSlide].subtitle}
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <button className="bg-[#FF9530] text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-4 hover:shadow-[0_20px_50px_rgba(255,149,48,0.4)] transition-all">
                Watch Video Tour <Play className="w-5 h-5 fill-current" />
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-4 hover:bg-white/20 transition-all">
                360° Virtual Tour <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
          {heroSlides.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentHeroSlide(index)}
              className={`h-2 transition-all duration-500 rounded-full ${index === currentHeroSlide ? 'w-12 bg-[#FF9530]' : 'w-4 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Categorized Photo Grid */}
      <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-8 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${activeTab === cat ? 'bg-gray-900 text-white shadow-2xl' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 p-2 bg-gray-50 rounded-[28px] border border-gray-100">
            <div className="flex items-center gap-2 px-4 text-gray-400">
              <Filter className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Filter:</span>
            </div>
            <div className="flex gap-2">
              {filters.map(f => (
                <button 
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-6 py-2 rounded-2xl text-[11px] font-black transition-all ${activeFilter === f ? 'bg-white text-[#FF9530] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item, idx) => (
            <div 
              key={item.id} 
              onClick={() => setLightboxIndex(idx)}
              className="relative overflow-hidden rounded-[40px] group cursor-pointer w-full aspect-square bg-gray-100 border border-gray-100"
              style={{ aspectRatio: '1/1' }}
            >
              <Image 
                src={item.src} 
                alt={item.title} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="bg-[#FF9530] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                    {item.category}
                  </span>
                  <h4 className="text-xl font-black text-white mb-2 leading-tight">{item.title}</h4>
                  <p className="text-white/70 text-xs font-medium line-clamp-2 mb-6">{item.caption}</p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-white font-black text-xs group/btn">
                      View Full Album <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-[#FF9530] transition-colors">
                  <Share2 className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Virtual Tour & Videos */}
      <section className="py-32 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[#FF9530] font-black uppercase tracking-[0.3em] text-xs mb-6 block">Interactive Experience</span>
              <h2 className="text-4xl md:text-7xl font-black text-white mb-10 leading-tight">Step Inside <br />From Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9530] to-[#FF610D]">Screen.</span></h2>
              <p className="text-gray-400 text-xl font-medium mb-12 leading-relaxed max-w-[500px]">
                Explore every corner of {name} with our high-definition 360° virtual tours and cinematic property highlights.
              </p>
              
              <div className="space-y-6">
                {[
                  { label: "Property Highlights Reel", time: "2:15 Mins", icon: Play },
                  { label: "Grand Wedding at The Casa", time: "5:30 Mins", icon: Camera },
                  { label: "A Day in Luxury Suites", time: "3:45 Mins", icon: Eye }
                ].map((video, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-[#FF9530] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#FF9530]/20">
                        <video.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg">{video.label}</h4>
                        <p className="text-gray-500 text-sm font-medium">{video.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/5] rounded-[64px] overflow-hidden group border border-white/10">
              <Image src={IMAGES.bgSection.src} alt="360 Virtual Tour" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-10 animate-pulse-slow">
                  <Maximize2 className="w-12 h-12 text-gray-900" />
                </div>
                <h3 className="text-4xl font-black text-white mb-6">360° Virtual Tour</h3>
                <p className="text-white/70 font-medium mb-10 max-w-[300px]">Immerse yourself in a full 3D walkthrough of our suites and amenities.</p>
                <button className="bg-white text-gray-900 px-12 py-5 rounded-2xl font-black text-lg hover:bg-[#FF9530] hover:text-white transition-all shadow-2xl">
                  Launch Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Guest-Generated Content */}
      <section className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto text-center mb-20">
          <Instagram className="w-16 h-16 text-[#FF9530] mx-auto mb-10" />
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tight">See Yourself Here.</h2>
          <p className="text-gray-500 text-xl font-medium">Tag your stories with <span className="text-gray-900 font-black">#TheGrandCasaSpodia</span> for a chance to be featured.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-[1600px] mx-auto px-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square rounded-[40px] overflow-hidden relative group cursor-pointer bg-gray-50 border border-gray-100">
              <Image src={IMAGES.bgSection.src} alt={`Guest ${i}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6">
                <Instagram className="w-8 h-8 mb-4" />
                <span className="text-sm font-black">@guest_moment_{i}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button className="bg-gray-50 border border-gray-200 px-12 py-5 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all flex items-center gap-4 mx-auto">
            Share Your Photos <Smartphone className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* 5. Downloadable Media */}
      <section className="py-24 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex-1">
            <span className="text-[#FF9530] font-black uppercase tracking-widest text-[10px] mb-6 block">Press & Media</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">High-Resolution <br />Brand Assets.</h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              Need editorial imagery or brand assets for your publication? Download our curated media kits and professional property shots.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-auto">
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#FF9530]/10 transition-colors">
                <FileText className="w-8 h-8 text-[#FF9530]" />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2">Editorial Pack</h4>
              <p className="text-gray-400 text-sm font-medium mb-8">Full property high-res images (ZIP, 450MB)</p>
              <button className="flex items-center gap-3 text-gray-900 font-black text-sm uppercase tracking-widest hover:text-[#FF9530] transition-colors">
                Download Now <Download className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#FF9530]/10 transition-colors">
                <Smartphone className="w-8 h-8 text-[#FF9530]" />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2">Social Media Kit</h4>
              <p className="text-gray-400 text-sm font-medium mb-8">Logos, colors & brand guide (ZIP, 12MB)</p>
              <button className="flex items-center gap-3 text-gray-900 font-black text-sm uppercase tracking-widest hover:text-[#FF9530] transition-colors">
                Download Now <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-6 md:p-12 animate-fade-in">
          <button 
            onClick={() => setLightboxIndex(null)}
            className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors z-[210]"
          >
            <X className="w-12 h-12" />
          </button>

          <div className="relative w-full h-full max-w-[1600px] flex items-center justify-center">
            <button 
              onClick={handlePrevLightbox}
              className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-[#FF9530] transition-all z-[210]"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <div className="relative w-full h-full">
              <Image 
                src={filteredItems[lightboxIndex].src} 
                alt={filteredItems[lightboxIndex].title} 
                fill 
                className="object-contain" 
              />
            </div>

            <button 
              onClick={handleNextLightbox}
              className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-[#FF9530] transition-all z-[210]"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </div>

          <div className="mt-12 text-center max-w-[800px]">
            <span className="bg-[#FF9530] text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 inline-block">
              {filteredItems[lightboxIndex].category}
            </span>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              {filteredItems[lightboxIndex].title}
            </h3>
            <p className="text-white/60 text-lg font-medium leading-relaxed">
              {filteredItems[lightboxIndex].caption}
            </p>
            <div className="mt-10 flex items-center justify-center gap-12 text-white/40">
              <button className="flex items-center gap-3 font-black text-sm hover:text-white transition-colors">
                <Share2 className="w-5 h-5" /> Share Image
              </button>
              <button className="flex items-center gap-3 font-black text-sm hover:text-white transition-colors">
                <Download className="w-5 h-5" /> Download Full Res
              </button>
              <div className="font-black text-sm">
                {lightboxIndex + 1} / {filteredItems.length}
              </div>
            </div>
          </div>
        </div>
      )}

    </HotelPageShell>
  );
};

export default GalleryPage;
