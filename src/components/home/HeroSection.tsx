"use client"
import {useState, useEffect} from "react"
import {useRouter} from "next/navigation"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useAppDispatch, useAppSelector} from "@/lib/hooks"
import {setSearchFilters, searchHotels} from "@/lib/features/hotels/hotelSlice"
import {hotelSearchSchema, type HotelSearchFormData} from "@/lib/validations/hotel"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {MapPin, Calendar, Users, Search, HelpCircle, ChevronDown} from "lucide-react"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Calendar as CalendarComponent} from "@/components/ui/calendar"
import {format, addDays} from "date-fns"

const HeroSection2 = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {searchSuggestions} = useAppSelector((state) => state?.hotels ?? { searchSuggestions: [] })

    const [activeTab, setActiveTab] = useState("Hotels")
    const [checkIn, setCheckIn] = useState<Date>()
    const [checkOut, setCheckOut] = useState<Date>()
    const [showCheckInCalendar, setShowCheckInCalendar] = useState(false)
    const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false)
    const [showGuestSelector, setShowGuestSelector] = useState(false)
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
    const [guestCounts, setGuestCounts] = useState({
        adults: 2,
        children: 2,
        rooms: 1,
    })

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {errors},
    } = useForm<HotelSearchFormData>({
        resolver: zodResolver(hotelSearchSchema),
        defaultValues: {
            location: "",
            checkIn: "",
            checkOut: "",
            guests: "2 adults, 2 children",
        },
    })

    const watchedLocation = watch("location")
    const tabs = ["Hotels", "Homestays", "Holidays", "Spas", "Restaurants"]

    // Update guest string when counts change
    useEffect(() => {
        const parts = []
        if (guestCounts.adults > 0) parts.push(`${guestCounts.adults} adult${guestCounts.adults > 1 ? "s" : ""}`)
        if (guestCounts.children > 0) parts.push(`${guestCounts.children} child${guestCounts.children > 1 ? "ren" : ""}`)
        if (guestCounts.rooms > 1) parts.push(`${guestCounts.rooms} rooms`)
        setValue("guests", parts.join(", "))
    }, [guestCounts, setValue])

    // Auto-set checkout date when checkin is selected
    useEffect(() => {
        if (checkIn && !checkOut) {
            const nextDay = addDays(checkIn, 1)
            setCheckOut(nextDay)
            setValue("checkOut", format(nextDay, "yyyy-MM-dd"))
        }
    }, [checkIn, checkOut, setValue])

    // Filter location suggestions
    useEffect(() => {
        if (watchedLocation) {
            const filtered = searchSuggestions.filter((suggestion) =>
                suggestion.toLowerCase().includes(watchedLocation.toLowerCase()),
            )
            setFilteredSuggestions(filtered.slice(0, 5))
            setShowLocationSuggestions(filtered.length > 0 && watchedLocation.length > 0)
        } else {
            setShowLocationSuggestions(false)
        }
    }, [watchedLocation, searchSuggestions])

    const onSubmit = (data: HotelSearchFormData) => {
        // Update Redux store with search filters
        dispatch(
            setSearchFilters({
                location: data.location,
                checkIn: data.checkIn,
                checkOut: data.checkOut,
                guests: data.guests,
            }),
        )

        // Perform search
        dispatch(searchHotels())

        // Navigate to hotels page
        const searchParams = new URLSearchParams({
            location: data.location,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            guests: data.guests,
            type: activeTab.toLowerCase(),
        })

        router.push(`/hotels?${searchParams.toString()}`)
    }

    const updateGuestCount = (type: "adults" | "children" | "rooms", increment: boolean) => {
        setGuestCounts((prev) => {
            const newCounts = {...prev}
            if (increment) {
                newCounts[type] += 1
            } else {
                if (type === "adults" && newCounts[type] > 1) newCounts[type] -= 1
                else if (type === "children" && newCounts[type] > 0) newCounts[type] -= 1
                else if (type === "rooms" && newCounts[type] > 1) newCounts[type] -= 1
            }
            return newCounts
        })
    }

    const handleCheckInSelect = (date: Date | undefined) => {
        setCheckIn(date)
        setShowCheckInCalendar(false)
        if (date) {
            setValue("checkIn", format(date, "yyyy-MM-dd"))
            if (checkOut && date >= checkOut) {
                const nextDay = addDays(date, 1)
                setCheckOut(nextDay)
                setValue("checkOut", format(nextDay, "yyyy-MM-dd"))
            }
        }
    }

    const handleCheckOutSelect = (date: Date | undefined) => {
        setCheckOut(date)
        setShowCheckOutCalendar(false)
        if (date) {
            setValue("checkOut", format(date, "yyyy-MM-dd"))
        }
    }

    const handleLocationSelect = (suggestion: string) => {
        setValue("location", suggestion)
        setShowLocationSuggestions(false)
    }

    return (
        <section
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/placeholder.svg?height=1080&width=1920')`,
            }}
        >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Content */}
                <div className="text-white mb-8 lg:mb-12 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 lg:mb-6 leading-tight">
                        Find Your Next Stay
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed px-4">
                        Search deals on Hotels, Resorts, Homestays, Unique Stays, Offbeat Stays, Village Stays & much
                        more...
                    </p>
                </div>

                {/* Search Form */}
                <div
                    className="bg-white/80 backdrop-blur-lg rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl max-w-6xl mx-auto border border-gray-500">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 lg:mb-8 justify-center">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full font-medium transition-all text-sm sm:text-base ${
                                    activeTab === tab
                                        ? "bg-[#FF9530] text-white shadow-lg"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            {/* Location */}
                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium text-gray-700 block">Location</label>
                                <div className="relative">
                                    <MapPin
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10"/>
                                    <Input
                                        {...register("location")}
                                        type="text"
                                        placeholder="Where are you going?"
                                        className={`pl-10 h-12 sm:h-14 border-gray-200 text-base focus:ring-2 focus:ring-[#FF9530] focus:border-[#FF9530] ${
                                            errors.location ? "border-red-500" : ""
                                        }`}
                                        autoComplete="off"
                                    />
                                    {/* Location Suggestions */}
                                    {showLocationSuggestions && (
                                        <div
                                            className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 mt-1">
                                            {filteredSuggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleLocationSelect(suggestion)}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="w-4 h-4 text-gray-400"/>
                                                        <span className="text-sm">{suggestion}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors.location &&
                                    <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                            </div>

                            {/* Check In */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">Check In</label>
                                <Popover open={showCheckInCalendar} onOpenChange={setShowCheckInCalendar}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={`relative w-full h-12 sm:h-14 border border-gray-200 rounded-md px-3 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF9530] focus:border-[#FF9530] transition-colors ${
                                                errors.checkIn ? "border-red-500" : ""
                                            }`}
                                        >
                                            <Calendar
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                            <span className="pl-7 text-base text-gray-900">
                        {checkIn ? format(checkIn, "MMM dd, yyyy") : "Select date"}
                      </span>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={checkIn}
                                            onSelect={handleCheckInSelect}
                                            initialFocus
                                            disabled={(date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.checkIn &&
                                    <p className="text-red-500 text-xs mt-1">{errors.checkIn.message}</p>}
                            </div>

                            {/* Check Out */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">Check Out</label>
                                <Popover open={showCheckOutCalendar} onOpenChange={setShowCheckOutCalendar}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={`relative w-full h-12 sm:h-14 border border-gray-200 rounded-md px-3 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF9530] focus:border-[#FF9530] transition-colors ${
                                                errors.checkOut ? "border-red-500" : ""
                                            }`}
                                        >
                                            <Calendar
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                            <span className="pl-7 text-base text-gray-900">
                        {checkOut ? format(checkOut, "MMM dd, yyyy") : "Select date"}
                      </span>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={checkOut}
                                            onSelect={handleCheckOutSelect}
                                            initialFocus
                                            disabled={(date) => (checkIn ? date <= checkIn : date < new Date())}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.checkOut &&
                                    <p className="text-red-500 text-xs mt-1">{errors.checkOut.message}</p>}
                            </div>

                            {/* Guests */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">Guests</label>
                                <Popover open={showGuestSelector} onOpenChange={setShowGuestSelector}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={`relative w-full h-12 sm:h-14 border border-gray-200 rounded-md px-3 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF9530] focus:border-[#FF9530] transition-colors ${
                                                errors.guests ? "border-red-500" : ""
                                            }`}
                                        >
                                            <Users
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                            <span className="pl-7 pr-7 text-base text-gray-900 truncate block">
                        {watch("guests") || "Add guests"}
                      </span>
                                            <ChevronDown
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-4" align="start">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="font-medium text-gray-900">Adults</span>
                                                    <p className="text-sm text-gray-500">Ages 13 or above</p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 rounded-full p-0 border-gray-300 hover:border-[#FF9530] hover:text-[#FF9530]"
                                                        onClick={() => updateGuestCount("adults", false)}
                                                        disabled={guestCounts.adults <= 1}
                                                    >
                                                        -
                                                    </Button>
                                                    <span
                                                        className="w-8 text-center font-medium text-gray-900">{guestCounts.adults}</span>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 rounded-full p-0 border-gray-300 hover:border-[#FF9530] hover:text-[#FF9530]"
                                                        onClick={() => updateGuestCount("adults", true)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="font-medium text-gray-900">Children</span>
                                                    <p className="text-sm text-gray-500">Ages 2-12</p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 rounded-full p-0 border-gray-300 hover:border-[#FF9530] hover:text-[#FF9530]"
                                                        onClick={() => updateGuestCount("children", false)}
                                                        disabled={guestCounts.children <= 0}
                                                    >
                                                        -
                                                    </Button>
                                                    <span
                                                        className="w-8 text-center font-medium text-gray-900">{guestCounts.children}</span>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 rounded-full p-0 border-gray-300 hover:border-[#FF9530] hover:text-[#FF9530]"
                                                        onClick={() => updateGuestCount("children", true)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="font-medium text-gray-900">Rooms</span>
                                                    <p className="text-sm text-gray-500">Number of rooms</p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 rounded-full p-0 border-gray-300 hover:border-[#FF9530] hover:text-[#FF9530]"
                                                        onClick={() => updateGuestCount("rooms", false)}
                                                        disabled={guestCounts.rooms <= 1}
                                                    >
                                                        -
                                                    </Button>
                                                    <span
                                                        className="w-8 text-center font-medium text-gray-900">{guestCounts.rooms}</span>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 rounded-full p-0 border-gray-300 hover:border-[#FF9530] hover:text-[#FF9530]"
                                                        onClick={() => updateGuestCount("rooms", true)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t">
                                                <Button
                                                    type="button"
                                                    onClick={() => setShowGuestSelector(false)}
                                                    className="w-full bg-[#FF9530] hover:bg-[#e8851c] text-white"
                                                >
                                                    Done
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests.message}</p>}
                            </div>
                        </div>

                        {/* Search Button and Help */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 lg:mt-8 gap-4">
                            <Button
                                type="submit"
                                className="bg-[#078ED8] hover:bg-[#0679b8] text-white px-8 lg:px-12 py-3 lg:py-4 rounded-full text-base lg:text-lg font-medium w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
                            >
                                <Search className="w-5 h-5 mr-2"/>
                                Search
                            </Button>

                            <button
                                type="button"
                                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm lg:text-base"
                            >
                                <HelpCircle className="w-5 h-5 mr-2"/>
                                Need some help?
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default HeroSection2
