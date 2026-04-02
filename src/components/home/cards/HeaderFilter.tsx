"use client";

import React, { FC, useEffect, useState, ReactNode } from "react";
import Heading from "@/shared/Heading";
import Nav from "@/shared/Nav";
import NavItem from "@/shared/NavItem";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export interface HeaderFilterProps {
  tabActive: string;
  tabs: string[];
  heading: ReactNode;
  subHeading?: ReactNode;
  onClickTab?: (item: string) => void;
}

const HeaderFilter: FC<HeaderFilterProps> = ({
  tabActive,
  tabs,
  subHeading = "",
  heading = "Latest Articles 🎈",
  onClickTab = () => {},
}) => {
  // Use tabs from props or fallback to default
  const filters = tabs && tabs.length > 0 ? tabs : ["All"];
  const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   setTabActiveState(validTabActive);
  // }, [validTabActive]);

  // const handleClickTab = (item: string) => {
  //   onClickTab(item);
  //   setTabActiveState(item);
  // };

  const itemsPerPage = 3;

  return (
    <div className="flex flex-col  relative">
      {/* Filters */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
          {heading}
        </h2>
        {subHeading && (
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
            {subHeading}
          </p>
        )}
      </div>
      <div className="flex gap-2 sm:gap-3 p-2 scrollbar-none overflow-x-auto hide-scrollbar pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onClickTab(filter)}
            className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow-md ${
              tabActive === filter
                ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white scale-105"
                : "bg-white text-gray-600 hover:text-orange-500 hover:bg-orange-50 border border-gray-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeaderFilter;
