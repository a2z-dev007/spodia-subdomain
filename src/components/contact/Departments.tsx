// components/contact/Departments.tsx
import React from 'react';

const Departments = () => {
  const departments = [
    {
      title: 'Holiday Enquiry',
      email: 'holidays@spodia.in',
      icon: '🏖️'
    },
    {
      title: 'Partnerships',
      email: 'partnerships@spodia.in',
      icon: '🤝'
    },
    {
      title: 'Booking Status',
      email: 'status@spodia.in',
      icon: '📋'
    },
    {
      title: 'Event Management',
      email: 'events@spodia.in',
      icon: '🎉'
    }
  ];

  return (
    <section className=" py-16">
      <div className="max-w-7xl border rounded-xl  mx-auto px-4 py-5">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 md:text-[40px]">Our Departments</h2>
          <p className="text-gray-600 md:text-[18px] text-text-base">Connecting Expertise Across Every Function</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {departments.map((dept, index) => (
            <div key={index} className="border rounded-xl px-3 py-2  hover:shadow-md transition text-center md:text-left flex flex-col items-center md:items-start" >
              <div className=" relative">
                <div className= "w-16 h-16 flex items-center justify-center rounded-full text-3xl">
                  {dept.icon}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 md:text-[24px]">
                {dept.title}
              </h3>
              
              <p className="text-sm mb-2 text-gray-600 md:text-[16px]">{dept.email}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Departments;