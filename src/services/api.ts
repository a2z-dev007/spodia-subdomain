import apiClient from "@/lib/api/apiClient";
import { RoomInventoryResponse } from "@/types/roomInventory";

// Error wrapper for consistent error handling
const handleApiCall = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    // Error is already handled by apiClient, just re-throw
    throw error;
  }
};

// GET APIs
export const searchListings = (params: { page_number?: number; show_landing?: boolean; number_of_records?: number; sortBy?: string; show_popular?: boolean; show_top_rated?: boolean; start_date?: string; end_date?: string }) =>
    handleApiCall(() => apiClient.get("/listings/search-promotion/", { params }));


export const getPropertyByName = (name: string) =>
    handleApiCall(() => apiClient.get(`/listing/find-by-name/${name}`));

export const getPropertyById = (id: string) =>
    handleApiCall(() => apiClient.get(`/listing/detail/${id}`));

export const searchRoomTypes = (params: { page_number?: number; number_of_records?: number; name?: string }) =>
    handleApiCall(() => apiClient.get("/room-types/", { params }));

export const getFooter = () =>
    handleApiCall(() => apiClient.get("/footer/"));

export const getCountries = () =>
    handleApiCall(() => apiClient.get("/countries/"));

export const getAmenties = () =>
    handleApiCall(() => apiClient.get("/features-and-facilities"));

export const getStates = (countryId: string | number) =>
    handleApiCall(() => apiClient.get(`/states/`, { params: { country_id: countryId } }));

export const getCities = (stateId: string | number) =>
    handleApiCall(() => apiClient.get(`/cities/`, { params: { state_id: stateId } }));

export const searchCityByName = (name: string) =>
    handleApiCall(() => apiClient.get(`/cities/`, { params: { name } }));

export const getCityById = (cityId: string | number) =>
    handleApiCall(() => apiClient.get(`/cities/`, { params: { id: cityId } }));

export const getCitiesByStateId = (stateId: string | number) =>
    handleApiCall(() => apiClient.get(`/cities/`, { params: { state_id: stateId } }));

// POST API
export const becomeHost = (payload: any) =>
    handleApiCall(() => apiClient.post("/registration/", payload));

// Auth APIs
export const loginApi = (credentials: { email: string; password: string }) =>
    handleApiCall(() => apiClient.post("/token/", credentials));

export const signupApi = (userData: {
    first_name: string
    last_name: string
    email: string
    mobile: string
    password: string
    cPassword: string
    country_code: string
    user_type: string
}) =>
    handleApiCall(() => apiClient.post("/registration/", userData));

export const activateAccountApi = (activationKey: string) =>
    handleApiCall(() => apiClient.post("/activation/", { activation_key: activationKey }));

// export const refreshTokenApi = (refreshToken: string) =>
//     apiClient.post("/token/refresh/", { refresh: refreshToken });

export interface SearchHotelsParams {
    page_number?: number;
    number_of_records?: number;
    sortBy?: "top_reviewed" | "low_to_high" | "high_to_low" | "popularity" | string;
    city?: string | number;
    cityName?: string;

    // Dates
    start_date?: string; // YYYY-MM-DD
    end_date?: string;   // YYYY-MM-DD

    // Guests
    no_of_adult?: number;
    no_of_child?: number;
    childInfo?: string; // e.g. "5,7" (child ages)

    // Filters
    star_category?: string | string[];    // e.g. "1,3" or ["1","3"]
    property_type?: string | string[];    // e.g. "Deluxe Hotels"
    property_chain?: string | string[];   // e.g. ["Abad Hotels", "Bloom Rooms"]
    amenities?: string | string[];        // e.g. "1,6" or ["1","6"]

    // Price Range
    price_start?: number;
    price_end?: number;
}

export const searchHotelsApi = (filters: {
    city?: string | number
    cityName?: string
    checkIn?: string
    checkOut?: string
    noOfAdult?: number
    noOfChild?: number
    childInfo?: string
    priceRange?: [number, number]
    starRating?: number[]
    amenities?: (string | number)[]
    propertyTypes?: string[]
    propertyChains?: string[]
    sortBy?: string
    page_number?: number
    number_of_records?: number
}) => {
    const payload: Record<string, any> = {}

    // Pagination
    payload.page_number = filters.page_number ?? 1
    payload.number_of_records = filters.number_of_records ?? 15

    // Core filters
    if (filters.city) payload.city = filters.city
    if (filters.cityName) payload.cityName = filters.cityName
    if (filters.checkIn) payload.start_date = filters.checkIn
    if (filters.checkOut) payload.end_date = filters.checkOut
    if (filters.noOfAdult) payload.no_of_adult = filters.noOfAdult
    if (filters.noOfChild) payload.no_of_child = filters.noOfChild
    if (filters.childInfo !== undefined) payload.childInfo = filters.childInfo

    // ✅ Fix sortBy mapping
    if (filters.sortBy) {
        switch (filters.sortBy) {
            case "Top Reviewed":
            case "top_reviewed":
                payload.sortBy = "top_reviewed"
                break
            case "Price : Low to High":
                payload.sortBy = "price_low_to_high"
                break
            case "Price : High to Low":
                payload.sortBy = "price_high_to_low"
                break
            // case "Highest Rated":
            //     payload.sortBy = "highest_rated"
            //     break
            default:
                payload.sortBy = filters.sortBy
        }
    }

    // ✅ Star Category
    if (filters.starRating?.length) {
        payload.star_category = filters.starRating.join(",")
    }

    // ✅ Property Types – ensure %20 not +
    if (filters.propertyTypes?.length) {
        payload.property_type = filters.propertyTypes.map(encodeURIComponent).join(",")
    }

    // ✅ Property Chains – ensure %20 not +
    if (filters.propertyChains?.length) {
        payload.property_chain = filters.propertyChains.map(encodeURIComponent).join(",")
    }

    // ✅ Amenities
    if (filters.amenities?.length) {
        payload.amenities = filters.amenities.join(",")
    }

    // ✅ Price Range
    if (filters.priceRange) {
        payload.price_start = filters.priceRange[0]
        payload.price_end = filters.priceRange[1]
    }

    // Manually build query string so commas don’t get encoded as %2C
    const queryString = Object.entries(payload)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")

    return handleApiCall(() => apiClient.get(`/listings/search-promotion/?${queryString}`))
}







// Booking APIs
export const getRecentReservations = (params: { page_number?: number; number_of_records?: number }) => {
    return handleApiCall(() => apiClient.get("/recent-reservations/", { 
        params: {
            page_number: params.page_number || 1,
            number_of_records: params.number_of_records || 10
        }
    }))
}

export const getBookingDetails = (bookingId: string) => {
    return handleApiCall(() => apiClient.get(`/booking-details/${bookingId}/`))
}

export const sendReservationMail = (reservationId: number, typeOfMail: string = "user") => {
    return handleApiCall(() => apiClient.get("/send-reservation-mail/", {
        params: {
            reservation_id: reservationId,
            type_of_mail: typeOfMail
        }
    }))
}

// Profile APIs
export const updateProfile = (profileData: {
    first_name: string
    last_name: string
    gender?: string
    school?: string
    hometown?: string
    languages_spoken?: string
    about_me?: string
    company_name?: string
    mobile: string
    country?: string
    state?: string
    city?: string
}) => {
    return handleApiCall(() => apiClient.post("/users/profile-update/", profileData))
}


export const updateProfileImage = (imageFile: File) => {
    const formData = new FormData()
    formData.append("image", imageFile)

    return handleApiCall(() => apiClient.post("/update-profile-image/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }))
}

export const changePassword = (passwordData: {
    old_password: string
    new_password: string
    confirm_new_password: string
}) => {
    return handleApiCall(() => apiClient.post("/change-password/", passwordData))
}

// Room Inventory & Pricing API
export const getRoomInventoryAndPricing = (params: {
    propertyId: string | number
    customerType?: string | null
    startDate: string // YYYY-MM-DD
    endDate: string   // YYYY-MM-DD
}): Promise<{ data: RoomInventoryResponse }> => {
    const customerType = params.customerType || "b2c"
    return handleApiCall(() => apiClient.get(
        `/rooms-inventory/${params.propertyId}/?customerType=${customerType}&start=${params.startDate}&end=${params.endDate}`
    ))
}

// Room Availability Check API
export const checkRoomAvailability = (params: {
    listing: string | number
    start_date: string // YYYY-MM-DD
    end_date: string   // YYYY-MM-DD
}) => {
    return handleApiCall(() => apiClient.post("/confirm-availability/", {
        listing: params.listing,
        start_date: params.start_date,
        end_date: params.end_date
    }))
}

// Payment APIs
export const createPaymentOrder = (amount: string) => {
    return handleApiCall(() => apiClient.post("/listing/payment-order/", {
        amount: amount
    }))
}

export const confirmPaymentSuccess = (paymentData: any) => {
    return handleApiCall(() => apiClient.post("/listing/payment-success/", paymentData))
}

// Get Final Amount with GST and Service Charge
export const getFinalAmount = async (params: {
    total_amount: number
    country_id: number
}): Promise<{
    status: string
    country: string
    tax_details: Array<{
        name: string
        rate: number
        amount: number
    }>
    total_amount: number
    final_amount: number
}> => {
    const response = await handleApiCall(() => apiClient.post("/get_final_amount/", params))
    return response.data
}

// FAQ APIs
export const getFAQs = (params: {
    listing?: number
    city?: number
    state?: number
    country?: number
}) => {
    return handleApiCall(() => apiClient.get("/faqs/", { params }))
}

export const getFAQCategories = () => {
    return handleApiCall(() => apiClient.get("/faq-categories/"))
}

export const getFAQsByCategory = (categoryId: number) => {
    return handleApiCall(() => apiClient.get("/faqs/", { params: { category: categoryId } }))
}

// Coupon/Promotion APIs
export const getHotelOfferPromotions = (propertyId: string | number) => {
    return handleApiCall(() => apiClient.get(`/list-hotel-offer-promotion/${propertyId}/`))
}

export const getMemberOnlyPromotions = (propertyId: string | number) => {
    return handleApiCall(() => apiClient.get(`/list-member-only-promotion/${propertyId}/`))
}

// Cancellation APIs
export const getCancellationPreview = (reservationId: string | number) => {
    return handleApiCall(() => apiClient.get(`/reservation-cancel-preview/${reservationId}/`))
}

export const cancelReservation = (reservationId: string | number) => {
    return handleApiCall(() => apiClient.get(`/reservation-cancel-by-traveller/${reservationId}/`))
}

// Reservation Details API
export const getReservationDetails = (reservationId: string | number) => {
    return handleApiCall(() => apiClient.get(`/reservation-details/${reservationId}/`))
}

// Add Review API
export const addReview = (bookingId: string | number, reviewData: any) => {
    return handleApiCall(() => apiClient.post(`/add/review/${bookingId}/`, reviewData))
}

// Contact/Messages API
export const addMessage = (messageData: any) => {
    return handleApiCall(() => apiClient.post("/add-messages/", messageData))
}

// Email Verification API
export const verifyEmail = (email: string) => {
    return handleApiCall(() => apiClient.post("/verify-email/", { email }))
}

// Forgot Password API
export const sendPasswordRecoveryLink = (email: string) => {
    return handleApiCall(() => apiClient.post("/send-password-recovery-link/", { email }))
}

// Set New Password API
export const setNewPassword = (passwordData: {
    recovery_key: string
    new_password: string
    confirm_new_password: string
}) => {
    return handleApiCall(() => apiClient.post("/set-new-password/", passwordData))
}

// Guest User API
export const addGuestUser = (userData: any) => {
    return handleApiCall(() => apiClient.post("/add-guest-user/", userData))
}

// Reviews API
export const getReviews = (hotelId: string | number) => {
    return handleApiCall(() => apiClient.get(`/reviews/${hotelId}/`))
}

// Property Enquiry API
export const addPropertyEnquiry = (enquiryData: {
    listing: number
    name: string
    email: string
    mobile: string
    message: string
    check_in: string // YYYY-MM-DD
    check_out: string // YYYY-MM-DD
    enquiry_type: "group" | "single"
    page_url: string
    number_of_rooms?: number
}) => {
    return handleApiCall(() => apiClient.post("/add-properties-enquiry/", enquiryData))
}

// City Content API
export const getCityContent = (cityName: string) => {
    return handleApiCall(() => apiClient.get("/city-contents/", { params: { city_name: cityName } }))
}

// Jobs/Career APIs
export const getJobs = () => {
    return handleApiCall(() => apiClient.get("/jobs"))
}

export const applyJob = (formData: FormData) => {
    return handleApiCall(() => apiClient.post("/apply-job/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }))
}

// Testimonials API
export const getTestimonials = (params?: { show_homepage?: 0 | 1 }) => {
    return handleApiCall(() => apiClient.get("/testimonials/", { params }))
}

// Blog APIs
export const getBlogs = (params: { applicable_for: string; page_number?: number; number_of_records?: number }) => {
    return handleApiCall(() => apiClient.get("/get/blogs-list/", { params }));
}

export const getBlogDetails = (blogIdOrSlug: string | number, applicableFor: string) => {
    const isId = typeof blogIdOrSlug === 'number' || !isNaN(Number(blogIdOrSlug));
    return handleApiCall(() => apiClient.get("/get/blogs-list/", { 
        params: { 
            applicable_for: applicableFor, 
            ...(isId ? { blog_id: blogIdOrSlug } : { slug: blogIdOrSlug })
        } 
    }));
}