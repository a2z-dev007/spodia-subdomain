import React from "react";
import { Star, Quote, ArrowRight } from "lucide-react";

const BookingReviews = () => {
  const reviews = [
    {
      name: "Riya",
      location: "Delhi",
      text: "Smooth booking and great value! The direct rate was significantly lower than other sites.",
      rating: 5,
    },
    {
      name: "Arjun",
      location: "Mumbai",
      text: "The discounted rate was unbeatable! Instant confirmation made the whole process stress-free.",
      rating: 5,
    },
    {
      name: "Sarah",
      location: "London",
      text: "Flexible payment options were a lifesaver. Loved the transparency in pricing.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-gray-50 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
           <div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Trusted by Thousands</h2>
              <p className="text-gray-600 text-xl font-medium">Read why travelers prefer booking directly with us.</p>
           </div>
           <button className="flex items-center gap-3 bg-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-sm">
              Read 500+ Verified Reviews
              <ArrowRight className="w-4 h-4" />
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group">
              <Quote className="absolute top-10 right-10 w-12 h-12 text-gray-50 group-hover:text-orange-50 transition-colors" />
              <div className="flex gap-1 mb-6">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#FF9530] text-[#FF9530]" />
                ))}
              </div>
              <p className="text-gray-700 font-medium text-lg leading-relaxed mb-8 relative z-10 italic">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-black text-[#FF9530]">
                  {review.name[0]}
                </div>
                <div>
                  <h4 className="font-black text-gray-900">{review.name}</h4>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookingReviews;
