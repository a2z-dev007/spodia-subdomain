export interface HotelType {
    id?: number;
    user_id?: number;
    ownerdetails?: Ownerdetails;
    name?: string;
    name_hindi?: string;
    rate_type?: null;
    description?: string;
    description_hindi?: string;
    order?: number;
    property_type?: string;
    property_chain?: null;
    hotel_chain?: number;
    hotel_chain_name?: string;
    star_category?: string;
    no_of_rooms?: number;
    lat?: number;
    lon?: number;
    no_of_floors?: number;
    no_of_buildings?: number;
    is_favourite?: number;
    images?: WelcomeImage[];
    documents_required_for_check_in?: boolean;
    contactdetails?: Contactdetail[];
    address?: string;
    city?: number;
    state?: number;
    country?: number;
    guest_cancellation_type?: string;
    check_in?: string;
    check_out?: string;
    check_in_age?: string;
    check_in_policies?: string;
    step_completed?: number;
    status?: boolean;
    status_remark?: null;
    instant_booking?: boolean;
    b2c_commission_rate?: number;
    website?: null;
    meta_title?: string;
    meta_keywords?: string;
    meta_description?: string;
    meta_tags?: string;
    created?: Date;
    video_request_status?: null;
    check_in_document?: string;
    servicedetails?: Servicedetail[];
    b2b_commission_rate?: number;
    videos?: Video[];
    city_name?: string;
    state_name?: string;
    country_short_name?: string;
    country_name?: string;
    show_landing?: boolean;
    show_landing2?: boolean;
    review_rating?: number;
    sbr_rate?: number;
    review_rating_count?: number;
    video_url?: null;
    rooms?: Room[];
    facilities?: number[];
    facilitiesDetails?: FacilitiesDetail[];
    other_rules?: string;
    highlights?: string;
    title_highlights?: string;
    meta_names?: string;
    property_highlights?: any[];
    property_highlights_details?: any[];
    cancellation_policies?: any[];
    has_promotion?: boolean;
    best_promotion?: BestPromotion | null;
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

export interface Contactdetail {
    id?: number;
    name?: string;
    email?: string;
    mobile?: string;
    contact_type?: string;
}

export interface FacilitiesDetail {
    id?: number;
    name?: string;
    name_hindi?: string;
    parent?: null;
    amenities_tags?: any[];
    image?: string;
    created?: Date;
}

export interface WelcomeImage {
    id?: number;
    file?: string;
    cover_photo?: boolean;
    images_tag?: any[];
    order?: number;
    status?: number;
    status_remark?: null;
    room_images_tag?: any[];
}

export interface Ownerdetails {
    url?: string;
    id?: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    mobile?: null;
    profile_image?: null;
    email?: string;
    permissions?: string[];
    role_id?: null;
    is_superuser?: boolean;
    user_type?: null;
    city_id?: null;
    region_id?: null;
    password?: string;
    address_line1?: null;
    address_line2?: null;
    country_code?: null;
    country_id?: null;
    company_name?: null;
    secondary_phone_ext?: null;
    city?: null;
    secondary_phone?: null;
    gender?: null;
    languages_spoken?: null;
    language?: null;
    about_me?: null;
    hometown?: null;
    school?: null;
    created_at?: null;
    region?: null;
    country?: null;
    pin_code?: null;
    latitude?: null;
    longitude?: null;
    office?: null;
    parent?: null;
    status?: boolean;
    status_remark?: null;
    full_name?: string;
}

export interface Room {
    room_name?: string;
    created?: Date;
    description?: string;
    suitable_for_kids?: boolean;
    pets_allowed?: boolean;
    smoking_allowed?: boolean;
    room_type?: number;
    id?: number;
    room_location?: string;
    room_view?: string;
    no_of_rooms?: string;
    costume_room_name?: string;
    base_adults?: number;
    maximum_adults?: number;
    maximum_children?: number;
    dimensions?: string;
    bed_type?: string;
    images?: WelcomeImage[];
    no_of_beds?: number;
    extra_bed_allowed?: boolean;
    extra_bed_type?: string;
    maximum_occupancy?: number;
    ep_highlights?: null | string;
    cp_highlights?: null | string;
    map_highlights?: null | string;
    ap_highlights?: null | string;
    room_type_details?: RoomTypeDetails;
    videos?: any[];
    facilitiesDetails?: FacilitiesDetail[];
    facilities?: number[];
    ap_rate?: number | null;
    map_rate?: number | null;
    cp_rate?: number | null;
    ep_rate?: number | null;
    plans?: Plan[];
}

export interface Plan {
    id?: number;
    plan?: number;
    plan_name?: string;
    plan_items?: RoomTypeDetails[];
    room?: number;
}

export interface RoomTypeDetails {
    id?: number;
    name?: string;
    created?: Date;
    created_by?: number;
}

export interface Servicedetail {
    id?: number;
    name?: string;
    serviceType?: string;
    openTime?: string;
    closeTime?: string;
    typeofService?: string;
    images?: ServicedetailImage[];
}

export interface ServicedetailImage {
    id?: number;
    file?: string;
    cover_photo?: boolean;
    status?: number;
    status_remark?: null;
}

export interface Video {
    id?: number;
    title?: string;
    video_url?: string;
    status?: number;
    status_remark?: null;
    created_by?: number;
}