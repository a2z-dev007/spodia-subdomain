import React from "react";
import { Star, ShieldCheck, Trophy, Search } from "lucide-react";
import HotelHeroPremium from "./HotelHeroPremium";

interface ReviewHeroProps {
  hotelName: string;
}

const ReviewHero = ({ hotelName }: ReviewHeroProps) => {
  return (
    <HotelHeroPremium 
      pillIcon={<Trophy className="w-5 h-5" />}
      pillText="Guest Choice Award 2024"
      backgroundImage="/images/hotels/banner2.jpg"
      title={
        <>
          See What Our Guests Love <br/> 
          About <span className="text-[#FF9530]">{hotelName}</span>.
        </>
      }
      subtitle="4.8/5 Stars · 1,200+ Verified Reviews · Real Guest Experiences."
      badges={[
        { icon: <ShieldCheck className="w-5 h-5" />, text: "TripAdvisor Excellence Award" },
        { icon: <Search className="w-5 h-5" />, text: "Google Reviews 4.7/5" },
        { icon: <ShieldCheck className="w-5 h-5" />, text: "Free Cancellation" },
      ]}
    />
  );
};

export default ReviewHero;
