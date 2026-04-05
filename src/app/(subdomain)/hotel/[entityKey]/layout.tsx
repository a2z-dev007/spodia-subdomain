import HotelSubdomainSubnav from "@/components/hotel/HotelSubdomainSubnav";

export default async function HotelTenantLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ entityKey: string }>;
}>) {
  const { entityKey } = await params;

  return (
    <>
      <HotelSubdomainSubnav entityKey={entityKey} />
      {children}
    </>
  );
}
