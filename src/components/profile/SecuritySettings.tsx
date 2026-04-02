"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { changePassword } from "@/services/api"
import { toast } from 'react-toastify'

const SecuritySettings = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  // Real-time password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  })

  // Update password validation in real-time
  useEffect(() => {
    if (passwordData.newPassword) {
      setPasswordValidation({
        minLength: passwordData.newPassword.length >= 6,
        hasUppercase: /[A-Z]/.test(passwordData.newPassword),
        hasLowercase: /[a-z]/.test(passwordData.newPassword),
        hasNumber: /[0-9]/.test(passwordData.newPassword),
      })
    } else {
      setPasswordValidation({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
      })
    }
  }, [passwordData.newPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match!", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    if (!passwordValidation.hasUppercase || !passwordValidation.hasLowercase || !passwordValidation.hasNumber) {
      toast.error("Password must contain at least one uppercase letter, one lowercase letter, and one number!", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    try {
      setIsSaving(true)

      const response = await changePassword({
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_new_password: passwordData.confirmPassword,
      })

      if (response.status !== 201) {
      
        throw new Error('Failed to change password')
      }

      

      // const result = await 

      // // Update user in Redux store if userdetail is returned
      // if (result.userdetail) {
      //   dispatch(updateUser(result.userdetail))
      // }

      setIsSaving(false)
      setIsChangingPassword(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast.success("Password updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      console.error('Error changing password:', error)
      setIsSaving(false)

      toast.error(error instanceof Error ? error.message : "Failed to change password. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleCancel = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setIsChangingPassword(false)
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-8 flex-col md:flex-row">
        <div className="flex items-center space-x-3 md:mb-0 mb-4">
          <Shield className="w-6 h-6 text-[#FF9530]" />
          <h2 className="md:text-2xl text-xl font-bold text-gray-900">Security Settings</h2>
        </div>
        {!isChangingPassword && (
          <Button
            onClick={() => setIsChangingPassword(true)}
            variant="outline"
            className="text-[#FF9530] w-full md:w-max border-[#FF9530] hover:bg-[#FF9530] hover:text-white"
          >
            Change Password
          </Button>
        )}
      </div>

      {!isChangingPassword ? (
        <div className="space-y-6">
          {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Password</h3>
              <p className="text-sm text-gray-600">Last updated 3 months ago</p>
            </div>
            <div className="text-gray-400">••••••••</div>
          </div> */}

          {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" className="text-[#078ED8] border-[#078ED8] hover:bg-[#078ED8] hover:text-white">
              Enable
            </Button>
          </div> */}

          {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Login Notifications</h3>
              <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
            </div>
            <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white">
              Enabled
            </Button>
          </div> */}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                name="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                className="pl-10 pr-10 h-12"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                name="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                className="pl-10 pr-10 h-12"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Real-time Password Validation */}
            {passwordData.newPassword && (
              <div className="text-xs space-y-1.5 mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-700 mb-2">Password must contain:</p>
                <div className="space-y-1.5">
                  <div className={`flex items-center gap-2 transition-colors ${
                    passwordValidation.minLength ? "text-green-600" : "text-gray-500"
                  }`}>
                    {passwordValidation.minLength ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-current" />
                    )}
                    <span>At least 6 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${
                    passwordValidation.hasUppercase ? "text-green-600" : "text-gray-500"
                  }`}>
                    {passwordValidation.hasUppercase ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-current" />
                    )}
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${
                    passwordValidation.hasLowercase ? "text-green-600" : "text-gray-500"
                  }`}>
                    {passwordValidation.hasLowercase ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-current" />
                    )}
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${
                    passwordValidation.hasNumber ? "text-green-600" : "text-gray-500"
                  }`}>
                    {passwordValidation.hasNumber ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-current" />
                    )}
                    <span>One number</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                name="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className="pl-10 pr-10 h-12"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {passwordData.confirmPassword && passwordData.newPassword && (
              <div className={`text-xs mt-2 flex items-center gap-2 ${
                passwordData.confirmPassword === passwordData.newPassword ? "text-green-600" : "text-red-500"
              }`}>
                {passwordData.confirmPassword === passwordData.newPassword ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Passwords match</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Passwords do not match</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#FF9530] hover:bg-[#e8851c] text-white px-8" disabled={isSaving}>
              {isSaving ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default SecuritySettings
