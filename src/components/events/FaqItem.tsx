'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

interface FaqItemProps {
  q: string
  a: string
}

export default function FaqItem({ q, a }: FaqItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`group bg-white rounded-3xl border transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
        open 
          ? 'border-[#FF9530] shadow-[0_20px_40px_rgba(255,149,48,0.08)] scale-[1.01]' 
          : 'border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-gray-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)]'
      }`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between text-left px-6 py-3 sm:px-7 sm:py-4 gap-6 active:scale-[0.98] transition-transform duration-200 outline-none"
        aria-expanded={open}
      >
        <span className={`font-black text-sm sm:text-lg tracking-tight transition-colors duration-500 ${open ? 'text-gray-900' : 'text-gray-700'}`}>
          {q}
        </span>

        <span
          className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            open
              ? 'bg-[#FF9530] text-white shadow-lg shadow-orange-200 rotate-180'
              : 'bg-orange-50 text-[#FF9530] group-hover:bg-[#FF9530] group-hover:text-white'
          }`}
        >
          {open 
            ? <Minus className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} /> 
            : <Plus className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
          }
        </span>
      </button>

      <div
        className="grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div 
            className={`px-6 pb-6 sm:px-7 sm:pb-7 pt-0 border-t border-gray-50/50 mt-1 transition-all duration-500 ${
              open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <p className="text-gray-500 text-sm sm:text-lg leading-relaxed font-medium pt-1">
              {a}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
