import React from "react";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

const ContactHero = () => {
  return (
    <section className="bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="mb-14 max-w-3xl md:mt-20">
          <p className="text-orange-500 text-sm font-semibold mb-3  tracking-wide">
            Contact Us
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mb-5 md:text-[40px]">
            Get in Touch with Our Team
          </h1>
          <p className="text-gray-600 text-text-base leading-relaxed md:text-[18px] ">
            Whether it’s assistance with your current reservation or finding the
            perfect stay, our travel specialists are here to help. Reach out to
            us—and let’s make your trip unforgettable.
          </p>
        </div>

        {/* Form + Info Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
