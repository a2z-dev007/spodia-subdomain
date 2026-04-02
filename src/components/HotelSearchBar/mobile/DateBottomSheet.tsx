'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    checkInDate: Date | null;
    checkOutDate: Date | null;
    onSelectDates: (checkIn: Date | null, checkOut: Date | null) => void;
}

function DateBottomSheet({
    isOpen,
    onClose,
    checkInDate,
    checkOutDate,
    onSelectDates
}: DateBottomSheetProps) {
    const [tempCheckIn, setTempCheckIn] = useState<Date | null>(checkInDate);
    const [tempCheckOut, setTempCheckOut] = useState<Date | null>(checkOutDate);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setTempCheckIn(checkInDate);
        setTempCheckOut(checkOutDate);
    }, [checkInDate, checkOutDate]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = '0';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'unset';
            document.body.style.width = 'unset';
            document.body.style.top = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'unset';
            document.body.style.width = 'unset';
            document.body.style.top = 'unset';
        };
    }, [isOpen]);

    const handleDone = () => {
        console.log('✅ Dates Done clicked, checkIn:', tempCheckIn, 'checkOut:', tempCheckOut);
        onSelectDates(tempCheckIn, tempCheckOut);
        onClose();
    };

    const getDaysBetween = () => {
        if (!tempCheckIn || !tempCheckOut) return 0;
        const diff = tempCheckOut.getTime() - tempCheckIn.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    if (!isOpen || !mounted) return null;

    const content = (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 transition-opacity"
                style={{ zIndex: 2147483646 }}
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div 
                className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl animate-slide-up max-h-[90vh] flex flex-col"
                style={{ zIndex: 2147483647 }}
            >
                {/* Header */}
                <div className="border-b sticky top-0 bg-white rounded-t-3xl z-10">
                    <div className="flex items-center justify-between p-4">
                        <h2 className="text-lg font-semibold">Select dates</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex justify-center">
                        <DatePicker
                            selected={tempCheckIn}
                            onChange={(dates) => {
                                const [start, end] = dates as [Date | null, Date | null];
                                setTempCheckIn(start);
                                setTempCheckOut(end);
                            }}
                            startDate={tempCheckIn}
                            endDate={tempCheckOut}
                            selectsRange
                            inline
                            monthsShown={12}
                            minDate={new Date()}
                            calendarClassName="mobile-date-picker-full-year"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-white sticky bottom-0 z-10">
                    {tempCheckIn && tempCheckOut && (
                        <div className="text-center mb-3 text-sm text-gray-600">
                            {tempCheckIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {tempCheckOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({getDaysBetween()}-{getDaysBetween() === 1 ? 'night' : 'nights'} stay)
                        </div>
                    )}
                    <Button
                        onClick={handleDone}
                        className="w-full blue-gradient-btn text-white py-6 rounded-lg text-base font-semibold"
                        disabled={!tempCheckIn || !tempCheckOut}
                    >
                        Done
                    </Button>
                </div>
            </div>

            <style jsx global>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
                
                .mobile-date-picker-full-year {
                    border: none !important;
                    font-family: inherit;
                    width: 100%;
                }
                
                .mobile-date-picker-full-year .react-datepicker__month-container {
                    width: 100%;
                    margin-bottom: 2rem;
                }
                
                .mobile-date-picker-full-year .react-datepicker__header {
                    background-color: white !important;
                    border-bottom: 1px solid #e5e7eb;
                    padding: 1rem 0;
                }
                
                .mobile-date-picker-full-year .react-datepicker__current-month {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 0.75rem;
                }
                
                .mobile-date-picker-full-year .react-datepicker__day-name,
                .mobile-date-picker-full-year .react-datepicker__day {
                    width: 2.75rem;
                    height: 2.75rem;
                    line-height: 2.75rem;
                    margin: 0.15rem;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                }
                
                .mobile-date-picker-full-year .react-datepicker__day-name {
                    color: #6b7280;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                }
                
                /* Selected date range styling - Blue for all selected dates */
                .mobile-date-picker-full-year .react-datepicker__day--selected,
                .mobile-date-picker-full-year .react-datepicker__day--range-start,
                .mobile-date-picker-full-year .react-datepicker__day--range-end {
                    background-color: #1d4ed8 !important;
                    color: white !important;
                    font-weight: 700;
                    border-radius: 0.5rem !important;
                }
                
                .mobile-date-picker-full-year .react-datepicker__day--in-range {
                    background-image: linear-gradient(90deg, #078ED8 0%, #43C6FF 100%);
                    color: #fff !important;
                    font-weight: 500;
                    border-radius: 0.5rem !important;
                }
                
                .mobile-date-picker-full-year .react-datepicker__day--range-start {
                    border-radius: 0.5rem !important;
                }
                
                .mobile-date-picker-full-year .react-datepicker__day--range-end {
                    border-radius: 0.5rem !important;
                }
                
                .mobile-date-picker-full-year .react-datepicker__day--range-start.react-datepicker__day--range-end {
                    border-radius: 0.5rem !important;
                }
                
                .mobile-date-picker-full-year .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range) {
                    background-image: linear-gradient(90deg, #078ED8 0%, #43C6FF 100%);
                    color: #fff !important;
                    border-radius: 0.5rem !important;
                }
                
                .mobile-date-picker-full-year .react-datepicker__day:hover {
                    background-color: #f3f4f6;
                    border-radius: 0.375rem;
                }
                
                .mobile-date-picker-full-year .react-datepicker__day--keyboard-selected {
                    background-color: #dbeafe;
                    color: #1e40af;
                }
                
                .mobile-date-picker-full-year .react-datepicker__day--disabled {
                    color: #d1d5db !important;
                    cursor: not-allowed;
                }
                
                .mobile-date-picker-full-year .react-datepicker__navigation {
                    top: 1.25rem;
                }
                
                .mobile-date-picker-full-year .react-datepicker__navigation-icon::before {
                    border-color: #6b7280;
                    border-width: 2px 2px 0 0;
                    height: 9px;
                    width: 9px;
                }
                
                .mobile-date-picker-full-year .react-datepicker__month-dropdown,
                .mobile-date-picker-full-year .react-datepicker__year-dropdown {
                    background-color: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    padding: 0.5rem;
                }
                
                .mobile-date-picker-full-year .react-datepicker__month-option,
                .mobile-date-picker-full-year .react-datepicker__year-option {
                    padding: 0.5rem;
                    border-radius: 0.25rem;
                }
                
                .mobile-date-picker-full-year .react-datepicker__month-option:hover,
                .mobile-date-picker-full-year .react-datepicker__year-option:hover {
                    background-color: #f3f4f6;
                }
            `}</style>
        </>
    );

    return createPortal(content, document.body);
}

export default DateBottomSheet;
