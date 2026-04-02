'use client'

import React, { FC, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Calendar, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import DatePickerCustomHeaderTwoMonth from '../date-pickers/DatePickerCustomHeaderTwoMonth'
import DatePickerCustomDay from '../date-pickers/DatePickerCustomDay'
import { format } from 'date-fns'

interface PremiumDatePickerProps {
  selected?: Date | null
  startDate?: Date | null
  endDate?: Date | null
  onChange: (date: any) => void
  selectsRange?: boolean
  placeholder?: string
  className?: string
  label?: string
  relative?: boolean
  containerClassName?: string
  monthsShown?: number
}

const PremiumDatePicker: FC<PremiumDatePickerProps> = ({
  selected,
  startDate,
  endDate,
  onChange,
  selectsRange = false,
  placeholder = 'Select Date',
  className = '',
  label = 'Date',
  relative = true,
  containerClassName = '',
  monthsShown: customMonthsShown
}) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  useEffect(() => {
    setHasMounted(true)
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768)
      setIsLargeScreen(window.innerWidth >= 1200)
    }
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  const effectiveMonthsShown = customMonthsShown ?? (isLargeScreen ? 2 : 1)

  const displayValue = () => {
    if (!hasMounted) return placeholder

    if (selectsRange) {
      if (startDate && endDate) {
        return `${format(startDate, 'd MMM')} - ${format(endDate, 'd MMM')}`
      } else if (startDate) {
        return `${format(startDate, 'd MMM')} - End`
      }
      return placeholder
    }
    return selected ? format(selected, 'd MMM, yyyy') : placeholder
  }

  return (
    <div 
      className={`premium-datepicker-wrapper flex w-full relative ${className} ${containerClassName}`}
      suppressHydrationWarning={true}
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex flex-1 items-center min-w-0">
          <PopoverTrigger asChild>
            <div 
              role="button"
              tabIndex={0}
              className="flex-1 flex items-center focus:outline-none group min-w-0 bg-transparent border-none p-0 cursor-pointer"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsOpen(true);
                }
              }}
            >
              <Calendar className="mr-2.5 h-[18px] w-[18px] shrink-0 text-[#FF9530] transition-transform group-hover:scale-110 sm:h-5 sm:w-5" strokeWidth={2.25} />
              <div className="flex-1 min-w-0 text-left">
                {label && (
                  <p className="mb-0.5 text-[11px] font-medium capitalize tracking-wide text-gray-400 sm:text-xs">
                    {label}
                  </p>
                )}
                <p
                  className={`overflow-hidden text-ellipsis whitespace-nowrap p-0 text-[15px] transition-colors ${
                    (selectsRange ? startDate : selected)
                      ? 'font-bold text-neutral-900'
                      : 'font-medium text-gray-500'
                  }`}
                  suppressHydrationWarning={true}
                >
                  {displayValue()}
                </p>
              </div>
            </div>
          </PopoverTrigger>

          {(selected || startDate) && (
            <button 
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation(); 
                onChange(selectsRange ? [null, null] : null); 
              }}
              className="p-1.5 hover:bg-orange-50 rounded-full transition-all mr-2 group/clear"
              type="button"
            >
              <X className="w-4 h-4 text-[#FF9530]" />
            </button>
          )}
        </div>

        <PopoverContent 
          className="z-[999999] p-0 w-auto bg-transparent border-none shadow-none" 
          align={isMobile ? "center" : "center"}
          side={isMobile ? "bottom" : "bottom"}
          sideOffset={12}
          collisionPadding={16}
        >
          <div className="overflow-hidden rounded-[1.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.25)] border border-gray-100 bg-white max-w-fit animate-in fade-in-0 zoom-in-95 duration-200">
            {selectsRange ? (
              <DatePicker
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  onChange(update)
                  if (update && update[0] && update[1]) {
                    setIsOpen(false)
                  }
                }}
                selectsRange={true}
                monthsShown={effectiveMonthsShown}
                showPopperArrow={false}
                inline
                minDate={today}
                calendarClassName={`event-hero-datepicker ${effectiveMonthsShown === 1 ? "single-month" : "two-months"}`}
                renderCustomHeader={(p) => (
                  <DatePickerCustomHeaderTwoMonth {...p} monthsShown={effectiveMonthsShown} />
                )}
                renderDayContents={(day) => (
                  <span className="relative z-10">{day}</span>
                )}
              />
            ) : (
              <DatePicker
                selected={selected}
                onChange={(date) => {
                  onChange(date)
                  setIsOpen(false)
                }}
                monthsShown={effectiveMonthsShown}
                showPopperArrow={false}
                inline
                minDate={today}
                calendarClassName={`event-hero-datepicker ${effectiveMonthsShown === 1 ? "single-month" : "two-months"}`}
                renderCustomHeader={(p) => (
                  <DatePickerCustomHeaderTwoMonth {...p} monthsShown={effectiveMonthsShown} />
                )}
                renderDayContents={(day) => (
                  <span className="relative z-10">{day}</span>
                )}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default PremiumDatePicker
