"use client"

import { useMemo } from "react"
import Image from "next/image"
import { User } from "@/lib/features/auth/authSlice"
import { generateAvatarColor, generateInitials } from "@/utils/avatarUtils"

interface UserAvatarProps {
  user: User
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

const UserAvatar = ({ 
  user, 
  size = "md", 
  className = "", 
  showRing = false 
}: UserAvatarProps) => {
  const initials = useMemo(() => generateInitials(user.full_name), [user.full_name])
  const avatarColor = useMemo(() => generateAvatarColor(user.id), [user.id])
  
  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white ${className}`
  const ringClass = showRing ? `${ringClasses[size]} ring-gray-200` : ""
  
  if (user.profile_image) {
    return (
      <div className={`${baseClasses} ${ringClass} overflow-hidden`}>
        <Image
          src={user.profile_image}
          alt={user.full_name}
          width={size === "xl" ? 96 : size === "lg" ? 48 : size === "md" ? 40 : 32}
          height={size === "xl" ? 96 : size === "lg" ? 48 : size === "md" ? 40 : 32}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }
  
  return (
    <div className={`${baseClasses} ${ringClass} ${avatarColor}`}>
      {initials}
    </div>
  )
}

export default UserAvatar