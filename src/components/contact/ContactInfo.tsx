// components/contact/ContactInfo.tsx
import React from 'react';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import { CONTACT_INFO } from '@/utils/const';
import { MdWhatsapp } from 'react-icons/md';

const ContactInfo = () => {
  return (
    <div className="bg-white text-center md:text-left">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 md:text-[22px]">
          Prefer to talk directly?
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-3 md:justify-start">
            <Phone className="w-5 h-5 text-orange-500" />
            <span className="text-gray-700 md:text-[18px]">{CONTACT_INFO.mobile1}, &nbsp;{CONTACT_INFO.mobile2}</span>
          </div>
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-3 md:justify-start">
            <MdWhatsapp className="w-5 h-5 text-orange-500" />
            <span className="text-gray-700 md:text-[18px]">{CONTACT_INFO.mobile1}, &nbsp;{CONTACT_INFO.mobile2}</span>
          </div>

          <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-3 md:justify-start">
            <Mail className="w-5 h-5 text-orange-500" />
            <span className="text-gray-700 md:text-[18px]">
              {CONTACT_INFO?.contactEmail}, &nbsp;{CONTACT_INFO.helloEmail}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-3 md:justify-start">
            <MessageSquare className="w-5 h-5 text-orange-500" />
            <span className="text-gray-700 md:text-[18px]">24/7 WhatsApp Support</span>
          </div>
        </div>
      </div>

      {/* <div className="bg-gray-50 rounded-lg p-6 text-center md:text-left">
        <h4 className="font-semibold text-gray-900 mb-2 md:text-[20px]">
          Visit Our Office's Within India
        </h4>

        <div className="flex flex-col items-center gap-2 mb-4 md:flex-row md:items-center md:justify-start">
          <span className="text-orange-500 text-sm">📍</span>
          <span className="text-gray-600 text-sm md:text-[18px]">
            123 Subramalla Road, Lucknow-226006
          </span>
        </div>

        <p className="text-orange-500 text-sm mb-4 cursor-pointer hover:underline md:text-[14px]">
          Get Directions →
        </p>

        
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-gray-200"></div>
          <div className="relative z-10 text-center">
            <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs">📍</span>
            </div>
            <span className="text-gray-600 text-sm md:text-[18px]">
              Interactive Map View
            </span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ContactInfo;
