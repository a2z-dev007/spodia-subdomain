import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/hero-section";
import PropertyTypes from "@/components/home/PropertyTypes";
import HomeDiscoverySections from "@/components/home/HomeDiscoverySections";
import DestinationSearchGrid from "@/components/home/DestinationSearchGrid";
import HomeEditorialTriptych from "@/components/home/HomeEditorialTriptych";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spodia – Book Hotels, Homestays & Stays | Official Site",
  description:
    "Find and book verified hotels, homestays, and budget stays with Spodia. Best prices, instant confirmation, 24×7 support.",
  robots: "index, follow",
};

export default function MarketingHomePage() {
  return (
    <>
      <div className="min-h-screen">
        <div id="home" className="relative">
          <Header />
          <div id="search" style={{ paddingTop: 'var(--header-height)' }}>
            <HeroSection />
          </div>
        </div>

        <PropertyTypes />
        <HomeDiscoverySections />
        <DestinationSearchGrid />
        <HomeEditorialTriptych />
      </div>
    </>
  );
}
