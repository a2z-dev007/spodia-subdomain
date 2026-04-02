'use client'

import React from 'react'
import Header from '@/components/layout/Header'

import { CheckCircle2, Mail, Users, Star, ShieldCheck, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface ComingSoonTemplateProps {
  title: string
  subtitle: string
  description: string
  highlightsTitle: string
  highlights: string[]
  onboardingText: string
  inquiryTitle: string
  inquirySubtitle: string
  formTitle: string
  buttonText?: string
  icon: React.ReactNode
  accentColor: 'orange' | 'blue'
  backgroundImage?: string
  perfectFor?: string[]
  /** The form rendered by the page-level client component */
  children: React.ReactNode
}

const ComingSoonTemplate: React.FC<ComingSoonTemplateProps> = ({
  title,
  subtitle,
  description,
  highlightsTitle,
  highlights,
  onboardingText,
  inquiryTitle,
  inquirySubtitle,
  formTitle,
  icon,
  accentColor,
  backgroundImage,
  perfectFor,
  children,
}) => {
  const accentClass =
    accentColor === 'blue' ? 'from-brand-blue to-blue-400' : 'from-brand-orange to-orange-400'
  const textAccentClass = accentColor === 'blue' ? 'text-brand-blue' : 'text-brand-orange'
  const btnClass = accentColor === 'blue' ? 'bg-blue-gradient' : 'bg-btn-gradient'
  const lightBgClass = accentColor === 'blue' ? 'bg-blue-50/50' : 'bg-orange-50/50'

  return (
    <>
      <div className="min-h-screen flex flex-col bg-white overflow-hidden">
        <Header withScrollEffect={false} />

        <main className="flex-grow pt-24 lg:pt-24">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className={`absolute -top-[20%] -right-[10%] w-[60%] h-[70%] rounded-full blur-[120px] bg-gradient-to-br ${accentClass}`}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className={`absolute top-[40%] -left-[15%] w-[50%] h-[60%] rounded-full blur-[100px] bg-gradient-to-tr ${accentClass}`}
            />
          </div>

          {/* Hero */}
          <section className="relative py-12 lg:py-24 container mx-auto px-4 z-10">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div
                  className={`inline-flex items-center justify-center p-4 rounded-3xl mb-8 shadow-xl bg-white border border-gray-100 ${textAccentClass}`}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {icon}
                  </motion.div>
                </div>

                <h1 className="text-5xl md:text-7xl xl:text-8xl font-black text-gray-900 mb-8 tracking-tighter leading-none">
                  {title} <br />
                  <span className={`bg-clip-text text-transparent bg-gradient-to-r ${accentClass}`}>
                    COMING SOON
                  </span>
                </h1>

                <p className="text-2xl md:text-3xl text-gray-700 font-semibold mb-6 italic tracking-tight">
                  &ldquo;{subtitle}&rdquo;
                </p>

                <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-12 leading-relaxed">
                  {description}
                </p>

                <div className="flex flex-wrap justify-center gap-6 text-sm font-bold uppercase tracking-widest text-gray-400">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className={`w-4 h-4 ${textAccentClass}`} /> Verified Partners
                  </span>
                  <span className="flex items-center gap-2">
                    <Star className={`w-4 h-4 ${textAccentClass}`} /> Premium Quality
                  </span>
                  <span className="flex items-center gap-2">
                    <Zap className={`w-4 h-4 ${textAccentClass}`} /> Instant Booking
                  </span>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Value Proposition */}
          <section className="py-20 bg-gray-50/50 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  {/* Highlights */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <h2 className="text-4xl font-bold text-gray-900 mb-10 leading-tight">
                      {highlightsTitle}
                    </h2>
                    <div className="grid gap-4">
                      {highlights.map((highlight, index) => (
                        <motion.div
                          key={index}
                          initial={{ x: -20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-100 transition-all group"
                        >
                          <div
                            className={`p-2 rounded-lg ${lightBgClass} ${textAccentClass} group-hover:scale-110 transition-transform`}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <span className="text-gray-800 text-base font-medium">{highlight}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Perfect For section (e.g. Hourly Rooms) */}
                    {perfectFor && perfectFor.length > 0 && (
                      <div className="mt-8">
                        <p className="text-sm font-black text-gray-500 uppercase tracking-widest mb-3">Perfect for:</p>
                        <div className="flex flex-wrap gap-2">
                          {perfectFor.map((item, i) => (
                            <span
                              key={i}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${lightBgClass} ${textAccentClass}`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Visual Panel */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                  >
                    <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-square">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br opacity-40 mix-blend-overlay ${accentClass}`}
                      />
                      {backgroundImage ? (
                        <Image
                          src={backgroundImage}
                          alt={title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${accentClass} flex items-center justify-center`}
                        >
                          <div className="text-white scale-[3] opacity-20">{icon}</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 lg:p-12">
                        <h3 className="text-white text-3xl font-black mb-4 leading-tight">
                          {title} <br />
                          REIMAGINED
                        </h3>
                        <p className="text-gray-200 text-base leading-relaxed">{onboardingText}</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-40 bg-gradient-to-br ${accentClass}`}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Inquiry / Form Section */}
          <section className="py-20 lg:py-28 container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-5 gap-12 items-start">
                {/* Contact Info */}
                <div className="lg:col-span-2 sticky top-32">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <div
                      className={`w-12 h-1 bg-gradient-to-r ${accentClass} mb-6 rounded-full`}
                    />
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-5 leading-tight">
                      {inquiryTitle}
                    </h2>
                    <p className="text-lg text-gray-500 mb-10 leading-relaxed font-medium">
                      {inquirySubtitle}
                    </p>

                    <div className="space-y-3">
                      <a
                        href="mailto:support@spodia.in"
                        className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all group"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md ${btnClass} group-hover:rotate-12 transition-transform`}
                        >
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-0.5">
                            Direct Email
                          </p>
                          <p className="text-gray-900 font-semibold text-sm">support@spodia.in</p>
                        </div>
                      </a>

                      <a
                        href="tel:+918800842084"
                        className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all group"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md ${btnClass} group-hover:rotate-12 transition-transform`}
                        >
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-0.5">
                            Priority Support
                          </p>
                          <p className="text-gray-900 font-semibold text-sm">+91 88008 42084</p>
                        </div>
                      </a>
                    </div>
                  </motion.div>
                </div>

                {/* Form Slot — rendered by page */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="lg:col-span-3"
                >
                  <div className="bg-white p-6 lg:p-10 rounded-2xl shadow-lg border border-gray-100">
                    {formTitle && (
                      <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                        {formTitle}
                      </h3>
                    )}
                    {children}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default ComingSoonTemplate
