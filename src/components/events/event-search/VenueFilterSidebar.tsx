'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, X, ChevronRight, Check } from 'lucide-react'
import { fetchVenueTypes, fetchEventTypes } from '@/lib/api/eventsEndpoints'
import { IMAGES } from '@/assets/images'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import PremiumLocationSelect from '@/components/ui/PremiumLocationSelect'
import type { Filters } from './types'

interface VenueFilterSidebarProps {
  filters: Filters
  location: any
  setLocation: (loc: any) => void
  onChange: (f: Partial<Filters>) => void
  onClear: () => void
}

export function VenueFilterSidebar({ filters, location, setLocation, onChange, onClear }: VenueFilterSidebarProps) {
  const { data: vtData, isLoading: vtLoading } = useQuery({ queryKey: ['venueTypes'], queryFn: () => fetchVenueTypes() })
  const { data: etData, isLoading: etLoading } = useQuery({ queryKey: ['eventTypes'], queryFn: () => fetchEventTypes() })

  const [modalType, setModalType] = useState<'venue' | 'event' | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const venueTypes = vtData?.records || []
  const eventTypes = etData?.records || []

  const toggleItem = (key: 'venueTypes' | 'eventTypes', id: number) => {
    const cur = filters[key]
    const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]
    onChange({ [key]: next })
  }

  const renderSection = (title: string, items: any[], key: 'venueTypes' | 'eventTypes', isLoading?: boolean) => {
    const displayItems = items.slice(0, 5)
    const hasMore = items.length > 5

    return (
      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{title}</p>
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-5 h-5 bg-gray-100 rounded-md" />
                <div className="h-4 w-32 bg-gray-50 rounded-lg" />
              </div>
            ))
          ) : (
            <>
              {displayItems.map(item => (
                <div key={item.id} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleItem(key, item.id)}>
                  <Checkbox 
                    checked={filters[key].includes(item.id)} 
                    onCheckedChange={() => toggleItem(key, item.id)}
                    className="data-[state=checked]:bg-[#FF9530] data-[state=checked]:border-[#FF9530]"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#FF9530] transition-colors">{item.name}</span>
                </div>
              ))}
              {hasMore && (
                <button 
                  onClick={() => { setModalType(key === 'venueTypes' ? 'venue' : 'event'); setSearchTerm(''); }}
                  className="text-sm font-bold text-[#FF9530] hover:underline flex items-center mt-2"
                >
                  Show More <ChevronRight className="w-4 h-4 ml-0.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-orange-50 border-b border-[#FF9530]/20">
        <h2 className="font-extrabold text-gray-900">Filter Venues</h2>
        <button onClick={onClear} className="text-xs font-bold text-[#FF9530] hover:bg-white px-2 py-1 rounded-lg transition-colors">
          Clear all
        </button>
      </div>

      {/* Location */}
      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Search Location</p>
        <PremiumLocationSelect
          value={location}
          onChange={setLocation}
          placeholder="Search City..."
          className="w-full"
        />
      </div>

      {/* Dynamic Sections */}
      {renderSection('Venue Type', venueTypes, 'venueTypes', vtLoading)}
      {renderSection('Event Type', eventTypes, 'eventTypes', etLoading)}

      {/* Capacity Slider */}
      {/* <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Capacity (Guests)</p>
          <span className="text-xs font-bold text-[#FF9530] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 italic">
            {filters.minCap} - {filters.maxCap}
          </span>
        </div>
        <Slider 
          value={[filters.minCap, filters.maxCap]} 
          min={0} 
          max={10000} 
          step={50}
          onValueChange={([min, max]) => onChange({ minCap: min, maxCap: max })}
          className="py-4"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-bold px-1">
          <span>0</span>
          <span>5000</span>
          <span>10000+</span>
        </div>
      </div> */}

      {/* Price Slider */}
      {/* <div className="px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Veg Price (₹/Plate)</p>
          <span className="text-xs font-bold text-[#FF9530] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 italic">
            ₹{filters.minVeg} - ₹{filters.maxVeg}
          </span>
        </div>
        <Slider 
          value={[filters.minVeg, filters.maxVeg]} 
          min={0} 
          max={5000} 
          step={100}
          onValueChange={([min, max]) => onChange({ minVeg: min, maxVeg: max })}
          className="py-4"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-bold px-1">
          <span>₹0</span>
          <span>₹2500</span>
          <span>₹5000+</span>
        </div>
      </div> */}

      {/* Modal for Show More */}
      <Dialog open={modalType !== null} onOpenChange={() => setModalType(null)}>
        <DialogContent className="sm:max-w-[80%] p-0 overflow-hidden rounded-2xl lg:rounded-[2rem] border-none shadow-2xl">
          <DialogHeader className="px-6 py-5 bg-orange-50/50 border-b border-orange-100">
            <DialogTitle className="text-xl font-black text-gray-900">Select {modalType === 'venue' ? 'Venue Type' : 'Event Type'}</DialogTitle>
          </DialogHeader>
          
          <div className="p-6">
            {/* Search within modal */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder={`Search ${modalType === 'venue' ? 'venues' : 'events'}...`} 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-11 h-12 bg-gray-50 border-gray-100 rounded-2xl focus:ring-[#FF9530]/20 focus:border-[#FF9530]"
              />
            </div>

            <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                {(modalType === 'venue' ? venueTypes : eventTypes)
                  .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(item => {
                    const key = modalType === 'venue' ? 'venueTypes' : 'eventTypes'
                    const isChecked = filters[key].includes(item.id)
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => toggleItem(key, item.id)}
                        className={`group flex items-center  gap-3 p-2.5 rounded-2xl cursor-pointer transition-all border-2 h-full ${
                          isChecked 
                            ? 'bg-orange-50/50 border-[#FF9530] shadow-sm' 
                            : 'bg-white border-gray-100 hover:border-[#FF9530]/30 hover:shadow-md'
                        }`}
                      >
                        <div className="relative size-12 shrink-0 rounded-full overflow-hidden bg-gray-100">
                          <img 
                            src={item.file || IMAGES.placeholder.src} 
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                          {isChecked && (
                            <div className="absolute top-2 right-2 bg-[#FF9530] rounded-full p-1.5 text-white z-10 shadow-lg ring-2 ring-white">
                               <Check className="w-3 h-3" strokeWidth={4} />
                            </div>
                          )}
                          <div className={`absolute inset-0  bg-black/5 transition-opacity ${isChecked ? 'opacity-0' : 'group-hover:opacity-0'}`} />
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-wider text-left px-1 ${isChecked ? 'text-[#FF9530]' : 'text-gray-600'}`}>
                          {item.name}
                        </span>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          
          <div className="px-6 py-5 bg-gray-50 flex justify-end">
            <button 
              onClick={() => setModalType(null)}
              className="bg-[#FF9530] text-white font-black uppercase tracking-widest text-xs px-10 py-3 rounded-2xl shadow-xl shadow-orange-500/30 hover:bg-[#FF8000] hover:scale-105 active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
