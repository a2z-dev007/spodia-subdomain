import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import React from 'react'

const Offices = () => {
    const offices = [
        {
            city: 'Delhi Office',
            address: '#590-10/1, 1st Floor, Bardhaman Crown Mall, Amberhai Road No 1, Dwarka Sector 19, New Delhi – 110075',
            phone: '+1 (555) 123-4567',
            email: 'delhi@spodia.com',
            hours: '9:00 AM - 6:00 PM EST',
        },
        {
            city: 'Bangalore Office',
            address: '#590-10/1, 1st Cross, BEML Layout, Tubarahalli, Whitefield, Bangalore, Karnataka – 560066',
            phone: '+44 20 7123 4567',
            email: 'bangalore@spodia.com',
            hours: '9:00 AM - 6:00 PM GMT',
        },
        {
            city: 'Northeast (Guwahati)',
            address: '1st Floor, Nazib Complex, Adj. Ulubari Flyover, Ulubari, Guwahati, Assam – 781007',
            phone: '+971 4 123 4567',
            email: 'kolkata@spodia.com',
            hours: '9:00 AM - 6:00 PM GST',
        },
        {
            city: 'Kolkata',
            address: 'Panchanantala, Panchpara, LP-494/55, Howrah, West Bengal – 711317',
            phone: '+971 4 123 4567',
            email: 'kolkata@spodia.com',
            hours: '9:00 AM - 6:00 PM GST',
        },

    ];
    return (

        <section className="py-14 bg-section-color" >
            <div className="max-w-7xl mx-auto px-4">
                <div className=" mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Visit Our Office’s Within India
                    </h2>
                    {/* <p className="text-gray-600 text-lg">
                        Visit us at one of our global locations
                    </p> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {offices.map((office, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {office.city}
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                    <span className="text-gray-700">{office.address}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="h-5 w-5 text-primary" />
                                    <span className="text-gray-700">{office.phone}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-5 w-5 text-primary" />
                                    <span className="text-gray-700">{office.email}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Clock className="h-5 w-5 text-primary" />
                                    <span className="text-gray-700">{office.hours}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section >

    )
}

export default Offices