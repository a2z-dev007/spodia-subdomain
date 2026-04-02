'use client'

import React from 'react'
import { Loader2, Send } from 'lucide-react'
import { motion } from 'framer-motion'

interface SubmitButtonProps {
  isSubmitting: boolean
  label: string
  accentColor: 'orange' | 'blue'
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, label, accentColor }) => {
  const btnClass = accentColor === 'blue' ? 'bg-blue-gradient' : 'bg-btn-gradient'
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={isSubmitting}
      className={`w-full ${btnClass} text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm mt-1 disabled:opacity-70 disabled:cursor-not-allowed group`}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Submitting...</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </>
      )}
    </motion.button>
  )
}
