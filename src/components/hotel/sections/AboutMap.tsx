"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation } from "lucide-react";
import type { ListingDetail } from "@/types/hotelDetails";

type Props = {
  hotelData?: ListingDetail | null;
};

export default function AboutMap({ hotelData }: Props) {
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

  return (
    <>
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
    </>
  );
}
