'use client';

import { useState, useRef } from 'react';

interface PropertyRulesSectionProps {
  hotelData?: any;
}

export function PropertyRulesSection({ hotelData }: PropertyRulesSectionProps) {
  const [showAllRules, setShowAllRules] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Handle hide with smooth scroll
  const handleHideRules = () => {
    setShowAllRules(false);
    // Wait for the collapse animation to complete (500ms) before scrolling
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }, 500);
  };
  // Parse HTML rules if available
  const parseRules = (htmlString: string) => {
    if (!htmlString) return [];
    
    // Simple HTML parsing - extract list items
    const listItems = htmlString.match(/<li[^>]*>(.*?)<\/li>/g) || [];
    return listItems.map(item => item.replace(/<[^>]*>/g, '').trim());
  };

  // Parse HTML content for display
  const parseHtmlContent = (htmlString: string) => {
    if (!htmlString) return '';
    
    // Clean up the HTML and format it properly
    return htmlString
      .replace(/<p>/g, '<div class="mb-2">')
      .replace(/<\/p>/g, '</div>')
      .replace(/<strong>/g, '<span class="font-semibold">')
      .replace(/<\/strong>/g, '</span>')
      .replace(/<ul>/g, '<ul class="list-disc list-inside space-y-1 ml-4">')
      .replace(/<li>/g, '<li class="text-sm text-gray-700">')
      .replace(/<br\s*\/?>/g, '<br class="mb-1">');
  };

  const rules = hotelData?.other_rules ? parseRules(hotelData.other_rules) : [
    `Primary Guest should be at least ${hotelData?.check_in_age || '18'} years of age.`,
    `Check-in document required: ${hotelData?.check_in_document || 'Valid ID'}`,
    `Cancellation policy: ${hotelData?.guest_cancellation_type || 'Standard'} cancellation terms apply.`
  ];

  return (
    <div ref={sectionRef} className="bg-white rounded-[20px] border border-gray-200 w-full mx-auto p-4">
      <div className="flex flex-col mb-2">
        <h3 className="font-bold mb-2 md:mb-0">Property Rules</h3>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-gray-600">Check-in: </span>
            <span className="font-medium">{hotelData?.check_in || '2 PM'}</span>
          </div>
          <div>
            <span className="text-gray-600">Check-out: </span>
            <span className="font-medium">{hotelData?.check_out || '11 AM'}</span>
          </div>
        </div>
      </div>
      <hr className="bg-inherit"/>
      
      {/* Rules list */}
      <div className="space-y-3 mb-4 mt-4">
        {rules.slice(0, 5).map((rule, index) => (
          <div key={index} className="flex gap-2 text-sm">
            <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
            <span className="text-gray-700 flex-1">{rule}</span>
          </div>
        ))}
        
        {/* Additional property info */}
        {hotelData?.documents_required_for_check_in && (
          <div className="flex gap-2 text-sm">
            <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
            <span className="text-gray-700">Valid identification documents required for check-in</span>
          </div>
        )}
        
        {hotelData?.instant_booking && (
          <div className="flex gap-2 text-sm">
            <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
            <span className="text-gray-700">Instant booking available - immediate confirmation</span>
          </div>
        )}
      </div>

      {/* Property Details */}
      {(hotelData?.property_type || hotelData?.hotel_chain_name) && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-4 text-sm">
            {hotelData?.property_type && (
              <div>
                <span className="text-gray-600">Property Type: </span>
                <span className="font-medium">{hotelData.property_type}</span>
              </div>
            )}
            {hotelData?.hotel_chain_name && hotelData.hotel_chain_name !== 'Default Chain' && (
              <div>
                <span className="text-gray-600">Chain: </span>
                <span className="font-medium">{hotelData.hotel_chain_name}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="flex flex-wrap gap-4 text-sm">
        <button className="text-black border border-[#D8D8D8] rounded-[8px] py-1 px-2">Must Read Rules</button>
        <button className="text-black border border-[#D8D8D8] rounded-[8px] py-1 px-2">Guest Profile</button>
        {hotelData?.other_rules && (
          <button 
            onClick={() => setShowAllRules(!showAllRules)}
            className="text-orange-500 px-2 hover:text-orange-600 transition-colors duration-200 flex items-center gap-1"
          >
            <span>{showAllRules ? 'Hide Property Rules' : 'Read All Property Rules'}</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${showAllRules ? 'rotate-180' : 'rotate-0'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Expandable other rules section */}
      {hotelData?.other_rules && (
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showAllRules ? '  opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500">
            <h4 className="font-semibold text-gray-800 mb-3">Complete Property Rules & Policies</h4>
            <div 
              className="text-sm text-gray-700 leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ 
                __html: parseHtmlContent(hotelData.other_rules) 
              }}
            />
            {/* Hide button at the end of content */}
            <div className="flex justify-center pt-3 border-t border-gray-200">
              <button 
                onClick={handleHideRules}
                className="text-orange-500 hover:text-orange-600 transition-colors duration-200 flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-white/50"
              >
                <span>Hide Property Rules</span>
                <svg 
                  className="w-4 h-4 rotate-180"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
           
        </div>
      )}
    </div>
  );
}