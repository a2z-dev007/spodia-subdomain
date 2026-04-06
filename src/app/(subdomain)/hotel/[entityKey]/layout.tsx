import HotelHeader from "@/components/hotel/layout/HotelHeader";
import HotelFooter from "@/components/hotel/layout/HotelFooter";

export default async function HotelTenantLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ entityKey: string }>;
}>) {
  const { entityKey } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      <HotelHeader entityKey={entityKey} />
      <main className="flex-grow pt-[var(--hotel-header-height,115px)] transition-all duration-300">
        {children}
      </main>
      <HotelFooter />
    </div>
  );
}
