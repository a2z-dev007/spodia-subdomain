import React from "react";
import { Leaf, Heart, Trophy } from "lucide-react";

export type PropertyType = "Hotel" | "Resort" | "Homestay" | "B&B";

export const propertyData = {
  name: "The Nandan",
  type: "Hotel" as PropertyType,
  location: "Guwahati",
  established: "1995",
  story: "boutique hospitality venture with a vision to blend modern comfort with traditional warmth",
  uniqueOffering: "a seamless blend of luxury and local heritage",
  values: [
    { id: 1, title: "Sustainability", icon: "Leaf", description: "Zero-Waste Practices · Solar-Powered · Local Sourcing." },
    { id: 2, title: "Community", icon: "Heart", description: "Supporting Local Artisans · Cultural Workshops." },
    { id: 3, title: "Excellence", icon: "Trophy", description: "TripAdvisor Excellence Award Winner · 100% Guest Satisfaction." }
  ],
  accommodations: {
    hotel: "Luxury Rooms · Suites · Private Villas",
    homestay: "Cozy Rooms · Shared Common Areas · Garden Access"
  },
  amenities: ["Free WiFi", "Parking", "Air Conditioning", "Spa", "Pool", "Restaurant", "Event Spaces", "Airport Transfers"],
  experiences: {
    resort: "Guided Nature Walks · Cooking Classes · Yoga Retreats",
    homestay: "Homemade Breakfast · Cultural Tours · Farm Activities"
  },
  rooms: [
    {
      id: 1,
      name: "Deluxe City View Room",
      type: "Room",
      price: 4500,
      oldPrice: 5500,
      sleeps: "2 Adults",
      size: "300 sq. ft",
      view: "City",
      amenities: ["AC", "TV", "Safe", "Coffee Maker"],
      images: ["/images/hotels/banner1.jpg", "/images/hotels/banner2.jpg"]
    },
    {
      id: 2,
      name: "Premium Family Suite",
      type: "Suite",
      price: 9000,
      oldPrice: 11000,
      sleeps: "4 Adults",
      size: "600 sq. ft",
      view: "Pool",
      amenities: ["AC", "TV", "Safe", "Mini Bar", "Balcony"],
      images: ["/images/hotels/banner3.jpg", "/images/hotels/banner2.jpg"]
    }
  ],
  dining: {
    restaurantName: "The Spice Route",
    description: "Multi-cuisine fine dining with a focus on local Assamese flavors.",
    hours: "7:00 AM - 11:00 PM",
    menu: [
      { category: "Starters", items: ["Local Fish Fry", "Bamboo Shoot Salad"] },
      { category: "Main Course", items: ["Assamese Fish Curry", "Duck with Ash Gourd"] }
    ]
  },
  events: {
    venues: [
      { name: "Grand Ballroom", capacity: "500 Guests", features: ["AV Setup", "Catering", "Stage"] },
      { name: "Executive Boardroom", capacity: "20 Guests", features: ["Projector", "WiFi", "Privacy"] }
    ]
  },
  team: [
    { id: 1, name: "Rajesh Sharma", role: "General Manager", bio: "20+ years of luxury hospitality experience." },
    { id: 2, name: "Anita Desai", role: "Head Chef", bio: "Crafting local flavors with a modern twist." }
  ],
  certifications: ["Eco-Tourism Certified", "Green Key Award"],
  awards: ["Best Boutique Hotel 2023", "Travelers' Choice Winner"],
  reviews: [
    { id: 1, quote: "An absolute oasis in the city. The service was impeccable!", author: "Sarah Jenkins", location: "London, UK", rating: 5 },
    { id: 2, quote: "Loved the sustainable practices and the amazing local food.", author: "Rahul Verma", location: "Delhi, IN", rating: 4 }
  ],
  localGems: [
    { name: "Kamakhya Temple", distance: "4.5 km" },
    { name: "Brahmaputra River Cruise", distance: "2.0 km" },
    { name: "Assam State Museum", distance: "1.2 km" }
  ],
  partners: ["Assam Tourism Certified Partner", "Green Earth Farms"],
  faqs: [
    { q: "What time is check-in/check-out?", a: "Check-in is from 2:00 PM, and check-out is until 11:00 AM." },
    { q: "Do you offer airport transfers?", a: "Yes, we offer seamless airport pickup and drop-off services for our guests." },
    { q: "Are pets allowed?", a: "We have specific pet-friendly rooms available upon request." }
  ]
};
