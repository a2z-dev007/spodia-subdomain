import {Route} from "@/routers/types";
import {StaticImageData} from "next/image";

//  ######  CustomLink  ######## //
export interface CustomLink {
    label: string;
    href: Route<string> | string;
    targetBlank?: boolean;
}

//  ##########  PostDataType ######## //
export interface TaxonomyType {
    id: string | number;
    name: string;
    href: Route<string>;
    count?: number;
    thumbnail?: string;
    desc?: string;
    color?: TwMainColor | string;
    taxonomy: "category" | "tag";
    listingType?: "stay" | "experiences" | "car";
}

export interface AuthorType {
    id: string | number;
    firstName: string;
    lastName: string;
    displayName: string;
    avatar: string | StaticImageData;
    bgImage?: string | StaticImageData;
    email?: string;
    count: number;
    desc: string;
    jobName: string;
    href: Route<string>;
    starRating?: number;
}

export interface PostDataType {
    id: string | number;
    author: AuthorType;
    date: string;
    href: Route<string>;
    categories: TaxonomyType[];
    title: string;
    featuredImage: StaticImageData | string;
    desc?: string;
    commentCount: number;
    viewdCount: number;
    readingTime: number;
    postType?: "standard" | "video" | "gallery" | "audio";
}

export type TwMainColor =
    | "pink"
    | "green"
    | "yellow"
    | "red"
    | "indigo"
    | "blue"
    | "purple"
    | "gray"
    | "orange";

//
export interface StayDataType {
    id: string | number;
    author: AuthorType;
    date: string;
    href: Route<string>;
    title: string;
    featuredImage: StaticImageData | string;
    commentCount: number;
    viewCount: number;
    address: string;
    reviewStart: number;
    reviewCount: number;
    like: boolean;
    city_name: string;
    galleryImgs: (StaticImageData | string)[];
    price: string;
    listingCategory: TaxonomyType;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    saleOff?: string | null;
    isAds: boolean | null;
    map: {
        lat: number;
        lng: number;
    };
    // Promotion fields
    has_promotion?: boolean;
    best_promotion?: BestPromotion | null;
    sbr_rate?: number;
}

export interface BestPromotion {
    type: string;
    rate_or_percentage: number;
    type_of_offer: string;
    details: PromotionDetails;
    promotion_id: number;
}

export interface PromotionDetails {
    id: number;
    created: string;
    property: number;
    promotion_rooms: PromotionRoom[];
    deleted: boolean;
    type_of_offer: string;
    rate_or_percentage: number;
    booking_start: string;
    booking_end: string;
    stay_start: string;
    stay_end: string;
    back_out_start: string | null;
    back_out_end: string | null;
    name: string;
    name_hindi: string | null;
    status: boolean;
    status_remark: string;
    created_by: number;
    full_name: string;
}

export interface PromotionRoom {
    id: number;
    basic_promotion: number;
    rooms: number;
    room_name: string;
    plans: number[];
    plan_details: PlanDetail[];
}

export interface PlanDetail {
    id: number;
    name: string;
    created: string;
    created_by: number;
}

