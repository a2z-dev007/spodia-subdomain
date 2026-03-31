import {createSlice, type PayloadAction} from "@reduxjs/toolkit"
import type {AppDispatch} from "@/lib/store"
import apiClient from "@/lib/api/apiClient"

export interface SearchFilters {
    city: string
    cityName: string
    checkIn: string
    checkOut: string
    rooms: number
    noOfAdult: number
    noOfChild: number
    childrenAges: number[] // 👈 actual ages stored in array
    childInfo: string      // 👈 derived for API
    priceRange?: [number, number]
    starRating: number[]
    amenities: number[]
    propertyTypes: string[]
    propertyChains: string[]
    sortBy: string
}

export interface Hotel {
    id: string
    name: string
    location: string
    city: string
    country: string
    rating: number
    reviews: number
    price: number
    originalPrice?: number
    image: string
    amenities: string[]
    distance: string
    badge?: string
    description: string
    propertyType?: string
    propertyChain?: string
}

interface HotelState {
    searchFilters: SearchFilters
    searchResults: Hotel[]
    loading: boolean
    error: string | null
}

const initialState: HotelState = {
    searchFilters: {
        city: "",
        cityName: "",
        checkIn: "",
        checkOut: "",
        rooms: 1,
        noOfAdult: 1,
        noOfChild: 0,
        childrenAges: [],
        childInfo: "",
        priceRange: undefined,
        starRating: [],
        amenities: [],
        propertyTypes: [],
        propertyChains: [],
        sortBy: "top_reviewed",
    },
    searchResults: [],
    loading: false,
    error: null,
}

const hotelSlice = createSlice({
    name: "hotels",
    initialState,
    reducers: {
        setSearchFilters(state, action: PayloadAction<Partial<SearchFilters>>) {
            state.searchFilters = {...state.searchFilters, ...action.payload}

            // 🔑 keep noOfChild in sync with childrenAges if provided
            if (action.payload.childrenAges !== undefined) {
                state.searchFilters.noOfChild = action.payload.childrenAges.length
            }

            // 🔑 keep childInfo always synced
            state.searchFilters.childInfo = state.searchFilters.childrenAges.join(",")
        },
        clearFilters(state) {
            state.searchFilters = initialState.searchFilters
        },
        setRooms(state, action: PayloadAction<number>) {
            state.searchFilters.rooms = action.payload
        },
        setAdults(state, action: PayloadAction<number>) {
            state.searchFilters.noOfAdult = Math.max(1, action.payload)
        },
        setChildren(state, action: PayloadAction<number>) {
            const count = Math.max(0, action.payload)
            state.searchFilters.noOfChild = count

            if (count > state.searchFilters.childrenAges.length) {
                const diff = count - state.searchFilters.childrenAges.length
                state.searchFilters.childrenAges = [
                    ...state.searchFilters.childrenAges,
                    ...Array(diff).fill(0),
                ]
            } else {
                state.searchFilters.childrenAges = state.searchFilters.childrenAges.slice(0, count)
            }

            state.searchFilters.childInfo = state.searchFilters.childrenAges.join(",")
        },
        setChildAge(state, action: PayloadAction<{ index: number; age: number }>) {
            const {index, age} = action.payload
            if (state.searchFilters.childrenAges[index] !== undefined) {
                state.searchFilters.childrenAges[index] = age
                state.searchFilters.childInfo = state.searchFilters.childrenAges.join(",")
            }
        },
        setSearchResults(state, action: PayloadAction<Hotel[]>) {
            state.searchResults = action.payload
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload
        },
    },
})

export const {
    setSearchFilters,
    clearFilters,
    setRooms,
    setAdults,
    setChildren,
    setChildAge,
    setSearchResults,
    setLoading,
    setError,
} = hotelSlice.actions

export default hotelSlice.reducer

// --- API call ---
const searchHotelsApi = async (filters: SearchFilters): Promise<Hotel[]> => {
    const params = new URLSearchParams()

    params.append("page_number", "1")
    params.append("number_of_records", "15")

    if (filters.sortBy) params.append("sortBy", filters.sortBy)
    if (filters.city) params.append("city", filters.city)
    if (filters.cityName) params.append("cityName", filters.cityName)
    if (filters.checkIn) params.append("start_date", filters.checkIn)
    if (filters.checkOut) params.append("end_date", filters.checkOut)
    if (filters.rooms) params.append("rooms", filters.rooms.toString())
    if (filters.noOfAdult) params.append("no_of_adult", filters.noOfAdult.toString())
    if (filters.noOfChild) params.append("no_of_child", filters.noOfChild.toString())
    if (filters.childInfo) params.append("childInfo", filters.childInfo)

    if (filters.starRating.length > 0)
        params.append("star_category", filters.starRating.join(","))

    if (filters.propertyTypes.length > 0)
        params.append("property_type", encodeURIComponent(filters.propertyTypes.join(",")))

    if (filters.propertyChains.length > 0)
        params.append("property_chain", encodeURIComponent(filters.propertyChains.join(",")))

    if (filters.amenities.length > 0)
        params.append("amenities", filters.amenities.join(","))

    if (filters.priceRange) {
        params.append("price_start", filters.priceRange[0].toString())
        params.append("price_end", filters.priceRange[1].toString())
    }

    const url = `/listings/search-promotion/?${params.toString()}`
    const response = await apiClient.get(url)
    return response?.data?.records || []
}

// --- thunk ---
export const searchHotels =
    () => async (dispatch: AppDispatch, getState: () => { hotels: HotelState }) => {
        const {searchFilters} = getState().hotels
        try {
            dispatch(setLoading(true))
            const results = await searchHotelsApi(searchFilters)
            dispatch(setSearchResults(results))
            dispatch(setError(null))
        } catch (err) {
            dispatch(setError("Failed to fetch hotels"))
        } finally {
            dispatch(setLoading(false))
        }
    }
