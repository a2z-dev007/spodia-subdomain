"use client"

import { useAppSelector } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Edit, Calendar, Phone, Mail } from "lucide-react"
import UserAvatar from "@/components/ui/UserAvatar"

const ProfileOverview = () => {
  const { user } = useAppSelector((state) => state?.auth ?? { user: null, isLoading: false })
  const router = useRouter()

  if (!user) return null

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <UserAvatar user={user} size="xl" />
        </div>
        <h3 className="font-bold text-gray-900 text-lg">{user.full_name}</h3>
        <p className="text-gray-600 text-sm">{user.role_name}</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3 text-sm">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{user.email}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{user.mobile}</span>
        </div>
        
      </div>

      <Button
        onClick={() => router.push("/profile")}
        className="w-full bg-[#FF9530] hover:bg-[#e8851c] text-white mb-4"
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Profile
      </Button>

     
    </div>
  )
}

export default ProfileOverview
