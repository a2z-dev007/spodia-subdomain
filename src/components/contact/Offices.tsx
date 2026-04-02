// components/offices/Offices.tsx
import React from 'react';
import { MapPin } from 'lucide-react';

const Offices = () => {
  const offices = [
    {
      city: 'Delhi Head Office',
      address: 'Samta Enclave, Near Mother Dairy,',
      address2: 'Qutub Vihar, Phase 1, Sector 19',
      details: 'Dwarka, New Delhi- 110071,',
      details2: 'India'
    },
    {
      city: 'Bangalore Office',
      address: '#590-10/1, 1st Cross, BEML,',
      address2: 'Layout, Tubarahalli, Whitefield,',
      details: 'Bangalore, Karnataka – 560066,',
      details2: 'India'
    },
    {
      city: 'North East Office',
      address: 'Purna Saikia Complex, NH – 37,',
      address2: 'Sonapur, Guwahati, Kamrup (Metro),',
      details: 'Assam - 782402, India',
      details2: ''
    },
    {
      city: 'Kolkata Office',
      address: 'Panchanantala, Panchpara,',
      address2: 'LP-494/55, Howrah,',
      details: 'West Bengal – 711317, India',
      details2: ''
    }
  ];

  return (
    <section className="bg-white md:py-16 ">
      <div className="max-w-7xl mx-auto px-4">
        <div className=" mb-12 text-center md:text-start ">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 md:text-[40px] ">
            Visit Our Office's Within India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {offices.map((office, index) => (
            <div
              key={index}
              className="border p-3 rounded-xl text-center md:text-left flex flex-col items-center md:items-start"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2">
                <MapPin className="w-8 h-8 text-orange-500" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4 md:text-[24px]">
                {office.city}
              </h3>

              <div className="text-xs text-gray-600 font-semibold leading-relaxed md:text-[16px]">
                <p>{office.address}</p>
                <p>{office.address2}</p>
                <p>{office.details}</p>
                <p>{office.details2}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Offices;