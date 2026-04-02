"use client"

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, MapPin, Camera, Car, Utensils, Plane, Train, Bus, Navigation } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"

interface MapLocationSectionProps {
  hotelData?: any;
}

export default function MapLocationSection({ hotelData }: MapLocationSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    keyLandmarks: true,
    attractions: false,
    transport: false,
    restaurants: false,
    otherLandmarks: false,
  });
  const [isGuestDescriptionExpanded, setIsGuestDescriptionExpanded] = useState(false);

  // Initialize Google Map
  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.google || !hotelData) return;

      // Use hotel coordinates or fallback to city center
      const lat = hotelData.lat || 26.1445; // Default to Guwahati if no coordinates
      const lng = hotelData.lon || 91.7362;

      const mapInstance = new google.maps.Map(mapRef.current, {
        zoom: 14,
        center: { lat, lng },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      // Add hotel marker
      const hotelMarker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance,
        title: hotelData.name || 'Hotel Location',
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

      // Hotel info window
      const hotelInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #ef4444; font-weight: bold;">${hotelData.name || 'Hotel'}</h3>
            <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.4;">${hotelData.address || 'Hotel Location'}</p>
            ${hotelData.review_rating ? `<div style="margin-top: 8px; color: #f59e0b;">★ ${hotelData.review_rating} Rating</div>` : ''}
          </div>
        `
      });

      hotelMarker.addListener('click', () => {
        hotelInfoWindow.open(mapInstance, hotelMarker);
      });

      // Add nearby landmarks markers
      const landmarks = getKeyLandmarks();
      landmarks.forEach((landmark, index) => {
        // Generate approximate coordinates around the hotel
        const offsetLat = (Math.random() - 0.5) * 0.02; // ~1km radius
        const offsetLng = (Math.random() - 0.5) * 0.02;
        
        const landmarkMarker = new google.maps.Marker({
          position: { 
            lat: lat + offsetLat, 
            lng: lng + offsetLng 
          },
          map: mapInstance,
          title: landmark.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="13" fill="#3b82f6" stroke="white" stroke-width="3"/>
                <circle cx="15" cy="15" r="6" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 30)
          }
        });

        const landmarkInfoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h4 style="margin: 0 0 4px 0; color: #3b82f6; font-weight: bold;">${landmark.name}</h4>
              <p style="margin: 0; color: #666; font-size: 12px;">${landmark.type}</p>
              <div style="margin-top: 4px; color: #f59e0b; font-size: 12px;">★ ${landmark.rating} • ${landmark.distance}</div>
            </div>
          `
        });

        landmarkMarker.addListener('click', () => {
          landmarkInfoWindow.open(mapInstance, landmarkMarker);
        });
      });

      setMap(mapInstance);
      setIsMapLoaded(true);
    };

    // Check if Google Maps is loaded
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      // Wait for Google Maps to load
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps);
          initializeMap();
        }
      }, 100);

      return () => clearInterval(checkGoogleMaps);
    }
  }, [hotelData]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Generate dynamic landmarks based on hotel location and data
  const getKeyLandmarks = () => {
    const landmarks = [];
    
    // Add city-specific landmarks
    if (hotelData?.city_name) {
      const cityName = hotelData.city_name;
      
      // Dibrugarh specific landmarks
      if (cityName.toLowerCase().includes('dibrugarh')) {
        landmarks.push(
          {
            name: 'Kaziranga National Park',
            type: 'Tourist Attraction',
            rating: 4.5,
            distance: '45 km',
            popular: true,
            image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=100&h=100&fit=crop'
          },
          {
            name: 'Maijan Tea Gardens',
            type: 'Natural Attraction', 
            rating: 4.2,
            distance: '2 km',
            popular: true,
            image: 'https://images.unsplash.com/photo-1563822249366-6c8de0f8e2e8?w=100&h=100&fit=crop'
          },
          {
            name: 'Brahmaputra River',
            type: 'Natural Landmark',
            rating: 4.8,
            distance: '1.5 km',
            popular: false,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
          }
        );
      } else {
        // Generic landmarks for other cities
        landmarks.push(
          {
            name: `${cityName} City Center`,
            type: 'City Center',
            rating: 4.0,
            distance: '5 km',
            popular: false,
            image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=100&h=100&fit=crop'
          },
          {
            name: `${cityName} Railway Station`,
            type: 'Transport Hub',
            rating: 3.8,
            distance: '8 km',
            popular: false,
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&h=100&fit=crop'
          }
        );
      }
    }

    return landmarks;
  };

  const getTransportOptions = () => {
    const transport = [];
    
    if (hotelData?.city_name) {
      const cityName = hotelData.city_name;
      
      if (cityName.toLowerCase().includes('dibrugarh')) {
        transport.push(
          {
            name: 'Dibrugarh Airport',
            type: 'Airport',
            icon: Plane,
            distance: '15 km',
            time: '25 min drive'
          },
          {
            name: 'Dibrugarh Railway Station',
            type: 'Railway Station',
            icon: Train,
            distance: '12 km',
            time: '20 min drive'
          },
          {
            name: 'Local Bus Stand',
            type: 'Bus Station',
            icon: Bus,
            distance: '8 km',
            time: '15 min drive'
          }
        );
      } else {
        transport.push(
          {
            name: `${cityName} Airport`,
            type: 'Airport',
            icon: Plane,
            distance: '20 km',
            time: '30 min drive'
          },
          {
            name: `${cityName} Railway Station`,
            type: 'Railway Station',
            icon: Train,
            distance: '10 km',
            time: '18 min drive'
          }
        );
      }
    }

    return transport;
  };

  const getRestaurants = () => {
    const restaurants = [];
    
    // Add on-site restaurant if available
    if (hotelData?.servicedetails?.some((service: any) => 
      service.serviceType?.toLowerCase().includes('restaurant') || 
      service.serviceType?.toLowerCase().includes('dining')
    )) {
      restaurants.push({
        name: 'The Piano Room',
        type: 'On-site Restaurant',
        cuisine: 'Assamese & International',
        rating: 4.3,
        distance: 'On-site'
      });
    }

    // Add nearby restaurants based on location
    if (hotelData?.city_name) {
      restaurants.push(
        {
          name: 'Local Assamese Cuisine',
          type: 'Traditional Restaurant',
          cuisine: 'Assamese',
          rating: 4.1,
          distance: '3 km'
        },
        {
          name: 'Multi-Cuisine Restaurant',
          type: 'Family Restaurant',
          cuisine: 'Indian & Chinese',
          rating: 3.9,
          distance: '5 km'
        }
      );
    }

    return restaurants;
  };

  const getAttractions = () => {
    const attractions = [];
    
    if (hotelData?.city_name?.toLowerCase().includes('dibrugarh')) {
      attractions.push(
        {
          name: 'Dehing Patkai Wildlife Sanctuary',
          type: 'Wildlife Sanctuary',
          rating: 4.4,
          distance: '35 km'
        },
        {
          name: 'Jokai Botanical Garden',
          type: 'Botanical Garden',
          rating: 4.0,
          distance: '18 km'
        },
        {
          name: 'Barbarua Maidam',
          type: 'Historical Site',
          rating: 3.8,
          distance: '25 km'
        }
      );
    } else {
      attractions.push(
        {
          name: 'Local Museum',
          type: 'Museum',
          rating: 3.9,
          distance: '12 km'
        },
        {
          name: 'City Park',
          type: 'Park',
          rating: 4.1,
          distance: '8 km'
        }
      );
    }

    return attractions;
  };

  const keyLandmarks = getKeyLandmarks();
  const transportOptions = getTransportOptions();
  const restaurants = getRestaurants();
  const attractions = getAttractions();

  return (
    <div className="bg-white rounded-[20px] border border-gray-200 w-full mx-auto p-6 md:p-8">
      {/* Location Section */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Location</h2>
        {
          hotelData?.review_rating > 0 && <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Location rated</span>
          <span className="text-orange-500 font-medium">{hotelData?.review_rating }</span>
          <span>by guests</span>
        </div>
        }
        
        {hotelData?.address && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
            <span>{hotelData.address}</span>
          </div>
        )}
        {/* {hotelData?.lat && hotelData?.lon && (
          <div className="text-xs text-gray-500 mt-1">
            Coordinates: {hotelData.lat.toFixed(6)}, {hotelData.lon.toFixed(6)}
          </div>
        )} */}
      </div>

      {/* What guests said */}
      {hotelData?.guest_description && (
        <div className="mb-6">
          <h3 className="text-base font-medium mb-3">What guests said</h3>
          <div className="text-sm text-gray-700 leading-relaxed">
            <p>
              {isGuestDescriptionExpanded 
                ? hotelData.guest_description 
                : hotelData.guest_description.length > 300 
                  ? `${hotelData.guest_description.substring(0, 300)}...` 
                  : hotelData.guest_description
              }
              {hotelData.guest_description.length > 300 && (
              <button
                onClick={() => setIsGuestDescriptionExpanded(!isGuestDescriptionExpanded)}
                className="text-orange-500 hover:text-orange-600 ml-2 font-medium mt-2 inline-flex items-center gap-1 transition-colors"
              >
                {isGuestDescriptionExpanded ? (
                  <>
                    Show less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show more <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
            </p>
            
          </div>
        </div>
      )}

      {/* Map and Landmarks Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Interactive Google Map */}
        <div className="flex-1">
          <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden relative">
            {/* Google Map Container */}
            <div 
              ref={mapRef} 
              className="w-full h-full"
              style={{ minHeight: '400px' }}
            />
            
            {/* Loading overlay */}
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading map...</p>
                </div>
              </div>
            )}

            {/* Map controls overlay */}
            {isMapLoaded && (
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    if (hotelData?.lat && hotelData?.lon) {
                      window.open(`https://www.google.com/maps?q=${hotelData.lat},${hotelData.lon}`, '_blank');
                    }
                  }}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-md shadow-lg text-sm transition-colors border"
                >
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Open in Google Maps
                  </div>
                </button>
                
                {map && (
                  <button
                    onClick={() => {
                      const lat = hotelData?.lat || 26.1445;
                      const lng = hotelData?.lon || 91.7362;
                      map.panTo({ lat, lng });
                      map.setZoom(16);
                    }}
                    className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-md shadow-lg text-sm transition-colors border"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Center on Hotel
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* Hotel info overlay */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg max-w-xs">
              <div className="text-sm font-semibold text-gray-800">{hotelData?.name || 'Hotel Location'}</div>
              <div className="text-xs text-gray-600 mt-1">{hotelData?.city_name}, {hotelData?.state_name}</div>
              {hotelData?.review_rating && (
                <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                  <span>★</span>
                  <span>{hotelData.review_rating} Rating</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Landmarks Sidebar */}
        <div className="w-full lg:w-80">
          {/* Key Landmarks */}
          <div className="mb-1">
            <button
              onClick={() => toggleSection('keyLandmarks')}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 border border-gray-200 rounded-md"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-sm">Key Landmarks</span>
              </div>
              {expandedSections.keyLandmarks ? 
                <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                <ChevronDown className="w-4 h-4 text-gray-500" />
              }
            </button>
            {expandedSections.keyLandmarks && (
              <div className="mt-2 space-y-3 px-3">
                {keyLandmarks.map((landmark, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Checkbox id={`landmark-${index}`} className="mt-1 w-4 h-4" />
                    {landmark.image && (
                      <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={landmark.image} 
                          alt={landmark.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      {landmark.popular && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded font-medium">
                            POPULAR
                          </span>
                        </div>
                      )}
                      <div className="text-sm font-medium">{landmark.name}</div>
                      <div className="text-xs text-gray-500">{landmark.type}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{landmark.rating}</span>
                        <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs">★</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{landmark.distance}</span>
                    </div>
                  </div>
                ))}
                {keyLandmarks.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No key landmarks available for this location
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Attractions */}
          <div className="mb-1">
            <button
              onClick={() => toggleSection('attractions')}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 border border-gray-200 rounded-md"
            >
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-sm">Attractions ({attractions.length})</span>
              </div>
              {expandedSections.attractions ? 
                <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                <ChevronDown className="w-4 h-4 text-gray-500" />
              }
            </button>
            {expandedSections.attractions && (
              <div className="mt-2 space-y-3 px-3">
                {attractions.map((attraction, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Checkbox id={`attraction-${index}`} className="mt-1 w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{attraction.name}</div>
                      <div className="text-xs text-gray-500">{attraction.type}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{attraction.rating}</span>
                        <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs">★</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{attraction.distance}</span>
                    </div>
                  </div>
                ))}
                {attractions.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No attractions available for this location
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Transport */}
          <div className="mb-1">
            <button
              onClick={() => toggleSection('transport')}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 border border-gray-200 rounded-md"
            >
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-sm">Transport ({transportOptions.length})</span>
              </div>
              {expandedSections.transport ? 
                <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                <ChevronDown className="w-4 h-4 text-gray-500" />
              }
            </button>
            {expandedSections.transport && (
              <div className="mt-2 space-y-3 px-3">
                {transportOptions.map((transport, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Checkbox id={`transport-${index}`} className="mt-1 w-4 h-4" />
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <transport.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{transport.name}</div>
                      <div className="text-xs text-gray-500">{transport.type}</div>
                      <div className="text-xs text-gray-400">{transport.time}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">{transport.distance}</span>
                    </div>
                  </div>
                ))}
                {transportOptions.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No transport information available
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Restaurants */}
          <div className="mb-1">
            <button
              onClick={() => toggleSection('restaurants')}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 border border-gray-200 rounded-md"
            >
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-sm">Restaurants ({restaurants.length})</span>
              </div>
              {expandedSections.restaurants ? 
                <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                <ChevronDown className="w-4 h-4 text-gray-500" />
              }
            </button>
            {expandedSections.restaurants && (
              <div className="mt-2 space-y-3 px-3">
                {restaurants.map((restaurant, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Checkbox id={`restaurant-${index}`} className="mt-1 w-4 h-4" />
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Utensils className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{restaurant.name}</div>
                      <div className="text-xs text-gray-500">{restaurant.type}</div>
                      <div className="text-xs text-gray-400">{restaurant.cuisine}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-sm">{restaurant.rating}</span>
                        <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs">★</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{restaurant.distance}</span>
                    </div>
                  </div>
                ))}
                {restaurants.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No restaurant information available
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Other Landmarks */}
          <div className="mb-1">
            <button
              onClick={() => toggleSection('otherLandmarks')}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 border border-gray-200 rounded-md"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-sm">Other Landmarks</span>
              </div>
              {expandedSections.otherLandmarks ? 
                <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                <ChevronDown className="w-4 h-4 text-gray-500" />
              }
            </button>
            {expandedSections.otherLandmarks && (
              <div className="mt-2 space-y-3 px-3">
                {/* Dynamic other landmarks based on hotel data */}
                {hotelData?.city_name && (
                  <>
                    <div className="flex items-start gap-3">
                      <Checkbox id="city-center" className="mt-1 w-4 h-4" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{hotelData.city_name} City Center</div>
                        <div className="text-xs text-gray-500">Commercial Area</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">4.0</span>
                          <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs">★</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">5 km</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox id="market" className="mt-1 w-4 h-4" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Local Market</div>
                        <div className="text-xs text-gray-500">Shopping Area</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">3.8</span>
                          <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs">★</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">3 km</span>
                      </div>
                    </div>
                  </>
                )}
                {!hotelData?.city_name && (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No other landmarks available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}