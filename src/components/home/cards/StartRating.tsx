import {StarIcon} from "@heroicons/react/20/solid";
import React, {FC} from "react";

export interface StartRatingProps {
    className?: string;
    point?: number;
    reviewCount?: number;
}

const StartRating: FC<StartRatingProps> = ({
                                               className = "",
                                               point = 0,
                                               reviewCount = 0,
                                           }) => {
    return (
        <div
            className={`nc-StartRating flex items-center space-x-1 text-sm  ${className}`}
            data-nc-id="StartRating"
        >
            <div className="pb-[2px]">
                <StarIcon className="w-[18px] h-[18px] text-yellow-500"/>
            </div>
            <span className="font-medium ">{point?.toFixed(1)}</span>
            <span className="text-neutral-500 dark:text-neutral-400">
        ({reviewCount.toFixed(0) || 0} reviews)
      </span>
        </div>
    );
};

export default StartRating;
