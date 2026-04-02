import React from 'react'
import { Phone, Shield, FileText } from 'lucide-react'
import { FaIdCard } from "react-icons/fa6";
import { PiNotebookFill } from "react-icons/pi";
import { TbInfoSquareRoundedFilled } from "react-icons/tb";
import { CONTACT_INFO } from '@/utils/const';

interface ImportantInformationProps {
    hotelData?: any;
}

const ImportantInformation = ({ hotelData }: ImportantInformationProps) => {
    return (
        <div className='bg-[#FFDAA8] w-full mx-auto p-6 md:p-12'>
            {/* Header */}
            <div className='flex justify-center items-center mb-8'>
                <h3 className='font-bold text-xl md:text-2xl text-gray-900'>Important Information</h3>
            </div>

            {/* Information cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
                {/* Hotel Contact Information */}
                <div className='bg-gray-50 border border-orange-300 rounded-xl p-4 md:p-6'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='w-8 h-8  flex items-center justify-center'>
                            <FaIdCard className='w-8 h-8 text-[#FF9530]' />
                        </div>
                        <h4 className='font-semibold text-gray-900 text-sm md:text-base'>Hotel Contact Information</h4>
                    </div>

                    <div className='space-y-3 text-xs md:text-sm text-gray-600'>
                        <div>
                            <span className='font-medium text-gray-700'>Name:</span> {hotelData?.name || 'Hotel Name'}
                        </div>
                        <div>
                            <span className='font-medium text-gray-700'>Address:</span> {hotelData?.address || 'Hotel Address'}
                        </div>
                        <div>
                            <span className='font-medium text-gray-700'>Phone:</span> {CONTACT_INFO.mobile1}, {CONTACT_INFO.mobile2}
                        </div>
                        <div>
                            <span className='font-medium text-gray-700'>Email:</span> {CONTACT_INFO.email3}
                        </div>
                        
                    </div>
                </div>

                {/* Emergency Contact Number */}
                <div className='bg-gray-50 border border-orange-300 rounded-xl p-4 md:p-6'>
                    <div className='flex items-center gap-3 mb-4'>
                       <div className='w-8 h-8  flex items-center justify-center'>
                            <PiNotebookFill className='w-8 h-8 text-[#FF9530]' />
                        </div>
                        <h4 className='font-semibold text-gray-900 text-sm md:text-base'>Emergency Contact Number</h4>
                    </div>

                    <div className='space-y-3 text-xs md:text-sm text-gray-600'>
                        <div>
                            <span className='font-medium text-gray-700'>Spodia Team:</span> {CONTACT_INFO.mobile1}
                        </div>
                        <div>
                            <span className='font-medium text-gray-700'>Local Emergency Services:</span> 108
                        </div>
                        <div>
                            <span className='font-medium text-gray-700'>Contact Team:</span> Customer Care
                        </div>
                        <div>
                            <span className='font-medium text-gray-700'>Medical Assistance:</span> {hotelData?.city_name || 'Local'} city hospital
                        </div>
                    </div>
                </div>

                {/* Hotel News & Disclaimers */}
                <div className='bg-gray-50 border border-orange-300 rounded-xl p-4 md:p-6 md:col-span-2 lg:col-span-1'>
                    <div className='flex items-center gap-3 mb-4'>
                         <div className='w-8 h-8  flex items-center justify-center'>
                            <TbInfoSquareRoundedFilled className='w-8 h-8 text-[#FF9530]' />
                        </div>
                        <h4 className='font-semibold text-gray-900 text-sm md:text-base'>Hotel News & Disclaimers</h4>
                    </div>

                    <div className='space-y-3 text-xs md:text-sm text-gray-600'>
                        <div>
                            <span className='font-medium text-gray-700'>Check-in/Check-out: </span>
                            <span className='mt-1'>
                                Check in time is after {hotelData?.check_in || '--'}. Check-out time is before {hotelData?.check_out || '--'}
                            </span>
                        </div>
                        <div>
                            <span className='font-medium text-gray-700'>Age Requirement: </span>
                            <span className='mt-1'>
                                Primary guest must be at least {hotelData?.check_in_age || '--'} years old
                            </span>
                        </div>
                        <div>
                            <span className='font-medium text-gray-700'>ID Requirement: </span>
                            <span className='mt-1 capitalize'>
                               {hotelData.check_in_document  ? hotelData.check_in_document:"View Cancellation"}
                            </span>
                        </div>
                         <div>
                                <span className='font-medium text-gray-700'>Cancellation: </span>
                                <span className='mt-1'>
                                   View Cancellation
                                </span>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImportantInformation