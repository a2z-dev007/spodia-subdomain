"use client"

import { useMemo } from "react"
import { generateTextAvatar } from "@/utils/avatarUtils"

interface TextAvatarProps {
  name: string
  identifier?: string | number
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showRing?: boolean
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm", 
  lg: "w-12 h-12 text-base",
  xl: "w-24 h-24 text-2xl"
}

const ringClasses = {
  sm: "ring-1",
  md: "ring-2", 
  lg: "ring-2",
  xl: "ring-4"
}

const TextAvatar = ({ 
  name, 
  identifier,
  size = "md", 
  className = "", 
  showRing = false 
}: TextAvatarProps) => {
  const { initials, colorClass } = useMemo(() => 
    generateTextAvatar(name, identifier), 
    [name, identifier]
  )
  
  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white ${className}`
  const ringClass = showRing ? `${ringClasses[size]} ring-gray-200` : ""
  
  return (
    <div className={`${baseClasses} ${ringClass} ${colorClass}`}>
      {initials}
    </div>
  )
}

export default TextAvatar