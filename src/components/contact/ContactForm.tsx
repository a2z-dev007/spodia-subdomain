"use client"

import React, { useState } from "react";
import { toast } from 'react-toastify';
import { Loader2, Send } from 'lucide-react';
import { addMessage } from "@/services/api";
import ContactSuccessModal from "./ContactSuccessModal";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  mobile?: string;
  message?: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.name.trim().length >= 2 &&
      formData.email.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.message.trim().length >= 10 &&
      (!formData.mobile.trim() || /^\d{10,15}$/.test(formData.mobile.replace(/\D/g, ''))) // Mobile is optional but if provided, should be 10-15 digits
    );
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Mobile validation (optional but if provided, should be valid)
    if (formData.mobile.trim() && !/^\d{10,15}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid mobile number (10-15 digits)';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation for email
    if (name === 'email' && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors(prev => ({
          ...prev,
          email: 'Please enter a valid email address (e.g., user@example.com)'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          email: undefined
        }));
      }
    } else if (name === 'email' && !value.trim()) {
      // Clear error when field is empty (will be caught on submit)
      setErrors(prev => ({
        ...prev,
        email: undefined
      }));
    }
    
    // Real-time validation for mobile number
    else if (name === 'mobile' && value.trim()) {
      const digitsOnly = value.replace(/\D/g, '');
      const digitCount = digitsOnly.length;
      
      if (digitCount > 0 && digitCount < 10) {
        setErrors(prev => ({
          ...prev,
          mobile: `Phone number must be at least 10 digits (currently ${digitCount})`
        }));
      } else if (digitCount > 15) {
        setErrors(prev => ({
          ...prev,
          mobile: `Phone number must not exceed 15 digits (currently ${digitCount})`
        }));
      } else {
        // Clear error if valid
        setErrors(prev => ({
          ...prev,
          mobile: undefined
        }));
      }
    } else if (name === 'mobile' && !value.trim()) {
      // Clear error if field is empty (since it's optional)
      setErrors(prev => ({
        ...prev,
        mobile: undefined
      }));
    } 
    
    // Clear error when user starts typing in other fields
    else {
      if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the request body according to API specification
      const requestBody = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim() ? parseInt(formData.mobile.replace(/\D/g, '')) : null, // Convert to number or null
        message: formData.message.trim()
      };

      console.log('Sending inquiry:', requestBody);

      const response = await addMessage(requestBody);
      console.log('Response data:', response.data);

      // Check for success based on status field or HTTP status code 201
      if (response.data.status === 'success' || response.status === 201) {
        // Show success modal
        setShowSuccessModal(true);

        // Reset form
        setFormData({
          name: '',
          email: '',
          mobile: '',
          message: ''
        });
        setErrors({});
      } else {
        throw new Error(response.data.message || 'Failed to send inquiry');
      }
    } catch (error: any) {
      console.error('Error sending inquiry:', error);
      const errorMessage = error?.message || 'Failed to send inquiry. Please try again later.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ContactSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
      
      <div className="bg-gray-50 shadow-lg rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 md:text-[22px]">
        Tell Us About Your Stay
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-600 mb-1 md:text-[16px]"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your full name"
            className={`w-full px-4 py-3 border md:text-[14px] rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition ${errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600 mb-1 md:text-[16px]"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="We'll respond here"
            className={`w-full px-4 py-3 border md:text-[14px] rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-600 mb-1 md:text-[16px]"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            placeholder="Optional, to reach you quickly"
            className={`w-full px-4 py-3 border md:text-[14px] rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition ${errors.mobile ? 'border-red-500' : 'border-gray-300'
              }`}
            disabled={isSubmitting}
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
          )}
        </div>



        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-600 mb-1 md:text-[16px]"
          >
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            placeholder="Let us know how we can assist you"
            className={`w-full px-4 py-3 border md:text-[14px] rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none transition ${errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.message.length}/10 minimum characters
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isFormValid()}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-full transition flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Inquiry</span>
            </>
          )}
        </button>
      </form>
    </div>
    </>
  );
};

export default ContactForm;