export const mockRatingsData = {
  overallRating: 3.7,
  totalReviews: 180,
  starDistribution: {
    5: 39,
    4: 31,
    3: 15,
    2: 8,
    1: 7
  },
  categories: [
    { name: "Location", rating: 4.0 },
    { name: "Cleanliness", rating: 3.8 },
    { name: "Room", rating: 3.6 },
    { name: "Food", rating: 3.4 },
    { name: "Hospitality", rating: 4.1 },
    { name: "Value For Money", rating: 3.7 }
  ]
};

export const mockReviews = [
  {
    id: 1,
    rating: 4.0,
    title: "Good Stay",
    description: "Everything was great and the staff made a lot of efforts, worth a stay. Thanks much! Delicious food from Ravi bhai.",
    travelMonth: "Jun",
    travelYear: 2020,
    roomType: "Deluxe Room with Lake View",
    helpful: 0,
    author: "Alice",
    location: "Group"
  },
  {
    id: 2,
    rating: 3.5,
    title: "Great Stay",
    description: "Everything was great and the staff made a lot of efforts, worth a stay. Thanks much! Delicious food from Ravi bhai.",
    travelMonth: "Aug",
    travelYear: 2020,
    roomType: "Deluxe Room with Lake View",
    helpful: 0,
    author: "Sarah N",
    location: "USA"
  },
  {
    id: 3,
    rating: 1.0,
    title: "Terrible Stay",
    description: "Very poor experience. Staff is very rude and behaves like a dog. We stayed at 8 Hotels in Kerala in way 15 days and it they managed to change the Bathrooms in every 15 days and it they managed to change the bathroom.",
    travelMonth: "Jul",
    travelYear: 2020,
    roomType: "Deluxe Room with Mountain View",
    helpful: 0
  },
  {
    id: 4,
    rating: 5.0,
    title: "Excellent Stay",
    description: "The location was on the rooftop and they served us 5 start with fresh fish beach. The weather was a lso provided and excellent service.",
    travelMonth: "Aug",
    travelYear: 2020,
    roomType: "Deluxe Room with Lake Shore",
    helpful: 0,
    author: "Anna K",
    location: "Family"
  },
  {
    id: 5,
    rating: 4.0,
    title: "It was a good experience.",
    description: "It was a good stay in atmosphere and basic were and cleanliness. We stayed for 5 nights. Safe and sound. Good go.",
    travelMonth: "Aug",
    travelYear: 2020,
    roomType: "Deluxe Room with Lake Shore",
    helpful: 0,
    author: "Priya",
    location: "Couple"
  },
  {
    id: 6,
    rating: 1.0,
    title: "Terrible Stay",
    description: "Very poor experience. Staff is very rude and they could not a very high level of energy a hotel to learn from one another.",
    travelMonth: "May",
    travelYear: 2020,
    roomType: "Deluxe Room with Mountain View",
    helpful: 0
  },
  {
    id: 7,
    rating: 4.2,
    title: "Great location and service",
    description: "The hotel has excellent location near the beach and the staff was very helpful throughout our stay. Food was delicious and rooms were clean.",
    travelMonth: "Sep",
    travelYear: 2020,
    roomType: "Premium Ocean View",
    helpful: 2,
    author: "David L",
    location: "Family"
  },
  {
    id: 8,
    rating: 3.8,
    title: "Good value for money",
    description: "Overall a pleasant stay with good amenities. The pool area was well maintained and the breakfast had good variety.",
    travelMonth: "Oct",
    travelYear: 2020,
    roomType: "Standard Room",
    helpful: 1,
    author: "Jennifer M",
    location: "Solo"
  },
  {
    id: 9,
    rating: 4.5,
    title: "Highly recommended",
    description: "Fantastic experience with top-notch service. The room was spacious and had a beautiful view. Will definitely come back!",
    travelMonth: "Nov",
    travelYear: 2020,
    roomType: "Suite with Balcony",
    helpful: 5,
    author: "Michael R",
    location: "Couple"
  },
  {
    id: 10,
    rating: 2.5,
    title: "Could be better",
    description: "The location is good but the service needs improvement. Room cleanliness was not up to the mark and WiFi was slow.",
    travelMonth: "Dec",
    travelYear: 2020,
    roomType: "Standard Room",
    helpful: 0,
    author: "Lisa K",
    location: "Business"
  }
];

// Simulate API pagination - Ensure at least 3 pages
export const getReviewsPage = (page: number, pageSize: number = 3) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    reviews: mockReviews.slice(startIndex, endIndex),
    currentPage: page,
    totalPages: Math.ceil(mockReviews.length / pageSize),
    totalReviews: mockReviews.length
  };
};