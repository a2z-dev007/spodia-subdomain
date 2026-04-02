"use client";

import React, { Fragment, FC, useRef, useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/24/outline";

import DatePicker from "react-datepicker";

import DatePickerCustomHeaderTwoMonth from "../../date-pickers/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "../../date-pickers/DatePickerCustomDay";
import ClearDataButton from "./ClearDataButton";

export interface StayDatesRangeInputProps {
  className?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  onChange?: (dates: [Date | null, Date | null]) => void;
  error?: string;
  labelColor?: string;
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
  className = "",
  startDate: externalStartDate,
  endDate: externalEndDate,
  onChange,
  error,
  labelColor = "text-gray-500",
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    if (onChange) {
      onChange([start, end]);
    }
  };

  const renderInput = () => {
    return (
      <>
        <div className="text-gray-400">
          <CalendarIcon className="w-4 h-4 lg:w-5 lg:h-5" />
        </div>
        <div className="flex-grow text-left">
          <span className="block text-sm font-medium text-black dark:text-white">
            {externalStartDate && externalEndDate
              ? `${externalStartDate?.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })} - ${externalEndDate?.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })}`
              : "Add dates"}
          </span>
          <span className={`block mt-0.5 text-xs leading-none font-normal ${labelColor}`}>
            {"Check in - Check out"}
          </span>
        </div>
      </>
    );
  };

  return (
    <div className={`StayDatesRangeInput-wrapper relative ${className}`}>
      <Popover className="StayDatesRangeInput relative flex w-full">{({ open }) => (
          <>
            <Popover.Button
              ref={buttonRef}
              className={`flex-1 flex relative items-center space-x-3 focus:outline-none bg-white border border-[#e2e8f0] hover:border-slate-500 rounded-md h-12 px-4 transition-colors w-full ${
                open ? "border-slate-500" : ""
              } ${error ? "border-red-500" : ""}`}
            >
              {renderInput()}
              {externalStartDate && externalEndDate && open && (
                <ClearDataButton onClick={() => onChangeDate([null, null])} />
              )}
            </Popover.Button>

            <Transition
              as={Fragment}
              show={open}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                static
                className="absolute z-[99999] mt-2 left-0 right-0 md:left-auto md:right-auto"
              >
                <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black ring-opacity-5 bg-white dark:bg-neutral-800 p-4 md:p-8 max-w-fit mx-auto">
                  <DatePicker
                    selected={externalStartDate}
                    onChange={onChangeDate}
                    startDate={externalStartDate}
                    endDate={externalEndDate}
                    selectsRange
                    monthsShown={isMobile ? 1 : 2}
                    showPopperArrow={false}
                    inline
                    minDate={new Date()}
                    renderCustomHeader={(p) => (
                      <DatePickerCustomHeaderTwoMonth {...p} />
                    )}
                    renderDayContents={(day, date) => (
                      <DatePickerCustomDay dayOfMonth={day} date={date} />
                    )}
                  />
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
      {error && <p className="text-red-500 text-xs mt-1 min-h-[18px]">{error}</p>}
    </div>
  );
};

export default StayDatesRangeInput;
