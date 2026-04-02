'use client';

import { useRef, useEffect, forwardRef, useState } from 'react';
import { Search, Calendar, Users, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import DatePicker from "react-datepicker";
import CitySelect from '@/components/ui/CitySelect';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { setSearchFilters } from "@/lib/features/hotels/hotelSlice";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LINKS } from '@/utils/const';

// Define a type for the city object
interface CityOption {
    id: number;
    country_name: string;
    country: number;
    state_name: string;
    state: number;
    name: string;
    description?: string;
    file?: string | null;
    key_name?: string | null;
    created?: string;
}

export interface HotelSearchBarProps {
    onSearch?: (params: {
        location: string;
        cityId: string | number | null;
        checkIn: Date | null;
        checkOut: Date | null;
        guests: { adults: number; children: number };
        rooms: number;
        childrenAges: number[];
    }) => void;
    prefilledCity?: { id: number; name: string } | null
    initialLocation?: CityOption | null;
    initialCheckIn?: Date | null;
    initialCheckOut?: Date | null;
    initialGuests?: { adults: number; children: number };
    initialRooms?: number;
    initialChildrenAges?: number[];
    callingFrom?: string;
    metaName?: string;
}

const ExampleCustomInput = forwardRef<HTMLButtonElement, {
    value?: string;
    onClick?: () => void;
    className?: string;
    placeholder?: string
}>(
    ({ value, onClick, className, placeholder }, ref) => (
        <button className={className} onClick={onClick} ref={ref} type="button">
            {value || placeholder}
        </button>
    ),
);

function HotelSearchBar({
    onSearch,
    initialLocation = null,
    initialCheckIn = null,
    initialCheckOut = null,
    initialGuests = { adults: 1, children: 0 },
    initialRooms = 1,
    initialChildrenAges = [],
    callingFrom = "home",
    prefilledCity,
    metaName
}: HotelSearchBarProps) {
    const [location, setLocation] = useState<CityOption | null>(initialLocation);
    const [checkInDate, setCheckInDate] = useState<Date | null>(initialCheckIn);
    const [rooms, setRooms] = useState(initialRooms);
    const [childrenAges, setChildrenAges] = useState<number[]>(initialChildrenAges);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(initialCheckOut);
    const [guests, setGuests] = useState<{ adults: number; children: number }>(initialGuests);
    const [showGuestDropdown, setShowGuestDropdown] = useState(false);
    const [errors, setErrors] = useState<{ location?: string; checkInDate?: string; checkOutDate?: string }>({});
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter()
    const dispatch = useAppDispatch();

    const [isLargeScreen, setIsLargeScreen] = useState(false);



    // Sync initial values when props change
    useEffect(() => {
        if (initialLocation) {
            setLocation(initialLocation);
        }
    }, [initialLocation]);

    useEffect(() => {
        setCheckInDate(initialCheckIn);
    }, [initialCheckIn]);

    useEffect(() => {
        setCheckOutDate(initialCheckOut);
    }, [initialCheckOut]);

    useEffect(() => {
        setGuests(initialGuests);
    }, [initialGuests.adults, initialGuests.children]);

    useEffect(() => {
        setRooms(initialRooms);
    }, [initialRooms]);

    useEffect(() => {
        if (initialChildrenAges.length > 0) {
            setChildrenAges(initialChildrenAges);
        }
    }, [JSON.stringify(initialChildrenAges)]);

    // Sync children ages with guest count
    useEffect(() => {
        setChildrenAges((prev) => {
            if (guests.children > prev.length) {
                return [...prev, ...Array(guests.children - prev.length).fill(0)];
            } else {
                return prev.slice(0, guests.children);
            }
        });
    }, [guests.children]);

    const isMounted = useRef(false);

    // Sync redux filters whenever guests/rooms change
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        dispatch(
            setSearchFilters({
                rooms,
                noOfAdult: guests.adults,
                noOfChild: guests.children,
                childrenAges,
            })
        );
    }, [rooms, guests, childrenAges, dispatch]);
    
    useEffect(() => {
        const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1200);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    useEffect(() => {
        if (!showGuestDropdown) return;

        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowGuestDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showGuestDropdown]);



    const handleSearch = () => {
        // 🔹 Convert dates to strings for Redux (serializable)
        const formatDate = (date: Date | null): string => {
            if (!date) return '';
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // 🔹 Always update Redux (so filters persist across pages)
        dispatch(
            setSearchFilters({
                checkIn: formatDate(checkInDate),
                checkOut: formatDate(checkOutDate),
                city: location ? String(location.id) : '',
                cityName: location ? location.name : '',
                noOfAdult: guests.adults,
                noOfChild: guests.children,
                rooms,
                childrenAges,
            })
        );
        
        // Validation
        let newErrors: { location?: string; checkInDate?: string; checkOutDate?: string; guests?: string } = {}
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        // Location is always required
        if (!location) {
            newErrors.location = 'Please select a location.'
        }
        
        // For non-meta pages, dates and guests are required
        if (callingFrom !== "meta") {
            if (!checkInDate) {
                newErrors.checkInDate = "Please select a check-in date."
            } else if (checkInDate < today) {
                newErrors.checkInDate = "Check-in date cannot be in the past."
            }
            if (!checkOutDate) {
                newErrors.checkOutDate = "Please select a check-out date."
            } else if (checkOutDate <= today) {
                newErrors.checkOutDate = "Check-out date must be in the future."
            } else if (checkInDate && checkOutDate < checkInDate) {
                newErrors.checkOutDate = "Check-out date cannot be before check-in date."
            }
            if (guests.adults <= 0) {
                newErrors.guests = "At least one adult must be included."
            }
        } else {
            // For meta pages, only validate dates if they are provided
            if (checkInDate && checkInDate < today) {
                newErrors.checkInDate = "Check-in date cannot be in the past."
            }
            if (checkOutDate && checkOutDate <= today) {
                newErrors.checkOutDate = "Check-out date must be in the future."
            }
            if (checkInDate && checkOutDate && checkOutDate < checkInDate) {
                newErrors.checkOutDate = "Check-out date cannot be before check-in date."
            }
        }

        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) return

        // Build query parameters
        const currentParams = new URLSearchParams();
        if (checkInDate) {
            const year = checkInDate.getFullYear();
            const month = String(checkInDate.getMonth() + 1).padStart(2, '0');
            const day = String(checkInDate.getDate()).padStart(2, '0');
            currentParams.set("start_date", `${year}-${month}-${day}`);
        }
        if (checkOutDate) {
            const year = checkOutDate.getFullYear();
            const month = String(checkOutDate.getMonth() + 1).padStart(2, '0');
            const day = String(checkOutDate.getDate()).padStart(2, '0');
            currentParams.set("end_date", `${year}-${month}-${day}`);
        }
        if (guests.adults) currentParams.set("no_of_adult", String(guests.adults));
        if (guests.children) currentParams.set("no_of_child", String(guests.children));
        if (rooms) currentParams.set("rooms", String(rooms));
        if (childrenAges.length > 0) {
            currentParams.set("childInfo", childrenAges.join(','));
        }

        // Navigate based on calling context
        if (callingFrom === "meta" && location) {
            // For meta pages, navigate to the city's meta page with params
            const citySlug = location.name.toLowerCase().replace(/\s+/g, '-');
            router.push(`/in/hotels/${citySlug}/hotels?${currentParams.toString()}`);
        } else {
            // For other pages, navigate to search-results
            if (location) currentParams.set("city", String(location.id));
            if (location) currentParams.set("cityName", location.name);
            router.push(`/search-results?${currentParams.toString()}`);
        }
    };

    let lablesColor = callingFrom === "home" ? "text-gray-500" : "text-white"
    // Update specific child age
    const handleChildAgeChange = (index: number, age: number) => {
        setChildrenAges(prev => {
            const updated = [...prev];
            updated[index] = age;
            return updated;
        });
    };
    return (
        <>
            <style jsx global>{`
                .react-datepicker-popper {
                    z-index: 99999 !important;
                }
                .react-datepicker {
                    z-index: 99999 !important;
                }
                .react-datepicker__portal {
                    z-index: 99999 !important;
                }
                [data-radix-popper-content-wrapper] {
                    z-index: 99999 !important;
                }
            `}</style>
            <div
                className={`z-[99] relative backdrop-blur-sm rounded-2xl p-4 md:p-6 pb-2 lg:p-8 lg:pb-2 md:pb-2 shadow-2xl w-full max-w-7xl mx-auto ${callingFrom === "home" ? 'bg-white/95' : 'bg-white/25'}`} >

                {
                    callingFrom === "home" &&
                    <div className="flex  relative justify-center items-center gap-2 md:gap-4 mb-6 md:mb-8 ">
                        <div className='flex items-center justify-between '>
                            <p className=" font-extrabold px-4 md:px-8 text-center  text-lg md:text-3xl  text-[#FF9530]  ">Hotels</p>
                            <div className="ms-auto hidden absolute right-1 lg:block">
                                <Button onClick={() => router.push(LINKS.CONTACT)} variant="ghost" className="text-gray-500 hover:text-primary text-sm">
                                    <HelpCircle className="h-4 w-4 mr-2" />
                                    Need some help?
                                </Button>
                            </div>
                        </div>
                    </div>
                }

                <div className="md:flex items-end gap-4 flex-wrap gap-y-3">
                    {/* Location */}
                    <div className="space-y-3 flex-1 md:flex-none  md:min-w-[250px] ">
                        <Label htmlFor="location" className={`text-sm  ${lablesColor}`}>
                            Location
                        </Label>
                        <CitySelect
                            value={location ? { label: location.name, value: location.id } : null}
                            onChange={option => setLocation(option ? option : null)}
                            placeholder="Where are you going?"
                        />
                        <p className="text-red-500 text-xs mt-1 md:min-h-[18px]">{errors.location ? errors.location : ''}</p>
                    </div>

                    {/* Check In */}
                    <div className="space-y-3 md:mt-0 mt-4">
                        <Label className={`text-sm  ${lablesColor}`}>Check In</Label>
                        <div
                            className="w-full bg-white flex items-center pl-4 rounded-md gap-2 h-12 justify-start text-left font-normal border border-[#e2e8f0] hover:border-slate-500 text-sm">
                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                            <DatePicker
                                customInput={<ExampleCustomInput placeholder="Check In" />}
                                selected={checkInDate}
                                onChange={(date: Date | null) => {
                                    setCheckInDate(date);
                                    // Auto-set checkout to next day if not already set or if it's before the new check-in
                                    if (date && (!checkOutDate || checkOutDate <= date)) {
                                        const nextDay = new Date(date);
                                        nextDay.setDate(nextDay.getDate() + 1);
                                        setCheckOutDate(nextDay);
                                    }
                                }}
                                className="w-[170px] text-black text-left pr-6 py-3"
                                dateFormat="d MMMM, yyyy "
                                placeholderText="Check In"
                                minDate={new Date()}
                                selectsStart
                                startDate={checkInDate}
                                endDate={checkOutDate}
                                portalId="datepicker-portal"
                                monthsShown={isLargeScreen ? 2 : 1}
                            />
                        </div>
                        <p className="text-red-500 text-xs  md:min-h-[18px]">{errors.checkInDate ? errors.checkInDate : ''}</p>
                    </div>

                    {/* Check Out */}
                    <div className="space-y-3 md:mt-0 mt-4">
                        <Label className={`text-sm  ${lablesColor}`}>Check Out</Label>
                        <div
                            className="w-full bg-white flex items-center pl-4 rounded-md gap-2 h-12 justify-start text-left font-normal border border-[#e2e8f0]  hover:border-slate-500 text-sm">
                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                            <DatePicker
                                customInput={<ExampleCustomInput placeholder="Check Out" />}
                                selected={checkOutDate}
                                onChange={(date: Date | null) => setCheckOutDate(date)}
                                className="w-[170px] text-black text-left pr-6 py-3"
                                dateFormat="d MMMM, yyyy "
                                placeholderText="Check Out"
                                minDate={checkInDate ? new Date(new Date(checkInDate).setDate(checkInDate.getDate() + 1)) : new Date(new Date().setDate(new Date().getDate() + 1))}
                                selectsEnd
                                startDate={checkInDate}
                                endDate={checkOutDate}
                                portalId="datepicker-portal"
                                monthsShown={isLargeScreen ? 2 : 1}
                            />
                        </div>
                        <p className="text-red-500 text-xs  md:min-h-[18px]">{errors.checkOutDate ? errors.checkOutDate : ''}</p>
                    </div>



                    {/* Guests with Popover */}

                    <div className="space-y-3 flex-1 md:mt-0 mt-4 w-full">
                        <Label className={`text-sm ${lablesColor}`}>Guests</Label>
                        <Popover open={showGuestDropdown} onOpenChange={(open) => {
                            // Prevent closing if children exist but ages not selected
                            if (!open && guests.children > 0 && childrenAges.some(age => age === 0)) {
                                // Don't close - validation failed
                                return;
                            }
                            setShowGuestDropdown(open);
                        }}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full h-12 justify-start text-left font-normal text-sm"
                                    type="button"
                                >
                                    <Users className="mr-2 h-4 w-4 text-gray-400" />
                                    <span className="truncate">
                                        {rooms} room, {guests.adults} adults, {guests.children} children
                                    </span>
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[320px] bg-white rounded-md border shadow-lg p-4" onInteractOutside={(e) => {
                                // Prevent closing when clicking outside if validation fails
                                if (guests.children > 0 && childrenAges.some(age => age === 0)) {
                                    e.preventDefault();
                                }
                            }}>
                                {/* Rooms */}
                                <div className="flex items-center justify-between mb-4">
                                    <p className="font-medium">Room</p>
                                    <select
                                        className="border rounded-md px-2 py-1 text-sm"
                                        value={rooms}
                                        onChange={e => setRooms(Number(e.target.value))}
                                    >
                                        {Array.from({ length: 10 }, (_, i) => i + 1).map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Adults */}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="font-medium">Adults</p>
                                        <p className="text-xs text-gray-500">Ages 13+</p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setGuests(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))
                                            }
                                        >-</Button>
                                        <span className="w-8 text-center">{guests.adults}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setGuests(prev => ({ ...prev, adults: prev.adults + 1 }))
                                            }
                                        >+</Button>
                                    </div>
                                </div>

                                {/* Children */}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="font-medium">Children</p>
                                        <p className="text-xs text-gray-500">Ages 1–10</p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setGuests(prev => ({
                                                    ...prev,
                                                    children: Math.max(0, prev.children - 1),
                                                }))
                                            }
                                        >-</Button>
                                        <span className="w-8 text-center">{guests.children}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setGuests(prev => ({ ...prev, children: prev.children + 1 }))
                                            }
                                        >+</Button>
                                    </div>
                                </div>

                                {/* Children Ages */}
                                {guests.children > 0 && (
                                    <div className="mt-4 space-y-3">
                                        <p className="font-medium">Age of Children</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {childrenAges.map((age, index) => (
                                                <div key={index} className="flex flex-col  ">
                                                    <span className="text-sm mb-1">Child {index + 1}</span>
                                                    <select
                                                        className="border rounded-md px-2 py-1 text-sm"
                                                        value={age}
                                                        onChange={e =>
                                                            handleChildAgeChange(index, Number(e.target.value))
                                                        }
                                                    >
                                                        <option value={0}>-- Select --</option>
                                                        {Array.from({ length: 10 }, (_, i) => i + 1).map(a => (
                                                            <option key={a} value={a}>
                                                                {a} {a === 1 ? "yr" : "yrs"}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Error if not all ages selected */}
                                        {childrenAges.some(age => age === 0) && (
                                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                                <span>⚠️</span>
                                                <span>Please select age for all children</span>
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Done Button */}
                                <div className="mt-4 pt-4 border-t">
                                    <button
                                        onClick={() => {
                                            // Validate before closing
                                            if (guests.children > 0 && childrenAges.some(age => age === 0)) {
                                                // Show validation error - don't close
                                                return;
                                            }
                                            setShowGuestDropdown(false);
                                        }}
                                        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${guests.children > 0 && childrenAges.some(age => age === 0)
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                                            }`}
                                        disabled={guests.children > 0 && childrenAges.some(age => age === 0)}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <p className=" text-xs  md:min-h-[18px]"></p>
                    </div>

                    <div className='space-y-3 md:mt-0 mt-4'>
                        <Button
                            className="gradient-btn text-white px-8 h-12 w-full md:w-auto rounded-full shadow-lg outline-none border-none text-base flex items-center gap-2 whitespace-nowrap"
                            onClick={handleSearch}
                        >
                            <Search className="w-5 h-5" />
                            Search
                        </Button>
                        <p className=" text-xs  md:min-h-[18px]"></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HotelSearchBar;