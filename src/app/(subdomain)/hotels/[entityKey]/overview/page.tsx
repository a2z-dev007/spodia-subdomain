import React from "react";
import HotelPageShell from "@/components/hotel/HotelPageShell";
import HotelHeroSimple from "@/components/hotel/HotelHeroSimple";
import HotelHighlights from "@/components/hotel/sections/HotelHighlights";
import HotelLocationContent from "@/components/hotel/sections/HotelLocationContent";
import StaticDataBadge from "@/components/common/StaticDataBadge";
import { fetchHotelDetails } from "@/lib/api/hotelDetails";
import { buildHotelSegmentMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ entityKey: string }> };

export async function generateMetadata({ params }: Props) {
  const { entityKey } = await params;
  return buildHotelSegmentMetadata({ entityKey, segment: "overview" });
}

export default async function OverviewPage({ params }: Props) {
  const { entityKey } = await params;
  const hotelData = await fetchHotelDetails(entityKey);

  const name = hotelData?.name || entityKey.replace(/-/g, " ");

  return (
    <HotelPageShell entityKey={entityKey}>
      <HotelHeroSimple
        title={`${name} – Overview`}
        subtitle="Property details, policies, rules, and stay highlights"
      />

      {/* Property Overview & Description */}
      <section className="py-16 px-6 max-w-[1200px] mx-auto w-full">
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-6">About {name}</h2>
          <p className="text-gray-600 text-lg leading-relaxed font-medium mb-8">
            {hotelData?.description || `${name} offers hospitality in ${hotelData?.city_name || 'prime location'}.`}
          </p>

          {/* Rules & Policies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Check-in & Policies</h3>
              <ul className="space-y-3 text-sm text-gray-600 font-medium">
                <li><span className="font-bold text-gray-800">Check-in:</span> {hotelData?.check_in || "12:00 PM"}</li>
                <li><span className="font-bold text-gray-800">Check-out:</span> {hotelData?.check_out || "11:00 AM"}</li>
                {hotelData?.check_in_policies && (
                  <li><span className="font-bold text-gray-800">Policy:</span> {hotelData.check_in_policies}</li>
                )}
                {hotelData?.documents_required_for_check_in && (
                  <li><span className="font-bold text-gray-800">ID Required:</span> Government photo ID is required.</li>
                )}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold text-gray-900">House Rules</h3>
                {!hotelData?.other_rules && <StaticDataBadge text="static data - need this data on the api" />}
              </div>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                {hotelData?.other_rules || "Guests are requested to maintain decorum and respect property guidelines during their stay."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <HotelHighlights hotelData={hotelData} />
      <HotelLocationContent hotelData={hotelData} />
    </HotelPageShell>
  );
}
