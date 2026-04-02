'use client';


import HotelSearchBar, { HotelSearchBarProps } from './HotelSearchBar';
import MobileHotelSearchBar from './MobileHotelSearchBar';

function ResponsiveHotelSearchBar(props: HotelSearchBarProps) {
    return (
        <>
            <div className="md:hidden block">
                <MobileHotelSearchBar {...props} />
            </div>
            <div className="hidden md:block">
                <HotelSearchBar {...props} />
            </div>
        </>
    );
}

export default ResponsiveHotelSearchBar;
