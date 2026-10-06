'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface ContactGoogleMapProps {
  lat: number;
  lng: number;
  title: string;
}

export default function ContactGoogleMap({ lat, lng, title }: ContactGoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    let checkGoogleMaps: NodeJS.Timeout;

    const initializeMap = () => {
      if (!mapRef.current || !(window as any).google || !(window as any).google.maps) return;

      const mapInstance = new (window as any).google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
        mapTypeId: (window as any).google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
      });

      const hotelMarker = new (window as any).google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        title: title,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#FF9530" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3" fill="white"></circle>
            </svg>
          `),
          scaledSize: new (window as any).google.maps.Size(40, 40),
          anchor: new (window as any).google.maps.Point(20, 40)
        }
      });

      const hotelInfoWindow = new (window as any).google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; text-align: center;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold; color: #111;">${title}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">View on Google Maps</p>
          </div>
        `
      });

      hotelMarker.addListener('click', () => {
        hotelInfoWindow.open(mapInstance, hotelMarker);
      });

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
      }, 500);
    }

    return () => {
      if (checkGoogleMaps) clearInterval(checkGoogleMaps);
    };
  }, [lat, lng, title]);

  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <div className="w-full h-full relative group">
      <div ref={mapRef} className="w-full h-full grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000" />
      
      {!isMapLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <MapPin className="w-8 h-8 mb-2 animate-bounce text-[#FF9530]" />
          <span className="font-medium text-sm">Loading map...</span>
        </div>
      )}

      {isMapLoaded && (
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={openInGoogleMaps}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 px-4 py-2 rounded-xl shadow-lg border border-gray-200 text-xs font-bold flex items-center gap-2 hover:text-[#FF9530] transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Open in Maps
          </button>
        </div>
      )}
    </div>
  );
}
