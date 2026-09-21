"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Compass, Bus, Navigation, Plane, Train } from "lucide-react";
import type { ListingDetail } from "@/types/hotelDetails";

type Props = {
  hotelData?: ListingDetail | null;
};

export default function HotelLocationContent({ hotelData }: Props) {
  const name = hotelData?.name || "Hotel Location";
  const address = hotelData?.address || `${hotelData?.city_name || 'Guwahati'}, ${hotelData?.state_name || 'Assam'}`;
  const lat = hotelData?.lat;
  const lon = hotelData?.lon;

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    let checkGoogleMaps: NodeJS.Timeout;
    
    const initializeMap = () => {
      const google = (window as any).google;
      if (!mapRef.current || !google) return;

      const mapLat = lat || 26.1445;
      const mapLng = lon || 91.7362;

      const mapInstance = new google.maps.Map(mapRef.current, {
        zoom: 15,
        center: { lat: mapLat, lng: mapLng },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      const hotelMarker = new google.maps.Marker({
        position: { lat: mapLat, lng: mapLng },
        map: mapInstance,
        title: name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#ef4444" stroke="white" stroke-width="4"/>
              <path d="M20 10C16.6863 10 14 12.6863 14 16C14 20.5 20 30 20 30S26 20.5 26 16C26 12.6863 23.3137 10 20 10ZM20 18.5C18.6193 18.5 17.5 17.3807 17.5 16C17.5 14.6193 18.6193 13.5 20 13.5C21.3807 13.5 22.5 14.6193 22.5 16C22.5 17.3807 21.3807 18.5 20 18.5Z" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 40)
        }
      });

      const hotelInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #ef4444; font-weight: bold;">${name}</h3>
            <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.4;">${address}</p>
          </div>
        `
      });

      hotelMarker.addListener('click', () => {
        hotelInfoWindow.open(mapInstance, hotelMarker);
      });

      setMap(mapInstance);
      setIsMapLoaded(true);
    };

    if ((window as any).google && (window as any).google.maps) {
      initializeMap();
    } else {
      checkGoogleMaps = setInterval(() => {
        if ((window as any).google && (window as any).google.maps) {
          clearInterval(checkGoogleMaps);
          initializeMap();
        }
      }, 100);
    }
    
    return () => {
      if (checkGoogleMaps) clearInterval(checkGoogleMaps);
    };
  }, [lat, lon, name, address]);

  const openInGoogleMaps = () => {
    const query = lat && lon ? `${lat},${lon}` : encodeURIComponent(`${name}, ${address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const centerOnHotel = () => {
    if (map) {
      const mapLat = lat || 26.1445;
      const mapLng = lon || 91.7362;
      map.panTo({ lat: mapLat, lng: mapLng });
      map.setZoom(15);
    }
  };

  const getKeyLandmarks = () => {
    const landmarks = [];
    const cityName = hotelData?.city_name || 'Guwahati';
    
    if (cityName.toLowerCase().includes('dibrugarh')) {
      landmarks.push(
        { name: 'Kaziranga National Park', distance: '45 km' },
        { name: 'Maijan Tea Gardens', distance: '2 km' },
        { name: 'Brahmaputra River', distance: '1.5 km' }
      );
    } else {
      landmarks.push(
        { name: `${cityName} City Center`, distance: '5 km' },
        { name: `${cityName} Local Market`, distance: '3 km' }
      );
    }
    return landmarks;
  };

  const getTransportOptions = () => {
    const transport = [];
    const cityName = hotelData?.city_name || 'Guwahati';
    
    if (cityName.toLowerCase().includes('dibrugarh')) {
      transport.push(
        { name: 'Dibrugarh Airport', distance: '15 km' },
        { name: 'Dibrugarh Railway Station', distance: '12 km' },
        { name: 'Local Bus Stand', distance: '8 km' }
      );
    } else {
      transport.push(
        { name: `${cityName} Airport`, distance: '20 km' },
        { name: `${cityName} Railway Station`, distance: '8 km' },
        { name: 'Main Bus Station', distance: '3.5 km' }
      );
    }
    return transport;
  };

  const landmarks = getKeyLandmarks();
  const transportOptions = getTransportOptions();

  return (
    <section className="bg-white py-12 md:py-16 px-4 md:px-12 w-full relative overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Location &amp; Access
          </h2>
          <div className="text-gray-500 font-medium text-sm md:text-base">
            <p className="font-bold text-gray-800">{name}</p>
            <p className="flex items-center justify-center md:justify-start gap-1 mt-0.5">
              <MapPin className="w-4 h-4 text-[#FF9530] shrink-0" />
              <span>{address}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Map Section */}
          <div className="lg:col-span-7 h-[400px] sm:h-[450px] lg:h-full min-h-[400px] rounded-3xl overflow-hidden relative shadow-sm border border-gray-200">
            <div ref={mapRef} className="w-full h-full bg-gray-100 absolute inset-0 z-0" />
            
            {!isMapLoaded && (
              <div className="absolute inset-0 z-0 bg-gray-100 flex items-center justify-center">
                <div className="text-gray-500 animate-pulse flex flex-col items-center">
                  <MapPin className="w-8 h-8 mb-2 opacity-50" />
                  <span>Loading map...</span>
                </div>
              </div>
            )}

            {isMapLoaded && (
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                  onClick={openInGoogleMaps}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-md shadow-lg text-sm transition-colors border flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Open in Google Maps
                </button>
                <button
                  onClick={centerOnHotel}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-md shadow-lg text-sm transition-colors border flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Center on Hotel
                </button>
              </div>
            )}

            {/* Map Overlay Card */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3.5 border border-gray-100 max-w-[340px] z-10">
              <div className="bg-[#FF9530] w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                <MapPin size={20} className="text-white" />
              </div>
              <div className="overflow-hidden min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">{name}</h4>
                <p className="text-xs text-gray-500 truncate">{address}</p>
              </div>
            </div>
          </div>

          {/* Info Side Card */}
          <div className="lg:col-span-5 bg-gray-50/80 rounded-3xl border border-gray-100 p-6 sm:p-8 md:p-10 shadow-xs">
            {/* Landmarks Group */}
            <div className="mb-8 pb-8 border-b border-gray-200/60">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="bg-orange-100/70 w-8 h-8 rounded-lg flex items-center justify-center">
                    <Compass size={18} className="text-[#FF9530]" />
                  </div>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    KEY LANDMARKS
                  </span>
                </div>
              </div>

              <div className="space-y-3.5">
                {landmarks.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between items-start sm:items-center bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs gap-3">
                    <span className="text-xs sm:text-sm font-bold text-gray-700">{item.name}</span>
                    <span className="bg-orange-50 text-[#FF9530] text-xs font-black px-2.5 py-1 rounded-md border border-orange-200/50 whitespace-nowrap shrink-0 mt-0.5 sm:mt-0">{item.distance}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transport Group */}
            <div>
              <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="bg-orange-100/70 w-8 h-8 rounded-lg flex items-center justify-center">
                    <Bus size={18} className="text-[#FF9530]" />
                  </div>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    TRANSPORT HUB
                  </span>
                </div>
              </div>

              <div className="space-y-3.5">
                {transportOptions.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between items-start sm:items-center bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs gap-3">
                    <span className="text-xs sm:text-sm font-bold text-gray-700">{item.name}</span>
                    <span className="bg-orange-50 text-[#FF9530] text-xs font-black px-2.5 py-1 rounded-md border border-orange-200/50 whitespace-nowrap shrink-0 mt-0.5 sm:mt-0">{item.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
