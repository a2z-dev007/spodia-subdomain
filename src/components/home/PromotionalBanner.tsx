"use client"

import {IoPricetagOutline} from "react-icons/io5";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const PromotionalBanner = () => {
    const { user } = useAuth();

    // Hide banner if user is logged in
    // if (user) {
    //     return null;
    // }

    return (
        <div className="md:px-8 lg:px-8 sm:px-6 px-4">
            <div
                className="black-gradient-btn text-white py-3 px-4 mb-12  max-w-7xl rounded-lg md:mx-auto lg:mx-auto sm:mx-4">
                <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap  justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="gradient-btn p-2 rounded-full">
            <span className="text-white font-bold">
              <IoPricetagOutline size={20}/>
            </span>
                        </div>
                        <span className="text-sm md:text-base">
            Members save 10% or more on over 100,000 hotels worldwide when signed in
          </span>
                    </div>
                    {
                        !user &&  <Link href="/login"
                          className="blue-gradient-btn text-center shadow-lg w-full md:w-auto   outline-none border-none px-4 py-2 rounded-full text-sm font-medium transition-colors">
                        Sign in now
                    </Link>
                    }
                   
                </div>
            </div>
        </div>
    )
}

export default PromotionalBanner
