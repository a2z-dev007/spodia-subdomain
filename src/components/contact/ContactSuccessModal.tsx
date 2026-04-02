"use client"

import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ContactSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactSuccessModal: React.FC<ContactSuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Message Sent Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out to us. We've received your inquiry and our team will get back to you within 24-48 hours.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Check your email for a confirmation message.
          </p>

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-full transition"
          >
            Got it, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactSuccessModal;
