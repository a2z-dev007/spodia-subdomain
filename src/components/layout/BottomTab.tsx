"use client"

import { Hotel, Clock, UtensilsCrossed, Sparkles, PartyPopper } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LINKS } from '@/utils/const'
import Link from 'next/link'

const BottomTab = () => {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Ensure it's always visible initially when navigating to a hotel details page
    if (pathname?.includes('/hotels/')) {
      setIsVisible(true)
    }
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      // Do not hide the bottom tab on the Hotel details page
      if (pathname?.includes('/hotels/')) {
        return
      }

      const currentScrollY = window.scrollY
      
      // Show nav when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, pathname])

  if (!mounted) return null

  const tabs = [
    { id: 'hotels', label: 'Hotels', icon: Hotel, path: '/' },
    { id: 'hourly', label: 'Hourly Stays', icon: Clock, path: LINKS.HOURLY_ROOMS },
    { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed, path: LINKS.RESTAURANTS },
    { id: 'spas', label: 'Spas', icon: Sparkles, path: LINKS.SPAS },
    { id: 'events', label: 'Events', icon: PartyPopper, path: LINKS.EVENT_VENUES },
  ]

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/' || pathname.includes('/hotels/')
    return pathname.startsWith(path)
  }

  return (
    <>
      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 z-[45] bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] lg:hidden safe-area-bottom transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="flex items-center h-16 px-2 overflow-x-auto scrollbar-hide scroll-smooth justify-between">
          {tabs.map((tab) => {
            const isTabActive = isActive(tab.path)
            return (
              <Link
                key={tab.id}
                href={tab.path}
                className={`flex flex-col items-center justify-center min-w-[max-content] px-2 h-full transition-all duration-300 relative group ${
                  isTabActive
                    ? 'text-[#FF9530]'
                    : 'text-gray-500 hover:text-[#FF9530]'
                }`}
              >
                <div className={`relative p-1 transition-transform duration-300 ${isTabActive ? 'scale-110 -translate-y-0.5' : 'group-hover:scale-110'}`}>
                  <tab.icon className={`w-5 h-5 ${isTabActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                  {isTabActive && (
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#FF9530] rounded-full animate-pulse" />
                  )}
                </div>
                <span className={`text-[10px] font-bold mt-1 tracking-tight whitespace-nowrap transition-all duration-300 ${isTabActive ? 'opacity-100' : 'opacity-80'}`}>
                  {tab.label}
                </span>
                
                {/* Active Indicator Bar */}
                {isTabActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#FF9530] rounded-t-full shadow-[0_-2px_4px_rgba(255,149,48,0.2)]" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export default BottomTab 