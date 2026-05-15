import React from "react";
import Link from "next/link";

const HotelFooter = () => {
  // Generate data for 540 links
  // 6 rows, each row has 6 headings, each heading has 15 links
  const footerData = [
    // Row 1
    {
      headings: [
        { title: "Other Hotels", links: Array.from({ length: 15 }, (_, i) => `Other Hotel ${i + 1}`) },
        { title: "Nearby Hotels", links: Array.from({ length: 15 }, (_, i) => `Nearby Hotel ${i + 1}`) },
        { title: "Nearby City Hotels", links: Array.from({ length: 15 }, (_, i) => `City Hotel ${i + 1}`) },
        { title: "Best Hotels in Guwahati", links: Array.from({ length: 15 }, (_, i) => `Best Hotel ${i + 1}`) },
        { title: "Top Rated Resorts", links: Array.from({ length: 15 }, (_, i) => `Top Resort ${i + 1}`) },
        { title: "Luxury Stays", links: Array.from({ length: 15 }, (_, i) => `Luxury Stay ${i + 1}`) },
      ],
    },
    // Row 2
    {
      headings: [
        { title: "Hotels by Category", links: Array.from({ length: 15 }, (_, i) => `Category ${i + 1}`) },
        { title: "Hotels by Chains", links: Array.from({ length: 15 }, (_, i) => `Chain ${i + 1}`) },
        { title: "Hotels by City", links: Array.from({ length: 15 }, (_, i) => `City ${i + 1}`) },
        { title: "Hotels by Uniqueness", links: Array.from({ length: 15 }, (_, i) => `Unique ${i + 1}`) },
        { title: "Hotels by Facilities", links: Array.from({ length: 15 }, (_, i) => `Facility ${i + 1}`) },
        { title: "Budget Friendly", links: Array.from({ length: 15 }, (_, i) => `Budget ${i + 1}`) },
      ],
    },
    // Row 3
    {
      headings: [
        { title: "Boutique Hotels", links: Array.from({ length: 15 }, (_, i) => `Boutique ${i + 1}`) },
        { title: "Business Hotels", links: Array.from({ length: 15 }, (_, i) => `Business ${i + 1}`) },
        { title: "Airport Hotels", links: Array.from({ length: 15 }, (_, i) => `Airport ${i + 1}`) },
        { title: "Beach Resorts", links: Array.from({ length: 15 }, (_, i) => `Beach ${i + 1}`) },
        { title: "Hill Station Hotels", links: Array.from({ length: 15 }, (_, i) => `Hill Station ${i + 1}`) },
        { title: "Heritage Hotels", links: Array.from({ length: 15 }, (_, i) => `Heritage ${i + 1}`) },
      ],
    },
    // Row 4
    {
      headings: [
        { title: "Trending Destinations", links: Array.from({ length: 15 }, (_, i) => `Trending ${i + 1}`) },
        { title: "Weekend Getaways", links: Array.from({ length: 15 }, (_, i) => `Weekend ${i + 1}`) },
        { title: "Couple Friendly", links: Array.from({ length: 15 }, (_, i) => `Couple ${i + 1}`) },
        { title: "Family Resorts", links: Array.from({ length: 15 }, (_, i) => `Family ${i + 1}`) },
        { title: "Pet Friendly", links: Array.from({ length: 15 }, (_, i) => `Pet ${i + 1}`) },
        { title: "Spa & Wellness", links: Array.from({ length: 15 }, (_, i) => `Spa ${i + 1}`) },
      ],
    },
    // Row 5
    {
      headings: [
        { title: "Hotels in North India", links: Array.from({ length: 15 }, (_, i) => `North ${i + 1}`) },
        { title: "Hotels in South India", links: Array.from({ length: 15 }, (_, i) => `South ${i + 1}`) },
        { title: "Hotels in East India", links: Array.from({ length: 15 }, (_, i) => `East ${i + 1}`) },
        { title: "Hotels in West India", links: Array.from({ length: 15 }, (_, i) => `West ${i + 1}`) },
        { title: "Hotels in Central India", links: Array.from({ length: 15 }, (_, i) => `Central ${i + 1}`) },
        { title: "Popular States", links: Array.from({ length: 15 }, (_, i) => `State ${i + 1}`) },
      ],
    },
    // Row 6
    {
      headings: [
        { title: "Quick Links", links: ["About Us", "Contact Us", "Careers", "Reviews", "FAQs", "Sitemap", "Terms", "Privacy", "Refunds", "Blogs", "Gallery", "Services", "Rooms", "Dining", "Events"] },
        { title: "Top Cities", links: Array.from({ length: 15 }, (_, i) => `City ${i + 1}`) },
        { title: "Best Deals", links: Array.from({ length: 15 }, (_, i) => `Deal ${i + 1}`) },
        { title: "Membership", links: Array.from({ length: 15 }, (_, i) => `Member ${i + 1}`) },
        { title: "Partner With Us", links: Array.from({ length: 15 }, (_, i) => `Partner ${i + 1}`) },
        { title: "Follow Us", links: ["Facebook", "Instagram", "Twitter", "LinkedIn", "YouTube", "Pinterest", "Snapchat", "TikTok", "Reddit", "Medium", "Quora", "GitHub", "Behance", "Dribbble", "WhatsApp"] },
      ],
    },
  ];

  return (
    <footer className="bg-[#0A0A0A] text-white pt-24 pb-12 px-6 w-full font-manrope">
      <div className="max-w-[1440px] mx-auto">
        {footerData.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16 last:mb-0 border-b border-white/5 pb-12 last:border-0 last:pb-0">
            {row.headings.map((heading, headingIndex) => (
              <div key={headingIndex} className="flex flex-col gap-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-[#FF9530] mb-2">{heading.title}</h4>
                <div className="flex flex-col gap-2">
                  {heading.links.map((link, linkIndex) => (
                    <Link 
                      key={linkIndex} 
                      href="#" 
                      className="text-[11px] font-medium text-gray-500 hover:text-[#FF9530] transition-colors duration-200 truncate"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
        
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-black tracking-tighter">SPODIA<span className="text-[#FF9530]">.</span></span>
            <p className="text-xs font-bold text-gray-600">© {new Date().getFullYear()} Spodia Hotels & Resorts. All Rights Reserved.</p>
          </div>
          <div className="flex gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HotelFooter;
