"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HotelData } from "@/types/HotelTypes";
import { useEffect } from "react";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import Link from "next/link";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom orange marker icon
const createCustomIcon = (isSelected: boolean) => {
  const size = isSelected ? 48 : 40;
  const color = isSelected ? "#ea580c" : "#f97316"; // orange-600 : orange-500

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px;">
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${color}"/>
          <circle cx="12" cy="9" r="2" fill="white"/>
        </svg>
        ${isSelected ? '<div style="position: absolute; top: -8px; right: -8px; width: 20px; height: 20px; background: #dc2626; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: white; font-weight: bold;">★</div>' : ""}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

interface MapUpdaterProps {
  hotels: HotelData[];
  selectedHotel: HotelData | null;
}

function MapUpdater({ hotels, selectedHotel }: MapUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    // Ensure map is properly sized
    const timer = setTimeout(() => {
      map.invalidateSize();

      if (selectedHotel && selectedHotel.lat && selectedHotel.lon) {
        // Zoom to selected hotel with smooth animation
        map.flyTo([selectedHotel.lat, selectedHotel.lon], 15, {
          duration: 0.8,
          easeLinearity: 0.5,
        });
      } else if (hotels.length > 0) {
        // Fit bounds to show all hotels in the current page
        const validHotels = hotels.filter((h) => h.lat && h.lon);
        if (validHotels.length > 0) {
          const bounds = L.latLngBounds(
            validHotels.map((h) => [h.lat!, h.lon!]),
          );

          // Get viewport dimensions for responsive padding
          const mapContainer = map.getContainer();
          const containerHeight = mapContainer.clientHeight;
          const containerWidth = mapContainer.clientWidth;

          // Calculate responsive padding based on viewport
          const verticalPadding = Math.min(containerHeight * 0.15, 80);
          const horizontalPadding = Math.min(containerWidth * 0.1, 60);

          // Check if all hotels are in a small area (same city)
          const boundsSize = bounds
            .getNorthEast()
            .distanceTo(bounds.getSouthWest());

          if (boundsSize < 50000) {
            // Less than 50km, likely same city
            // Zoom to city level - fit all hotels in viewport
            map.fitBounds(bounds, {
              padding: [verticalPadding, horizontalPadding],
              maxZoom: 14,
              animate: true,
              duration: 0.5,
            });
          } else {
            // Show wider area (state/region level)
            map.fitBounds(bounds, {
              padding: [verticalPadding * 0.7, horizontalPadding * 0.7],
              maxZoom: 11,
              animate: true,
              duration: 0.5,
            });
          }
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [selectedHotel, hotels, map]);

  return null;
}

interface HotelsMapProps {
  hotels: HotelData[];
  selectedHotel: HotelData | null;
  onMarkerClick: (hotel: HotelData) => void;
}

export default function HotelsMap({
  hotels,
  selectedHotel,
  onMarkerClick,
}: HotelsMapProps) {
  const validHotels = hotels.filter((hotel) => hotel.lat && hotel.lon);

  // Calculate initial bounds from hotels
  const getInitialBounds = () => {
    if (validHotels.length === 0) return undefined;

    return L.latLngBounds(validHotels.map((h) => [h.lat!, h.lon!]));
  };

  const initialBounds = getInitialBounds();

  // Center of India (fallback)
  const indiaCenter: [number, number] = [20.5937, 78.9629];

  const defaultCenter: [number, number] =
    validHotels.length > 0
      ? [validHotels[0].lat!, validHotels[0].lon!]
      : indiaCenter;

  if (validHotels.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Hotels with Location Data
          </h3>
          <p className="text-gray-500">
            Hotels in this area don't have map coordinates available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-100" style={{ position: "relative" }}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        bounds={initialBounds}
        boundsOptions={{ padding: [60, 60], maxZoom: 14 }}
        scrollWheelZoom={true}
        zoomControl={true}
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          minZoom={3}
        />

        <MapUpdater hotels={validHotels} selectedHotel={selectedHotel} />

        {validHotels.map((hotel) => {
          const coverImage =
            hotel.images?.find((img) => img.cover_photo)?.file ||
            hotel.images?.[0]?.file ||
            "/images/articleImg.png";
          const rating = hotel.review_rating || 0;
          const price = hotel.sbr_rate || 0;
          const isSelected = selectedHotel?.id === hotel.id;

          return (
            <Marker
              key={hotel.id}
              position={[hotel.lat!, hotel.lon!]}
              icon={createCustomIcon(isSelected)}
              eventHandlers={{
                click: () => onMarkerClick(hotel),
              }}
            >
              <Popup
                className="custom-popup leaflet-popup-custom"
                maxWidth={300}
                minWidth={280}
                closeButton={true}
                autoClose={true}
                closeOnClick={true}
                offset={[0, -10]}
              >
                <div className="popup-content-wrapper">
                  <div className="relative w-full h-36 mb-3 rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src={coverImage}
                      alt={hotel.name || "Hotel"}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="300px"
                      priority
                    />
                  </div>

                  <div className="space-y-2.5 px-1">
                    <h3 className="font-bold text-gray-900 line-clamp-2 text-base leading-tight">
                      {hotel.name}
                    </h3>

                    <div className="flex items-start gap-1.5 text-xs text-gray-600">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span className="line-clamp-2">
                        {hotel.address ||
                          `${hotel.city_name}, ${hotel.state_name}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">
                          Starting from
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{price.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">/ night</span>
                        </div>
                      </div>
                      {rating > 0 && (
                        <div className="text-right">
                          <span className="text-xs text-gray-500">
                            {hotel.review_rating_count || 0} reviews
                          </span>
                        </div>
                      )}
                    </div>

                    {price > 0 && (
                      <Link
                        href={`/hotels/${hotel.slug || `${hotel.name}-${hotel.city_name}`.replace(/\s+/g, "-").toLowerCase()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700  text-center py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] text-white"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
