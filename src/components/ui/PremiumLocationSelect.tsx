"use client"

import React, { FC, useId } from 'react'
import AsyncSelect from 'react-select/async'
import { StylesConfig, components } from 'react-select'
import { MapPin, Search, X } from 'lucide-react'
import { searchCityByName } from '@/services/api'

interface PremiumLocationSelectProps {
  label?: string
  icon?: React.ReactNode
  containerClassName?: string
  className?: string
  placeholder?: string
  value?: any
  onChange?: (value: any) => void
  required?: boolean
}

const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <Search className="w-4 h-4 text-gray-400" />
    </components.DropdownIndicator>
  )
}

const PremiumLocationSelect: FC<PremiumLocationSelectProps> = ({ 
  label = "Location",
  icon = <MapPin className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-[#FF9530]" strokeWidth={2.25} />,
  containerClassName = "",
  className = "",
  placeholder = "Where is the event?",
  value,
  onChange,
  required = false
}) => {
  const instanceId = useId();
  const loadOptions = async (inputValue: string) => {
    if (!inputValue || inputValue.length < 2) return []
    try {
      const response = await searchCityByName(inputValue)
      // The API response structure from searchCityByName needs to be mapped to { value, label }
      // Assuming response is the list of cities based on stay-search behavior
      const cities = response?.data?.records || response?.data || []
      return cities.map((city: any) => ({
        value: city.id,
        label: `${city.name}${city.state_name ? `, ${city.state_name}` : ''}`
      }))
    } catch (error) {
      console.error('Error fetching locations:', error)
      return []
    }
  }

  const customStyles: StylesConfig = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
      minHeight: 'auto',
      cursor: 'text',
      padding: 0,
      '&:hover': { border: 'none' }
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: 0,
      margin: 0,
      flexWrap: 'nowrap',
      overflow: 'hidden',
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
      fontSize: '0.875rem',
      fontWeight: '700',
      color: '#1E293B',
      whiteSpace: 'nowrap',
    }),
    placeholder: (provided) => ({
      ...provided,
      margin: 0,
      color: '#64748B',
      fontSize: '0.9375rem',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
    singleValue: (provided) => ({
      ...provided,
      margin: 0,
      color: '#1E293B',
      fontSize: '0.875rem',
      fontWeight: '700',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      padding: 0,
    }),
    loadingIndicator: (provided) => ({
      ...provided,
      color: '#FF9530',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '1.5rem',
      padding: '0.5rem',
      border: '1px solid #F1F5F9',
      boxShadow: '0 40px 80px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
      zIndex: 99999,
      marginTop: '0.5rem',
      width: 'max-content',
      minWidth: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      maxHeight: '300px',
      minWidth: '250px',
      '&::-webkit-scrollbar': { width: '6px' },
      '&::-webkit-scrollbar-track': { background: 'transparent' },
      '&::-webkit-scrollbar-thumb': { background: '#E2E8F0', borderRadius: '10px' },
      '&::-webkit-scrollbar-thumb:hover': { background: '#CBD5E1' },
    }),
    option: (provided, state) => ({
      ...provided,
      borderRadius: '1rem',
      padding: '0.875rem 1.25rem',
      fontSize: '0.8125rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      marginBottom: '2px',
      whiteSpace: 'nowrap',
      paddingRight: '2.5rem',
      backgroundColor: state.isSelected 
        ? '#FF9530' 
        : state.isFocused 
          ? '#FFF7ED' 
          : 'transparent',
      color: state.isSelected ? 'white' : state.isFocused ? '#FF9530' : '#475569',
      '&:active': {
        transform: 'scale(0.98)',
        backgroundColor: '#FF9530',
        color: 'white',
      }
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 999999,
    }),
  }

  return (
    <div className={`flex items-center relative ${className} ${containerClassName}`}>
      {icon && <div className="shrink-0 mr-2.5 transition-transform group-hover:scale-110">{icon}</div>}
      <div className="flex-1 text-left min-w-0 font-bold">
        {label && (
          <p className="mb-0.5 text-[11px] font-medium capitalize tracking-wide text-gray-400 sm:text-xs">
            {label}
            {required && <span className="ml-0.5 text-red-500">*</span>}
          </p>
        )}
        <AsyncSelect
          instanceId={instanceId}
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          value={value}
          onChange={onChange}
          styles={customStyles}
          components={{ DropdownIndicator: () => null }}
          placeholder={placeholder}
          menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
          className="premium-select-container"
          classNamePrefix="premium-select"
          noOptionsMessage={({ inputValue }) => !inputValue ? "Type to search..." : "No locations found"}
          loadingMessage={() => "Searching..."}
        />
      </div>
      {value && (
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onChange?.(null); 
          }}
          className="p-1.5 hover:bg-orange-50 rounded-full transition-all mr-2 group-hover:bg-orange-50/50"
        >
          <X className="w-4 h-4 text-[#FF9530]" />
        </button>
      )}
    </div>
  )
}

export default PremiumLocationSelect
