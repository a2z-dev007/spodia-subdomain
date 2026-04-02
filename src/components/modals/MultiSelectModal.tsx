"use client"
import { useEffect, useMemo, useState, useRef } from "react"
import { createPortal } from "react-dom"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, Check, Star } from "lucide-react"
import { IMAGE_BASE_URL } from "@/lib/api/apiClient"
import Image from "next/image"

type Value = string | number

interface MultiSelectModalProps<T> {
    title: string
    items: T[]
    isOpen: boolean
    onClose: () => void
    selectedValues: Value[]
    onApply: (values: Value[]) => void
    getLabel: (item: T) => string
    getValue: (item: T) => Value
    placeholder?: string
    maxHeight?: string
}

export default function MultiSelectModal<T>({
    title,
    items,
    isOpen,
    onClose,
    selectedValues,
    onApply,
    getLabel,
    getValue,
    placeholder = "Search items...",
    maxHeight = "60vh"
}: MultiSelectModalProps<T>) {
    const [localSelected, setLocalSelected] = useState<Value[]>(selectedValues)
    const [query, setQuery] = useState("")
    const [isAnimating, setIsAnimating] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    // Handle modal open/close animations and focus management
    useEffect(() => {
        if (isOpen) {
            setLocalSelected(selectedValues)
            setQuery("")
            setIsAnimating(true)
            // Focus search input when modal opens
            setTimeout(() => searchInputRef.current?.focus(), 100)
        } else {
            setIsAnimating(false)
        }
    }, [isOpen, selectedValues])

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    // Filter items based on search query
    const filteredItems = useMemo(() => {
        const searchTerm = query.trim().toLowerCase()
        if (!searchTerm) return items
        return items.filter(item =>
            getLabel(item).toLowerCase().includes(searchTerm)
        )
    }, [items, query, getLabel])

    // Toggle item selection
    const toggleItem = (value: Value) => {
        setLocalSelected(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        )
    }

    // Select/deselect all filtered items
    const toggleAll = () => {
        const filteredValues = filteredItems.map(getValue)
        const allSelected = filteredValues.every(value => localSelected.includes(value))

        if (allSelected) {
            // Deselect all filtered items
            setLocalSelected(prev => prev.filter(value => !filteredValues.includes(value)))
        } else {
            // Select all filtered items
            const newSelected = [...localSelected]
            filteredValues.forEach(value => {
                if (!newSelected.includes(value)) {
                    newSelected.push(value)
                }
            })
            setLocalSelected(newSelected)
        }
    }

    const handleApply = () => {
        onApply(localSelected)
        onClose()
    }

    // Check if all filtered items are selected
    const filteredValues = filteredItems.map(getValue)
    const allFilteredSelected = filteredValues.length > 0 && filteredValues.every(value => localSelected.includes(value))
    const someFilteredSelected = filteredValues.some(value => localSelected.includes(value))
    const selectedCount = localSelected.length

    if (!isOpen && !isAnimating) return null

    const modalContent = (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 transition-all duration-300 ${isOpen ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'
                }`}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                ref={modalRef}
                className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
                    }`}
                style={{ maxHeight: 'calc(100vh - 6rem)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                        {selectedCount > 0 && (
                            <span className="bg-[#FF9530] text-white text-xs font-medium px-2 py-1 rounded-full">
                                {selectedCount} selected
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        aria-label="Close modal"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 border-b border-gray-200">
                    <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={placeholder}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9530] focus:border-transparent transition-all duration-200"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                            >
                                <X size={16} className="text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Select All Toggle */}
                    {filteredItems.length > 0 && (
                        <div className="mt-4 flex items-center gap-3">
                            <Checkbox
                                id="select-all"
                                checked={allFilteredSelected}
                                onCheckedChange={toggleAll}
                                className="data-[state=checked]:bg-[#FF9530] data-[state=checked]:border-[#FF9530]"
                            />
                            <label
                                htmlFor="select-all"
                                className="text-sm font-medium text-gray-700 cursor-pointer"
                            >
                                {allFilteredSelected ? 'Deselect all' : 'Select all'}
                                {filteredItems.length !== items.length && (
                                    <span className="text-gray-500 font-normal"> ({filteredItems.length} items)</span>
                                )}
                            </label>
                        </div>
                    )}
                </div>

                {/* Items List */}
                <div
                    className="overflow-y-auto flex-1"
                    style={{ minHeight: '200px' }}
                >
                    <div className="p-2">
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-2">
                                    <Search size={48} className="mx-auto opacity-50" />
                                </div>
                                <p className="text-gray-500 text-sm">
                                    {query ? `No items match "${query}"` : 'No items available'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {filteredItems.map((item, idx) => {
                                    const value = getValue(item)
                                    const label = getLabel(item)
                                    const isSelected = localSelected.includes(value)
                                    const itemId = `item-${value}-${idx}`

                                    return (
                                        <div
                                            key={itemId}
                                            className={`relative flex items-center gap-2 p-3 rounded-lg border-1 transition-all duration-200 cursor-pointer group hover:shadow-sm ${isSelected
                                                ? 'bg-[#FF9530]/10 border-[#FF9530] shadow-sm'
                                                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                            onClick={() => toggleItem(value)}
                                        >
                                            <Checkbox
                                                id={itemId}
                                                checked={isSelected}
                                                onCheckedChange={() => toggleItem(value)}
                                                className="data-[state=checked]:bg-[#FF9530] data-[state=checked]:border-[#FF9530] flex-shrink-0"
                                            />
                                            <label
                                                htmlFor={itemId}
                                                className="flex-1 text-sm text-gray-700 cursor-pointer group-hover:text-gray-900 leading-tight min-w-0 flex items-center space-x-2"
                                            >
                                                {(item as any).image ? (
                                                    <div className="w-4 h-4 flex-shrink-0">
                                                        <Image
                                                            src={`${IMAGE_BASE_URL}${(item as any).image}`}
                                                            alt={label}
                                                            width={16}
                                                            height={16}
                                                            className="w-4 h-4 object-contain"
                                                            onError={(e) => {
                                                                // Fallback to default icon if image fails to load
                                                                e.currentTarget.style.display = 'none';
                                                                const parent = e.currentTarget.parentElement;
                                                                if (parent) {
                                                                    parent.innerHTML = '<svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <Star className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                )}
                                                <span className="block truncate" title={label}>
                                                    {label}
                                                </span>
                                            </label>
                                            {isSelected && (
                                                <div className="bg-[#FF9530] rounded-full p-1">
                                                    <Check size={12} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <div className="text-sm text-gray-600">
                        {selectedCount > 0 ? (
                            <span>{selectedCount} of {items.length} selected</span>
                        ) : (
                            <span>Select items to continue</span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            disabled={selectedCount === 0}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#FF9530] rounded-lg hover:bg-[#e8851f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                        >
                            Apply Selection
                            {selectedCount > 0 && (
                                <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded">
                                    {selectedCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

    // Use portal to render modal at document body level
    if (typeof document !== 'undefined') {
        return createPortal(modalContent, document.body)
    }

    return null
}
