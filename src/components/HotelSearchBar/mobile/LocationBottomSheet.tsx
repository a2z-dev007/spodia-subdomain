'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CitySelect from '@/components/ui/CitySelect';

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

interface LocationBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    selectedLocation: CityOption | null;
    onSelectLocation: (location: CityOption | null) => void;
}

function LocationBottomSheet({
    isOpen,
    onClose,
    selectedLocation,
    onSelectLocation
}: LocationBottomSheetProps) {
    const [tempLocation, setTempLocation] = useState<CityOption | null>(selectedLocation);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setTempLocation(selectedLocation);
    }, [selectedLocation]);

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
        onSelectLocation(tempLocation);
        onClose();
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
                className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl animate-slide-up min-h-[64vh] max-h-[90vh] flex flex-col"
                style={{ zIndex: 2147483647 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-3xl">
                    <h2 className="text-lg font-semibold">Enter destination</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* Search Input */}
                    <div className="mb-6" style={{ zIndex: 2147483648 }}>
                        <CitySelect
                            value={tempLocation ? { label: tempLocation.name, value: tempLocation.id } : null}
                            onChange={option => setTempLocation(option ? option : null)}
                            placeholder="e.g. city, landmark, address"
                        />
                    </div>

                    {/* Around Current Location - Commented out for now */}
                    {/* <div className="mb-6">
                        <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <Navigation className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-900">Around current location</span>
                        </button>
                    </div> */}

                    {/* Trending Destinations - Commented out for now */}
                    {/* <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Trending destinations</h3>
                        <div className="space-y-2">
                            {[
                                { name: 'Varanasi', country: 'India' },
                                { name: 'Lucknow', country: 'India' },
                                { name: 'New Delhi', country: 'India' },
                                { name: 'Ayodhya', country: 'India' },
                                { name: 'Vrindavan', country: 'India' }
                            ].map((city, index) => (
                                <button
                                    key={index}
                                    className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                    onClick={() => {
                                        // This would need to be connected to actual city data
                                        // For now, just close the sheet
                                    }}
                                >
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <div className="text-left">
                                        <div className="font-medium text-gray-900">{city.name}</div>
                                        <div className="text-sm text-gray-500">{city.country}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div> */}
                </div>

                {/* Footer with Done Button */}
                <div className="p-4 border-t bg-white sticky bottom-0">
                    <Button
                        onClick={handleDone}
                        className="w-full blue-gradient-btn text-white py-6 rounded-lg text-base font-semibold"
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

export default LocationBottomSheet;
