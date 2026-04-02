"use client"

import React, { useId } from 'react';
import AsyncSelect from 'react-select/async';
import { useCitySearch } from '@/hooks/useCitySearch';
import { MapPin } from 'lucide-react';

interface CitySelectProps {
  value?: any;
  onChange: (option: any) => void;
  placeholder?: string;
  className?: string;
}

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: '48px',
    borderRadius: '0.5rem',
    borderColor: state.isFocused ? '#078ED8' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 1px #078ED8' : undefined,
    paddingLeft: '2rem',
    backgroundColor: 'white',
    fontSize: '0.875rem',
      textTransform:"capitalize",

  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
    color: '#111827',
    fontSize: '0.875rem',
    cursor: 'pointer',
  }),
  input: (provided: any) => ({
    ...provided,
    margin: 0,
    padding: 0,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#6b7280',
    fontSize: '0.875rem',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#111827',
    fontSize: '0.875rem',
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 2147483648,
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 2147483648,
  }),
};

export const CitySelect: React.FC<CitySelectProps> = ({ value, onChange, placeholder = 'Where are you going?', className }) => {
  const instanceId = useId();
  const loadOptions = useCitySearch();
  return (
    <div className={`relative z-30 ${className || ''}`}>
      <MapPin size={16} color='#9ca3af' className="absolute left-3 top-1/2 transform -translate-y-1/2 z-30 h-4 w-4 text-gray-400 pointer-events-none" />
      <AsyncSelect
        instanceId={instanceId}
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        styles={customStyles}
        classNamePrefix="city-select"
        isClearable
        menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
      />
    </div>
  );
};

export default CitySelect; 