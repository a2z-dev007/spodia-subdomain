"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ChangeDatesGuestsSearchParams {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: { adults: number; children: number };
  rooms: number;
  childrenAges: number[];
}

export interface ChangeDatesGuestsSearchProps {
  initialCheckIn?: Date | null;
  initialCheckOut?: Date | null;
  initialGuests?: { adults: number; children: number };
  initialRooms?: number;
  initialChildrenAges?: number[];
  onApply: (params: ChangeDatesGuestsSearchParams) => void;
  hotelCheckInTime?: string;
  hotelCheckOutTime?: string;
  className?: string;
  id?: string;
  readUrlParams?: boolean;
}

function getDefaultCheckIn(): Date {
  return new Date();
}

function getDefaultCheckOut(): Date {
  return new Date(Date.now() + 86400000);
}

function parseUrlDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function parseUrlInt(value: string | null): number | null {
  if (!value) return null;
  const n = parseInt(value, 10);
  return isNaN(n) ? null : n;
}

function parseChildrenAgesFromUrl(searchParams: URLSearchParams): number[] {
  const childInfo =
    searchParams.get("childInfo") || searchParams.get("childrenAges");
  if (!childInfo) return [];
  return childInfo
    .split(",")
    .map((a) => parseInt(a, 10))
    .filter((a) => !isNaN(a));
}

function buildParamsFromUrl(
  searchParams: URLSearchParams,
  fallbacks: {
    checkIn: Date | null;
    checkOut: Date | null;
    guests: { adults: number; children: number };
    rooms: number;
    childrenAges: number[];
  },
): ChangeDatesGuestsSearchParams | null {
  const qCheckIn =
    searchParams.get("checkIn") ||
    searchParams.get("start_date") ||
    searchParams.get("check_in");
  const qCheckOut =
    searchParams.get("checkOut") ||
    searchParams.get("end_date") ||
    searchParams.get("check_out");
  const qAdults =
    searchParams.get("adults") ||
    searchParams.get("no_of_adult") ||
    searchParams.get("guests");
  const qChildren =
    searchParams.get("children") || searchParams.get("no_of_child");
  const qRooms = searchParams.get("rooms");

  const parsedIn = parseUrlDate(qCheckIn);
  const parsedOut = parseUrlDate(qCheckOut);
  const parsedAdults = parseUrlInt(qAdults);
  const parsedChildren = parseUrlInt(qChildren);
  const parsedRooms = parseUrlInt(qRooms);
  const parsedChildrenAges = parseChildrenAgesFromUrl(searchParams);

  const hasUrlParams =
    parsedIn ||
    parsedOut ||
    parsedAdults !== null ||
    parsedChildren !== null ||
    parsedRooms !== null ||
    parsedChildrenAges.length > 0;

  if (!hasUrlParams) return null;

  return {
    checkIn: parsedIn ?? fallbacks.checkIn,
    checkOut: parsedOut ?? fallbacks.checkOut,
    guests: {
      adults: parsedAdults ?? fallbacks.guests.adults,
      children: parsedChildren ?? fallbacks.guests.children,
    },
    rooms: parsedRooms ?? fallbacks.rooms,
    childrenAges:
      parsedChildrenAges.length > 0
        ? parsedChildrenAges
        : fallbacks.childrenAges,
  };
}

export default function ChangeDatesGuestsSearch({
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  initialRooms = 1,
  initialChildrenAges = [],
  onApply,
  hotelCheckInTime,
  hotelCheckOutTime,
  className = "",
  id = "update-search",
  readUrlParams = true,
}: ChangeDatesGuestsSearchProps) {
  const searchParams = useSearchParams();
  const onApplyRef = useRef(onApply);
  const hasInitializedFromUrl = useRef(false);

  useEffect(() => {
    onApplyRef.current = onApply;
  }, [onApply]);

  const [searchDates, setSearchDates] = useState(() => ({
    checkIn: initialCheckIn ?? getDefaultCheckIn(),
    checkOut: initialCheckOut ?? getDefaultCheckOut(),
    guests: {
      adults: initialGuests?.adults ?? 1,
      children: initialGuests?.children ?? 0,
    },
  }));

  const [childrenAges, setChildrenAges] =
    useState<number[]>(initialChildrenAges);
  const [rooms, setRooms] = useState(initialRooms);
  const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync children ages array length with children count — skip if already correct
  useEffect(() => {
    setChildrenAges((prev) => {
      const targetCount = searchDates.guests.children;
      if (prev.length === targetCount) return prev;
      if (targetCount > prev.length) {
        return [
          ...prev,
          ...Array(targetCount - prev.length).fill(0),
        ];
      }
      return prev.slice(0, targetCount);
    });
  }, [searchDates.guests.children]);

  // Apply URL params once on mount
  useEffect(() => {
    if (!readUrlParams || hasInitializedFromUrl.current || !searchParams) {
      return;
    }

    hasInitializedFromUrl.current = true;

    const urlParams = buildParamsFromUrl(searchParams, {
      checkIn: searchDates.checkIn,
      checkOut: searchDates.checkOut,
      guests: searchDates.guests,
      rooms,
      childrenAges,
    });

    if (!urlParams) return;

    setSearchDates({
      checkIn: urlParams.checkIn,
      checkOut: urlParams.checkOut,
      guests: urlParams.guests,
    });
    setRooms(urlParams.rooms);
    if (urlParams.childrenAges.length > 0) {
      setChildrenAges(urlParams.childrenAges);
    }

    onApplyRef.current(urlParams);
    // Intentionally run once — URL is the source of truth on first load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readUrlParams, searchParams]);

  const handleChildAgeChange = useCallback((index: number, age: number) => {
    setChildrenAges((prev) => {
      const updated = [...prev];
      updated[index] = age;
      return updated;
    });
  }, []);

  const validateChildrenAges = useCallback((): boolean => {
    if (
      searchDates.guests.children > 0 &&
      childrenAges.some((age) => age === 0)
    ) {
      const message = "Please select age for all children before applying.";
      setValidationError(message);
      setIsGuestPopoverOpen(true);
      toast.error(message);
      return false;
    }
    setValidationError(null);
    return true;
  }, [searchDates.guests.children, childrenAges]);

  const validateDates = useCallback((): boolean => {
    if (!searchDates.checkIn || !searchDates.checkOut) {
      const message = "Please select valid check-in and check-out dates.";
      setValidationError(message);
      toast.error(message);
      return false;
    }
    if (searchDates.checkOut <= searchDates.checkIn) {
      const message = "Check-out must be after check-in.";
      setValidationError(message);
      toast.error(message);
      return false;
    }
    setValidationError(null);
    return true;
  }, [searchDates.checkIn, searchDates.checkOut]);

  const updateUrlParams = useCallback(() => {
    if (!searchDates.checkIn || !searchDates.checkOut) return;

    try {
      const formattedIn = format(searchDates.checkIn, "yyyy-MM-dd");
      const formattedOut = format(searchDates.checkOut, "yyyy-MM-dd");
      const url = new URL(window.location.href);
      url.searchParams.set("checkIn", formattedIn);
      url.searchParams.set("checkOut", formattedOut);
      url.searchParams.set("start_date", formattedIn);
      url.searchParams.set("end_date", formattedOut);
      url.searchParams.set("adults", searchDates.guests.adults.toString());
      url.searchParams.set(
        "no_of_adult",
        searchDates.guests.adults.toString(),
      );
      url.searchParams.set(
        "children",
        searchDates.guests.children.toString(),
      );
      url.searchParams.set(
        "no_of_child",
        searchDates.guests.children.toString(),
      );
      url.searchParams.set("rooms", rooms.toString());
      if (searchDates.guests.children > 0 && childrenAges.length > 0) {
        url.searchParams.set("childInfo", childrenAges.join(","));
        url.searchParams.set("childrenAges", childrenAges.join(","));
      } else {
        url.searchParams.delete("childInfo");
        url.searchParams.delete("childrenAges");
      }
      window.history.pushState(null, "", url.toString());
    } catch (err) {
      console.error("Could not update URL query params:", err);
    }
  }, [searchDates, rooms, childrenAges]);

  const commitSearch = useCallback(() => {
    if (!validateDates()) return;

    updateUrlParams();
    onApplyRef.current({
      checkIn: searchDates.checkIn,
      checkOut: searchDates.checkOut,
      guests: { ...searchDates.guests },
      rooms,
      childrenAges: [...childrenAges],
    });
    setValidationError(null);
    setIsGuestPopoverOpen(false);
  }, [searchDates, rooms, childrenAges, updateUrlParams, validateDates]);

  const handleApply = useCallback(() => {
    if (!validateChildrenAges()) return;
    if (!validateDates()) return;
    commitSearch();
  }, [validateChildrenAges, validateDates, commitSearch]);

  const handleGuestPopoverApply = useCallback(() => {
    if (!validateChildrenAges()) return;
    commitSearch();
  }, [validateChildrenAges, commitSearch]);

  const checkInDisplay =
    hotelCheckInTime?.trim() ||
    (searchDates.checkIn ? format(searchDates.checkIn, "h a") : "2 PM");
  const checkOutDisplay =
    hotelCheckOutTime?.trim() ||
    (searchDates.checkOut ? format(searchDates.checkOut, "h a") : "11 AM");

  return (
    <section
      className={`mt-8 relative w-full mx-auto z-40 bg-white rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-4 md:p-5 group/search-bar overflow-hidden ${className}`}
      id={id}
    >
      <div className="w-full min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-shrink-0 min-w-0">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">
              Change Dates and Guest(s)
            </h3>
            <p className="text-xs md:text-sm text-gray-600">
              Check-in: {checkInDisplay} | Check-out: {checkOutDisplay}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)_auto] gap-3 w-full min-w-0 lg:flex-1 lg:max-w-[820px]">
            <div className="min-w-0">
              <DatePicker
                selected={searchDates.checkIn}
                onChange={(date: Date | null) => {
                  setSearchDates((prev) => ({
                    ...prev,
                    checkIn: date,
                    checkOut: null,
                  }));
                }}
                dateFormat="EEE, dd MMM yyyy"
                minDate={new Date()}
                portalId="datepicker-portal"
                className="w-full min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 hover:border-orange-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white"
                placeholderText="Check-in date"
              />
            </div>

            <div className="min-w-0">
              <DatePicker
                selected={searchDates.checkOut}
                onChange={(date: Date | null) =>
                  setSearchDates((prev) => ({
                    ...prev,
                    checkOut: date,
                  }))
                }
                dateFormat="EEE, dd MMM yyyy"
                minDate={
                  searchDates.checkIn
                    ? new Date(
                        new Date(searchDates.checkIn).setDate(
                          searchDates.checkIn.getDate() + 1,
                        ),
                      )
                    : new Date(new Date().setDate(new Date().getDate() + 1))
                }
                portalId="datepicker-portal"
                className="w-full min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 hover:border-orange-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white"
                placeholderText="Check-out date"
              />
            </div>

            <div className="min-w-0 sm:col-span-2 lg:col-span-1">
              <Popover
                open={isGuestPopoverOpen}
                onOpenChange={(open) => {
                  if (
                    !open &&
                    searchDates.guests.children > 0 &&
                    childrenAges.some((age) => age === 0)
                  ) {
                    return;
                  }
                  setIsGuestPopoverOpen(open);
                }}
              >
                <PopoverTrigger asChild>
                  <button
                    className="w-full min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 hover:border-orange-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white text-left truncate"
                    type="button"
                  >
                    <span className="font-medium text-gray-900">
                      {rooms} {rooms === 1 ? "Room" : "Rooms"},{" "}
                      {searchDates.guests.adults}{" "}
                      {searchDates.guests.adults === 1 ? "Adult" : "Adults"}
                      {searchDates.guests.children > 0 && (
                        <>
                          , {searchDates.guests.children}{" "}
                          {searchDates.guests.children === 1
                            ? "Child"
                            : "Children"}
                        </>
                      )}
                    </span>
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-[280px] md:w-[320px] bg-white rounded-lg border shadow-lg p-4 max-h-[400px] overflow-y-auto"
                  onInteractOutside={(e) => {
                    if (
                      searchDates.guests.children > 0 &&
                      childrenAges.some((age) => age === 0)
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div>
                      <p className="font-medium text-sm">Room</p>
                    </div>
                    <div>
                      <select
                        value={rooms}
                        onChange={(e) => setRooms(Number(e.target.value))}
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          (r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div>
                      <p className="font-medium text-sm">Adults</p>
                      <p className="text-xs text-gray-500">Ages 13+</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          setSearchDates((prev) => ({
                            ...prev,
                            guests: {
                              ...prev.guests,
                              adults: Math.max(1, prev.guests.adults - 1),
                            },
                          }))
                        }
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {searchDates.guests.adults}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          setSearchDates((prev) => ({
                            ...prev,
                            guests: {
                              ...prev.guests,
                              adults: prev.guests.adults + 1,
                            },
                          }))
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-sm">Children</p>
                      <p className="text-xs text-gray-500">Ages 0–12</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          setSearchDates((prev) => ({
                            ...prev,
                            guests: {
                              ...prev.guests,
                              children: Math.max(0, prev.guests.children - 1),
                            },
                          }))
                        }
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {searchDates.guests.children}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          setSearchDates((prev) => ({
                            ...prev,
                            guests: {
                              ...prev.guests,
                              children: prev.guests.children + 1,
                            },
                          }))
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {searchDates.guests.children > 0 && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <p className="font-medium text-sm">Age of Children</p>
                      <div className="grid grid-cols-2 gap-3">
                        {childrenAges.map((age, index) => (
                          <div key={index} className="flex flex-col">
                            <span className="text-xs text-gray-600 mb-1">
                              Child {index + 1}
                            </span>
                            <select
                              className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={age}
                              onChange={(e) => {
                                handleChildAgeChange(
                                  index,
                                  Number(e.target.value),
                                );
                                setValidationError(null);
                              }}
                            >
                              <option value={0}>-- Select --</option>
                              {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                (a) => (
                                  <option key={a} value={a}>
                                    {a} {a === 1 ? "yr" : "yrs"}
                                  </option>
                                ),
                              )}
                            </select>
                          </div>
                        ))}
                      </div>

                      {childrenAges.some((age) => age === 0) && (
                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                          <span>⚠️</span>
                          <span>Please select age for all children</span>
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={handleGuestPopoverApply}
                      className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                        searchDates.guests.children > 0 &&
                        childrenAges.some((age) => age === 0)
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                      disabled={
                        searchDates.guests.children > 0 &&
                        childrenAges.some((age) => age === 0)
                      }
                      type="button"
                    >
                      Apply
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="min-w-0 sm:col-span-2 lg:col-span-1 flex items-stretch">
              <button
                onClick={handleApply}
                className="w-full lg:w-auto lg:min-w-[120px] bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2.5 sm:py-3 rounded-xl transition-all shadow-sm hover:shadow-md text-sm uppercase tracking-wide"
                type="button"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {validationError && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm font-medium rounded-lg px-3 py-2">
            {validationError}
          </div>
        )}
      </div>
    </section>
  );
}
