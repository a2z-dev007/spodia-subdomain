import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { ReactDatePickerCustomHeaderProps } from "react-datepicker";

interface CustomHeaderProps extends ReactDatePickerCustomHeaderProps {
  monthsShown?: number;
}

const DatePickerCustomHeaderTwoMonth = ({
  monthDate,
  customHeaderCount,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  monthsShown = 2,
}: CustomHeaderProps) => {
  return (
    <div className="relative flex items-center justify-between px-4 pb-2">
      <button
        aria-label="Previous Month"
        className={`
          flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200
          hover:bg-orange-50 hover:text-[#FF9530] text-gray-500 disabled:opacity-0
        `}
        style={customHeaderCount === 0 ? {} : { visibility: "hidden" }}
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        type="button"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
      </button>

      <span className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">
        {monthDate.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </span>

      <button
        aria-label="Next Month"
        className={`
          flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200
          hover:bg-orange-50 hover:text-[#FF9530] text-gray-500 disabled:opacity-0
        `}
        style={customHeaderCount === (monthsShown - 1) && !nextMonthButtonDisabled ? {} : (customHeaderCount === (monthsShown - 1) ? {} : { visibility: "hidden" })}
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default DatePickerCustomHeaderTwoMonth;
