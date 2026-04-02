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
        cityId: number | null;
        checkIn: Date | null;
        checkOut: Date | null;
        guests: { adults: number; children: number };
        rooms?: number;
        childrenAges?: number[];
    }) => void;
    btnTitle?: string;
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

function SearchHotel({
    onSearch,
    initialLocation = null,
    initialCheckIn = null,
    initialCheckOut = null,
    initialGuests = { adults: 1, children: 0 },
    initialRooms = 1,
    initialChildrenAges = [],
    btnTitle = "Search",
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

    useEffect(() => {
        const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1200);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

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

    // Sync redux filters whenever guests/rooms change
    useEffect(() => {
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

    const handleSearch = (params: {
        location: string;
        checkIn: Date | null;
        checkOut: Date | null;
        guests: { adults: number; children: number };
        cityId?: string | number | null;
        rooms?: number;
        childrenAges?: number[];
    }) => {
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
                checkIn: formatDate(params.checkIn),
                checkOut: formatDate(params.checkOut),
                noOfAdult: params.guests.adults,
                noOfChild: params.guests.children,
                city: params.cityId ? String(params.cityId) : undefined,
                cityName: params.location,
                rooms: params.rooms,
                childrenAges: params.childrenAges,
            })
        );
        let newErrors: { location?: string; checkInDate?: string; checkOutDate?: string; guests?: string } = {}
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (!location) {
            newErrors.location = 'Please select a location.'
        }
        // ✅ Normal case → redirect to /search-results with query params
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
        } else if (guests.adults <= 0) {
            newErrors.guests = "At least one adult must be included."
        }

        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) return
        const currentParams = new URLSearchParams();
        if (params.cityId) currentParams.set("city", String(params.cityId));
        if (params.location) currentParams.set("cityName", params.location);
        if (params.checkIn)
            currentParams.set(
                "start_date",
                params.checkIn.toISOString().split("T")[0]
            );
        if (params.checkOut)
            currentParams.set(
                "end_date",
                params.checkOut.toISOString().split("T")[0]
            );
        if (params.guests.adults)
            currentParams.set("no_of_adult", String(params.guests.adults));
        if (params.guests.children)
            currentParams.set("no_of_child", String(params.guests.children));
        if (params.rooms) currentParams.set("rooms", String(params.rooms));
        if (params.childrenAges && params.childrenAges.length > 0) {
            currentParams.set("childInfo", params.childrenAges.join(','));
        }

        router.push(`/search-results?${currentParams.toString()}`);
    };

    let lablesColor = callingFrom === "home" ? "text-gray-500" : callingFrom === "update" ? "text-gray-700" : "text-white"
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
            `}</style>
            <div
                className={`z-[99] relative backdrop-blur-sm rounded-2xl p-4 md:p-6 pb-2 lg:p-8 lg:pb-2 md:pb-2 w-full max-w-7xl mx-auto ${callingFrom === "home" ? 'bg-white/95 shadow-2xl' :
                    callingFrom === "update" ? 'bg-gray-50/50' :
                        'bg-white/25 shadow-2xl'
                    }`}>

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
                    <div className="space-y-3 md:mt-0 mt-4" suppressHydrationWarning={true}>
                        <Label className={`text-sm ${lablesColor}`}>Check In</Label>
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
                    <div className="space-y-3 md:mt-0 mt-4" suppressHydrationWarning={true}>
                        <Label className={`text-sm ${lablesColor}`}>Check Out</Label>
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

                    <div className="space-y-3 flex-1 md:mt-0 mt-4 w-full">
                        <Label className={`text-sm ${lablesColor}`}>Guests</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full h-12 justify-start text-left font-normal text-sm"
                                    type="button"
                                >
                                    <Users className="mr-2 h-4 w-4 text-gray-400" />
                                    <span className="truncate">
                                        {rooms} room, {guests.adults} {guests.adults === 1 ? 'adult' : 'adults'}{guests.children > 0 ? `, ${guests.children} ${guests.children === 1 ? 'child' : 'children'}` : ''}
                                    </span>
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[320px] bg-white rounded-md border shadow-lg p-4 mt-2">
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
                                            <p className="text-red-500 text-xs mt-2">
                                                Please select age for all children
                                            </p>
                                        )}
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                        <p className=" text-xs  md:min-h-[18px]"></p>
                    </div>

                    <div className='space-y-3 md:mt-0 mt-4'>
                        <Button
                            className="gradient-btn text-white px-8 h-12 w-full md:w-auto rounded-full shadow-lg outline-none border-none text-base flex items-center gap-2 whitespace-nowrap"
                            onClick={() => {
                                handleSearch({
                                    location: location ? location.name : '',
                                    cityId: location ? location.id : null,
                                    checkIn: checkInDate,
                                    checkOut: checkOutDate,
                                    guests,
                                    rooms,
                                    childrenAges,
                                })
                            }}
                        >
                            <Search className="w-5 h-5" />
                            {btnTitle || "Search"}
                        </Button>
                        <p className=" text-xs  md:min-h-[18px]"></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchHotel;