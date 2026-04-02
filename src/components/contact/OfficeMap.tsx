"use client"

import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface Office {
  city: string;
  address: string;
  lat: number;
  lng: number;
  fullAddress: string;
}

const OfficeMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);

  // Office locations with coordinates
  const offices: Office[] = [
    {
      city: 'Delhi Head Office',
      address: 'Samta Enclave, Near Mother Dairy, Qutub Vihar, Phase 1, Sector 19 Dwarka',
      lat: 28.5921, // Approximate coordinates for Dwarka Sector 19
      lng: 77.0460,
      fullAddress: 'Samta Enclave, Near Mother Dairy, Qutub Vihar, Phase 1, Sector 19 Dwarka, New Delhi- 110071, India'
    },
    {
      city: 'Bangalore Office',
      address: '#590-10/1, 1st Cross, BEML, Layout, Tubarahalli, Whitefield',
      lat: 12.9698, // Approximate coordinates for Whitefield
      lng: 77.7500,
      fullAddress: '#590-10/1, 1st Cross, BEML, Layout, Tubarahalli, Whitefield, Bangalore, Karnataka – 560066, India'
    },
    {
      city: 'North East Office',
      address: 'Purna Saikia Complex, NH – 37, Sonapur, Guwahati, Kamrup (Metro)',
      lat: 26.1445, // Approximate coordinates for Guwahati
      lng: 91.7362,
      fullAddress: 'Purna Saikia Complex, NH – 37, Sonapur, Guwahati, Kamrup (Metro), Assam - 782402, India'
    },
    {
      city: 'Kolkata Office',
      address: 'Panchanantala, Panchpara, LP-494/55, Howrah',
      lat: 22.5958, // Approximate coordinates for Howrah
      lng: 88.2636,
      fullAddress: 'Panchanantala, Panchpara, LP-494/55, Howrah, West Bengal – 711317, India'
    }
  ];

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      // Create map centered on India
      const mapInstance = new google.maps.Map(mapRef.current, {
        zoom: 5,
        center: { lat: 20.5937, lng: 78.9629 }, // Center of India
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      setMap(mapInstance);

      // Add markers for each office
      offices.forEach((office) => {
        const marker = new google.maps.Marker({
          position: { lat: office.lat, lng: office.lng },
          map: mapInstance,
          title: office.city,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#FF9530" stroke="white" stroke-width="4"/>
                <path d="M20 10C16.6863 10 14 12.6863 14 16C14 20.5 20 30 20 30S26 20.5 26 16C26 12.6863 23.3137 10 20 10ZM20 18.5C18.6193 18.5 17.5 17.3807 17.5 16C17.5 14.6193 18.6193 13.5 20 13.5C21.3807 13.5 22.5 14.6193 22.5 16C22.5 17.3807 21.3807 18.5 20 18.5Z" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 40)
          }
        });

        // Create info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; color: #FF9530; font-weight: bold;">${office.city}</h3>
              <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.4;">${office.fullAddress}</p>
            </div>
          `
        });

        // Add click listener to marker
        marker.addListener('click', () => {
          // Close any open info windows
          if (selectedOffice) {
            infoWindow.close();
          }
          
          infoWindow.open(mapInstance, marker);
          setSelectedOffice(office);
          
          // Center map on clicked marker
          mapInstance.panTo({ lat: office.lat, lng: office.lng });
          mapInstance.setZoom(12);
        });
      });
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
  }, []);

  const handleOfficeClick = (office: Office) => {
    if (!map) return;
    
    setSelectedOffice(office);
    map.panTo({ lat: office.lat, lng: office.lng });
    map.setZoom(12);
  };

  const resetMapView = () => {
    if (!map) return;
    
    setSelectedOffice(null);
    map.setCenter({ lat: 20.5937, lng: 78.9629 });
    map.setZoom(5);
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 md:text-[40px]">
            Find Us on the Map
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Locate our offices across India. Click on any marker to get detailed address information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Office List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Offices</h3>
              <div className="space-y-3">
                {offices.map((office, index) => (
                  <button
                    key={index}
                    onClick={() => handleOfficeClick(office)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                      selectedOffice?.city === office.city
                        ? 'border-[#FF9530] bg-orange-50'
                        : 'border-gray-200 hover:border-[#FF9530] hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-[#FF9530] mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{office.city}</h4>
                        <p className="text-xs text-gray-600 mt-1">{office.address}</p>
                      </div>
                    </div>
                  </button>
                ))}
                {/* <button
                  onClick={resetMapView}
                  className="w-full mt-4 px-4 py-2 bg-[#FF9530] text-white rounded-lg hover:bg-[#e8851c] transition-colors duration-200 text-sm font-medium"
                >
                  View All Offices
                </button> */}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div 
                ref={mapRef} 
                className="w-full h-96 lg:h-[500px]"
                style={{ minHeight: '400px' }}
              />
            </div>
          </div>
        </div>

        {/* Selected Office Details */}
        {/* {selectedOffice && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#FF9530] rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedOffice.city}</h3>
                <p className="text-gray-600 leading-relaxed">{selectedOffice.fullAddress}</p>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </section>
  );
};

export default OfficeMap;