import HotelHeader from "@/components/hotel/layout/HotelHeader";
import HotelFooter from "@/components/hotel/HotelFooter";
import HotelFABs from "@/components/hotel/HotelFABs";
import { propertyData } from "@/lib/hotel/mockData";

export default async function HotelTenantLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ entityKey: string }>;
}>) {
  const { entityKey } = await params;
  const { name, location } = propertyData;

  return (
    <div className="flex flex-col min-h-screen font-manrope">
      <HotelHeader entityKey={entityKey} hotelName={name} location={location} />
      <main className="flex-grow pt-[var(--hotel-header-height,115px)] transition-all duration-300">
        {children}
      </main>
      <HotelFooter />
      <HotelFABs />
    </div>
  );
}
