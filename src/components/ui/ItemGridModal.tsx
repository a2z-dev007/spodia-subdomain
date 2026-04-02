'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ShieldCheck } from 'lucide-react'

interface GridItem {
  id: string | number
  name: string
}

interface ItemGridModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle: string
  items: GridItem[]
  type?: 'bullet' | 'check' | 'shield' | 'info'
}

export function ItemGridModal({
  isOpen,
  onClose,
  title,
  subtitle,
  items,
  type = 'bullet'
}: ItemGridModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md" 
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative bg-white w-full sm:max-w-4xl xl:max-w-6xl max-h-[90vh] rounded-2xl sm:rounded-[4rem] shadow-4xl flex flex-col overflow-hidden"
          >
            {/* Sticky Header */}
            <div className="shrink-0 flex items-start justify-between p-6 md:px-16 md:pt-12 md:pb-6 border-b border-gray-100">
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2 md:mb-4 pr-10">
                  {title}
                </h3>
                <p className="text-gray-500 font-bold text-sm sm:text-base">{subtitle}</p>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 hover:bg-black hover:text-white transition-all shrink-0 ml-4"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 md:p-16 md:pt-8 bg-white min-h-0">
               <div className="max-h-[40vh] sm:max-h-[55vh] md:max-h-[480px] overflow-y-auto pr-2 md:pr-4 custom-scrollbar-orange">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl border bg-gray-50 border-gray-100/50 shadow-sm hover:bg-white hover:border-orange-100 transition-all"
                    >
                      {type === 'check' && (
                        <div className="w-8 h-8 rounded-lg bg-green-50 text-[#039c4d] flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4" strokeWidth={3} />
                        </div>
                      )}
                      {type === 'shield' && (
                         <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF9530] flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4" strokeWidth={2.5} />
                         </div>
                      )}
                      {type === 'bullet' && (
                        <div className="w-2 h-2 rounded-full bg-[#FF9530] shrink-0" />
                      )}
                      {type === 'info' && (
                        <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF9530] flex items-center justify-center shrink-0 uppercase">
                           <div className="w-2 h-2 rounded-full bg-current" />
                        </div>
                      )}
                      
                      <span className="text-xs sm:text-sm md:text-[14px] font-bold tracking-tight leading-tight text-gray-700">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          <style jsx global>{`
            .custom-scrollbar-orange::-webkit-scrollbar {
              width: 5px;
            }
            .custom-scrollbar-orange::-webkit-scrollbar-track {
              background: #f9fafb;
              border-radius: 10px;
            }
            .custom-scrollbar-orange::-webkit-scrollbar-thumb {
              background: #fee2e2;
              border-radius: 10px;
            }
            .custom-scrollbar-orange::-webkit-scrollbar-thumb:hover {
              background: #fecaca;
            }
            @media (min-width: 768px) {
              .custom-scrollbar-orange::-webkit-scrollbar {
                width: 8px;
              }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
