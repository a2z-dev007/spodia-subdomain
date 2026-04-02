'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { setSearchFilters } from "@/lib/features/hotels/hotelSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LocationBottomSheet from './mobile/LocationBottomSheet';
import DateBottomSheet from './mobile/DateBottomSheet';
import GuestsBottomSheet from './mobile/GuestsBottomSheet';

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

export interface MobileHotelSearchBarProps {
    initialLocation?: CityOption | null;
    initialCheckIn?: Date | null;
    initialCheckOut?: Date | null;
    initialGuests?: { adults: number; children: number };
    initialRooms?: number;
    initialChildrenAges?: number[];
    callingFrom?: string;
}

function MobileHotelSearchBar({
    initialLocation = null,
    initialCheckIn = null,
    initialCheckOut = null,
    initialGuests = { adults: 1, children: 0 },
    initialRooms = 1,
    initialChildrenAges = [],
    callingFrom = "home"
}: MobileHotelSearchBarProps) {
    const [location, setLocation] = useState<CityOption | null>(initialLocation);
    const [checkInDate, setCheckInDate] = useState<Date | null>(initialCheckIn);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(initialCheckOut);
    const [guests, setGuests] = useState<{ adults: number; children: number }>(initialGuests);
    const [rooms, setRooms] = useState(initialRooms);
    const [childrenAges, setChildrenAges] = useState<number[]>(initialChildrenAges);
    
    const [showLocationSheet, setShowLocationSheet] = useState(false);
    const [showDateSheet, setShowDateSheet] = useState(false);
    const [showGuestsSheet, setShowGuestsSheet] = useState(false);
    
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Sync initial values when props change
    useEffect(() => {
        if (initialLocation) setLocation(initialLocation);
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

    // Sync redux filters
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

    const formatDate = (date: Date | null): string => {
        if (!date) return 'Add date';
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const handleSearch = () => {
        // Validate children ages
        if (guests.children > 0 && childrenAges.some(age => age === 0)) {
            toast.error('Please select age for all children', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setShowGuestsSheet(true); // Open the guests sheet to show the error
            return;
        }

        const formatDateForAPI = (date: Date | null): string => {
            if (!date) return '';
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        dispatch(
            setSearchFilters({
                checkIn: formatDateForAPI(checkInDate),
                checkOut: formatDateForAPI(checkOutDate),
                city: location ? String(location.id) : '',
                cityName: location ? location.name : '',
                noOfAdult: guests.adults,
                noOfChild: guests.children,
                rooms,
                childrenAges,
            })
        );

        const currentParams = new URLSearchParams();
        if (checkInDate) currentParams.set("start_date", formatDateForAPI(checkInDate));
        if (checkOutDate) currentParams.set("end_date", formatDateForAPI(checkOutDate));
        if (guests.adults) currentParams.set("no_of_adult", String(guests.adults));
        if (guests.children) currentParams.set("no_of_child", String(guests.children));
        if (rooms) currentParams.set("rooms", String(rooms));
        if (childrenAges.length > 0) {
            currentParams.set("childInfo", childrenAges.join(','));
        }

        if (callingFrom === "meta" && location) {
            const citySlug = location.name.toLowerCase().replace(/\s+/g, '-');
            router.push(`/in/hotels/${citySlug}/hotels?${currentParams.toString()}`);
        } else {
            if (location) currentParams.set("city", String(location.id));
            if (location) currentParams.set("cityName", location.name);
            router.push(`/search-results?${currentParams.toString()}`);
        }
    };

    return (
        <>
            <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                {/* Hotels Title */}
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-orange-500">Hotels</h2>
                </div>

                {/* Location Field */}
                <div className="mb-3">
                    <label className="text-xs text-gray-500 mb-1 block">Location</label>
                    <div 
                        className="bg-gray-50 rounded-lg p-3 flex items-center justify-between cursor-pointer border border-gray-200 hover:border-gray-300 transition-colors"
                        onClick={() => setShowLocationSheet(true)}
                    >
                        <div className="flex items-center gap-2 flex-1">
                            <Search className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                                {location ? location.name : 'Where Are You Going?'}
                            </span>
                        </div>
                        {location && (
                            <X 
                                className="w-4 h-4 text-gray-400" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLocation(null);
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Check In</label>
                        <div 
                            className="bg-gray-50 rounded-lg p-3 cursor-pointer border border-gray-200 hover:border-gray-300 transition-colors flex items-center gap-2"
                            onClick={() => setShowDateSheet(true)}
                        >
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                                {checkInDate ? formatDate(checkInDate) : 'Check In'}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Check Out</label>
                        <div 
                            className="bg-gray-50 rounded-lg p-3 cursor-pointer border border-gray-200 hover:border-gray-300 transition-colors flex items-center gap-2"
                            onClick={() => setShowDateSheet(true)}
                        >
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                                {checkOutDate ? formatDate(checkOutDate) : 'Check Out'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Guests Field */}
                <div className="mb-4">
                    <label className="text-xs text-gray-500 mb-1 block">Guests</label>
                    <div 
                        className="bg-gray-50 rounded-lg p-3 cursor-pointer border border-gray-200 hover:border-gray-300 transition-colors flex items-center gap-2"
                        onClick={() => setShowGuestsSheet(true)}
                    >
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                            {rooms} room, {guests.adults} adults, {guests.children} children
                        </span>
                    </div>
                </div>

                {/* Search Button */}
                <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full text-base font-semibold shadow-md flex items-center justify-center gap-2"
                    onClick={handleSearch}
                >
                    <Search className="w-5 h-5" />
                    Search
                </Button>
            </div>

            {/* Bottom Sheets */}
            <LocationBottomSheet
                isOpen={showLocationSheet}
                onClose={() => setShowLocationSheet(false)}
                selectedLocation={location}
                onSelectLocation={setLocation}
            />

            <DateBottomSheet
                isOpen={showDateSheet}
                onClose={() => setShowDateSheet(false)}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onSelectDates={(checkIn: Date | null, checkOut: Date | null) => {
                    setCheckInDate(checkIn);
                    setCheckOutDate(checkOut);
                }}
            />

            <GuestsBottomSheet
                isOpen={showGuestsSheet}
                onClose={() => setShowGuestsSheet(false)}
                guests={guests}
                rooms={rooms}
                childrenAges={childrenAges}
                onUpdate={(updatedGuests: { adults: number; children: number }, updatedRooms: number, updatedChildrenAges: number[]) => {
                    setGuests(updatedGuests);
                    setRooms(updatedRooms);
                    setChildrenAges(updatedChildrenAges);
                }}
            />
        </>
    );
}

export default MobileHotelSearchBar;
