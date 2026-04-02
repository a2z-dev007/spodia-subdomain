'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuestsBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    guests: { adults: number; children: number };
    rooms: number;
    childrenAges: number[];
    onUpdate: (
        guests: { adults: number; children: number },
        rooms: number,
        childrenAges: number[]
    ) => void;
}

function GuestsBottomSheet({
    isOpen,
    onClose,
    guests,
    rooms,
    childrenAges,
    onUpdate
}: GuestsBottomSheetProps) {
    const [tempGuests, setTempGuests] = useState(guests);
    const [tempRooms, setTempRooms] = useState(rooms);
    const [tempChildrenAges, setTempChildrenAges] = useState<number[]>(childrenAges);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setTempGuests(guests);
        setTempRooms(rooms);
        setTempChildrenAges(childrenAges);
    }, [guests, rooms, childrenAges]);

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

    // Sync children ages with children count
    useEffect(() => {
        setTempChildrenAges((prev) => {
            if (tempGuests.children > prev.length) {
                return [...prev, ...Array(tempGuests.children - prev.length).fill(0)];
            } else {
                return prev.slice(0, tempGuests.children);
            }
        });
    }, [tempGuests.children]);

    const handleDone = () => {
        // Validate that all children have ages selected
        if (tempGuests.children > 0 && tempChildrenAges.some(age => age === 0)) {
            return; // Don't close if validation fails
        }
        onUpdate(tempGuests, tempRooms, tempChildrenAges);
        onClose();
    };

    const handleChildAgeChange = (index: number, age: number) => {
        setTempChildrenAges(prev => {
            const updated = [...prev];
            updated[index] = age;
            return updated;
        });
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
                <div className="flex items-center justify-end p-4 border-b sticky top-0 bg-white rounded-t-3xl">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Adults */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="text-base font-semibold text-gray-900">Adults</div>
                            <div className="text-sm text-gray-500">Ages 13+</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() =>
                                    setTempGuests(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))
                                }
                                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#43C6FF] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={tempGuests.adults <= 1}
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="text-lg font-semibold w-8 text-center">{tempGuests.adults}</span>
                            <button
                                onClick={() =>
                                    setTempGuests(prev => ({ ...prev, adults: prev.adults + 1 }))
                                }
                                className="w-10 h-10 rounded-full border-2 border-[#43C6FF] flex items-center justify-center hover:bg-blue-50 transition-colors"
                            >
                                <Plus className="w-5 h-5 text-blue-600" />
                            </button>
                        </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="text-base font-semibold text-gray-900">Children</div>
                            <div className="text-sm text-gray-500">Ages 1–10</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() =>
                                    setTempGuests(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))
                                }
                                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#43C6FF] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={tempGuests.children <= 0}
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="text-lg font-semibold w-8 text-center">{tempGuests.children}</span>
                            <button
                                onClick={() =>
                                    setTempGuests(prev => ({ ...prev, children: prev.children + 1 }))
                                }
                                className="w-10 h-10 rounded-full border-2 border-[#43C6FF] flex items-center justify-center hover:bg-blue-50 transition-colors"
                            >
                                <Plus className="w-5 h-5 text-blue-600" />
                            </button>
                        </div>
                    </div>

                    {/* Rooms */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="text-base font-semibold text-gray-900">Rooms</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setTempRooms(prev => Math.max(1, prev - 1))}
                                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#43C6FF] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={tempRooms <= 1}
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="text-lg font-semibold w-8 text-center">{tempRooms}</span>
                            <button
                                onClick={() => setTempRooms(prev => prev + 1)}
                                className="w-10 h-10 rounded-full border-2 border-[#43C6FF] flex items-center justify-center hover:bg-blue-50 transition-colors"
                            >
                                <Plus className="w-5 h-5 brand-blue" />
                            </button>
                        </div>
                    </div>

                    {/* Children Ages */}
                    {tempGuests.children > 0 && (
                        <div className="mt-6 pt-6 border-t">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Age of Children</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {tempChildrenAges.map((age, index) => (
                                    <div key={index}>
                                        <label className="text-sm text-gray-600 mb-2 block">
                                            Child {index + 1}
                                        </label>
                                        <select
                                            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:border-[#43C6FF] focus:outline-none"
                                            value={age}
                                            onChange={e => handleChildAgeChange(index, Number(e.target.value))}
                                        >
                                            <option value={0}>Select age</option>
                                            {Array.from({ length: 10 }, (_, i) => i + 1).map(a => (
                                                <option key={a} value={a}>
                                                    {a} {a === 1 ? "year" : "years"}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            {/* Validation Error */}
                            {tempChildrenAges.some(age => age === 0) && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600 flex items-center gap-2">
                                        <span>⚠️</span>
                                        <span>Please select age for all children</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-white sticky bottom-0">
                    <Button
                        onClick={handleDone}
                        className={`w-full py-6 rounded-lg text-base font-semibold transition-colors ${
                            tempGuests.children > 0 && tempChildrenAges.some(age => age === 0)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'blue-gradient-btn text-white'
                        }`}
                        disabled={tempGuests.children > 0 && tempChildrenAges.some(age => age === 0)}
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
            `}</style>
        </>
    );

    return createPortal(content, document.body);
}

export default GuestsBottomSheet;
