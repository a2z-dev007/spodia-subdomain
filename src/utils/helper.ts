import {AuthorType, StayDataType, TaxonomyType} from "@/data/types";


export const buildAuthorFromApi = (owner: any): AuthorType => ({
    id: owner?.id || 0,
    firstName: owner?.first_name || "",
    lastName: owner?.last_name || "",
    displayName: owner?.full_name?.trim() || owner?.username || "Hotel Owner",
    avatar: typeof owner?.profile_image === 'string' ? owner.profile_image : '',
    bgImage: undefined,
    email: typeof owner?.email === 'string' ? owner.email : undefined,
    count: 0,
    desc: "Hotel owner",
    jobName: "Hotelier",
    href: "/author",
    starRating: undefined,
});

// Helper to build TaxonomyType from API property_type
export const buildCategoryFromApi = (propertyType: string | undefined): TaxonomyType => {
    let cat = DEMO_STAY_CATEGORIES[0];
    if (propertyType) {
        const found = DEMO_STAY_CATEGORIES.find(cat => cat.name.toLowerCase() === propertyType.toLowerCase());
        if (found) cat = found;
        else cat = { ...cat, name: propertyType };
    }
    return {
        id: cat.id,
        name: cat.name,
        href: typeof cat.href === 'string' ? cat.href : String(cat.href),
        count: typeof cat.count === 'number' ? cat.count : undefined,
        thumbnail: typeof cat.thumbnail === 'string' ? cat.thumbnail : '',
        desc: typeof cat.desc === 'string' ? cat.desc : undefined,
        color: typeof cat.color === 'string' ? cat.color : undefined,
        taxonomy: cat.taxonomy,
        listingType: cat.listingType,
    };
};

export const mapApiToStay = (item: any): StayDataType => {
    const category = buildCategoryFromApi(item.property_type);
    const author = buildAuthorFromApi(item.ownerdetails);
        // redirect link 
    const hrefWithCity = `${item.name}-${item.city_name}`.replace(/\s+/g, '-').toLowerCase();
    // console.log("hrefWithCity",hrefWithCity)
    return {
        id: item.id,
        author,
        city_name: typeof item.city_name === 'string' ? item.city_name : '',
        date: typeof item.created === 'string' ? item.created : '',
        href: `/hotels/${hrefWithCity}`,
        title: typeof item.name === 'string' ? item.name : '',
        featuredImage: typeof (item.images?.find((img: any) => img.cover_photo)?.file) === 'string'
            ? item.images?.find((img: any) => img.cover_photo)?.file
            : typeof (item.images?.[0]?.file) === 'string'
                ? item.images?.[0]?.file
                : '',
        commentCount: typeof item.review_rating_count === 'number' ? item.review_rating_count : 0,
        viewCount: 0,
        address: typeof item.address === 'string' ? item.address : '',
        reviewStart: typeof item.review_rating === 'number' ? item.review_rating : 0,
        reviewCount: typeof item.review_rating_count === 'number' ? item.review_rating_count : 0,
        like: !!item.is_favourite,
        galleryImgs: Array.isArray(item.images)
            ? item.images.map((img: any) => (typeof img.file === 'string' ? img.file : '')).filter(Boolean)
            : [],
        price: typeof item.sbr_rate === 'number' ? `₹${Math.round(item.sbr_rate)}` : '₹0',
        listingCategory: category,
        maxGuests: typeof item.no_of_rooms === 'number' ? item.no_of_rooms : 2,
        bedrooms: typeof item.no_of_floors === 'number' ? item.no_of_floors : 1,
        bathrooms: 1,
        saleOff: null,
        isAds: null,
        map: {
            lat: typeof item.lat === 'number' ? item.lat : 0,
            lng: typeof item.lon === 'number' ? item.lon : 0,
        },
        // Promotion fields
        has_promotion: typeof item.has_promotion === 'boolean' ? item.has_promotion : false,
        best_promotion: item.best_promotion || null,
        sbr_rate: typeof item.sbr_rate === 'number' ? item.sbr_rate : 0,
    };
};


import { Facebook, Instagram, Youtube } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";

// Dynamic social media links configuration
interface SocialLinkConfig {
    label: string;
    href: string;
    icon: React.ComponentType<any>;
    className: string;
    iconClassName: string;
    description: string;
}

export const getSocialLinks = (): SocialLinkConfig[] => [
    {
        label: "Facebook",
        href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/spodiaasia",
        icon: Facebook,
        className: "bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30",
        iconClassName: "text-blue-400",
        description: "Follow our updates"
    },
    {
        label: "Youtube",
        href: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/@Spodiaasia",
        icon: Youtube,
        className: "bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30",
        iconClassName: "text-red-400",
        description: "Watch our videos"
    },
    {
        label: "Instagram",
        href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/spodiaasia",
        icon: Instagram,
        className: "bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30",
        iconClassName: "text-pink-400",
        description: "See our stories"
    },
    {
        label: "X (Twitter)",
        href: process.env.NEXT_PUBLIC_TWITTER_URL || "https://x.com/Spodiaasia",
        icon: BsTwitterX,
        className: "bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30",
        iconClassName: "text-gray-400",
        description: "Join the conversation"
    },
];

// For backward compatibility, export static version
export const SOCIAL_LINKS = getSocialLinks();