"use client"

import React, { FC, useId } from 'react'
import Select, { Props as SelectProps, StylesConfig, components } from 'react-select'
import { ChevronDown } from 'lucide-react'

interface PremiumSelectProps extends SelectProps {
  label?: string
  icon?: React.ReactNode
  containerClassName?: string
  className?: string
  relative?: boolean
}

const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="w-4 h-4 text-[#FF9530]" strokeWidth={3} />
    </components.DropdownIndicator>
  )
}

const PremiumSelect: FC<PremiumSelectProps> = ({ 
  label, 
  icon, 
  containerClassName = "",
  className = "",
  relative = true,
  placeholder = "Select...",
  ...props 
}) => {
  const instanceId = useId();
  const customStyles: StylesConfig = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
      minHeight: 'auto',
      cursor: 'pointer',
      padding: 0,
      '&:hover': { border: 'none' }
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: 0,
      margin: 0,
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
      fontSize: '0.875rem',
      fontWeight: '700',
      color: '#1E293B',
    }),
    placeholder: (provided) => ({
      ...provided,
      margin: 0,
      color: '#94A3B8',
      fontSize: '0.9375rem',
      fontWeight: '400',
    }),
    singleValue: (provided) => ({
      ...provided,
      margin: 0,
      color: '#1E293B',
      fontSize: '0.9375rem',
      fontWeight: '700',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      padding: 0,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '0 0 0 4px',
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
      <div className="flex-1 text-left min-w-0">
        {label && <p className="text-[13px] font-bold text-gray-400 capitalize mb-1">{label}</p>}
        <Select
          {...props}
          instanceId={instanceId}
          components={{ DropdownIndicator }}
          styles={customStyles}
          placeholder={placeholder}
          isSearchable={true}
          menuPlacement="auto"
          menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
          className="premium-select-container"
          classNamePrefix="premium-select"
        />
      </div>
    </div>
  )
}

export default PremiumSelect
