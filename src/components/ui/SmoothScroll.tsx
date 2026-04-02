'use client'

import { ReactLenis } from 'lenis/react'
import type { LenisOptions } from 'lenis'

interface SmoothScrollProps {
  children: React.ReactNode
  options?: LenisOptions
}

export default function SmoothScroll({ children, options }: SmoothScrollProps) {
  return (
    <ReactLenis root options={{ 
      lerp: 0.1, 
      duration: 1.5, 
      smoothWheel: true,
      ...options 
    }}>
      {children}
    </ReactLenis>
  )
}
