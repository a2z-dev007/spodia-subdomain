"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Settings, Bell, Mail, Globe } from "lucide-react"
import { toast } from "react-toastify"

const PreferencesSettings = () => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    marketingEmails: false,
    bookingReminders: true,
    priceAlerts: true,
    newsletter: false,
    currency: "USD",
    language: "English",
    timeZone: "UTC-5",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleCheckboxChange = (key: string, checked: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: checked }))
  }

  const handleSelectChange = (key: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSaving(false)
    toast.success("Preferences updated successfully!")
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="flex items-center space-x-3 mb-8">
        <Settings className="w-6 h-6 text-[#FF9530]" />
        <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
      </div>

      <div className="space-y-8">
        {/* Notification Preferences */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4 pl-7">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="emailNotifications"
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => handleCheckboxChange("emailNotifications", checked as boolean)}
              />
              <label htmlFor="emailNotifications" className="text-sm text-gray-700">
                Email notifications for bookings and updates
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="pushNotifications"
                checked={preferences.pushNotifications}
                onCheckedChange={(checked) => handleCheckboxChange("pushNotifications", checked as boolean)}
              />
              <label htmlFor="pushNotifications" className="text-sm text-gray-700">
                Push notifications on mobile devices
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="smsNotifications"
                checked={preferences.smsNotifications}
                onCheckedChange={(checked) => handleCheckboxChange("smsNotifications", checked as boolean)}
              />
              <label htmlFor="smsNotifications" className="text-sm text-gray-700">
                SMS notifications for important updates
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="bookingReminders"
                checked={preferences.bookingReminders}
                onCheckedChange={(checked) => handleCheckboxChange("bookingReminders", checked as boolean)}
              />
              <label htmlFor="bookingReminders" className="text-sm text-gray-700">
                Booking reminders and check-in notifications
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="priceAlerts"
                checked={preferences.priceAlerts}
                onCheckedChange={(checked) => handleCheckboxChange("priceAlerts", checked as boolean)}
              />
              <label htmlFor="priceAlerts" className="text-sm text-gray-700">
                Price drop alerts for saved properties
              </label>
            </div>
          </div>
        </div>

        {/* Marketing Preferences */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Marketing</h3>
          </div>
          <div className="space-y-4 pl-7">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="marketingEmails"
                checked={preferences.marketingEmails}
                onCheckedChange={(checked) => handleCheckboxChange("marketingEmails", checked as boolean)}
              />
              <label htmlFor="marketingEmails" className="text-sm text-gray-700">
                Promotional emails and special offers
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="newsletter"
                checked={preferences.newsletter}
                onCheckedChange={(checked) => handleCheckboxChange("newsletter", checked as boolean)}
              />
              <label htmlFor="newsletter" className="text-sm text-gray-700">
                Monthly newsletter with travel tips and deals
              </label>
            </div>
          </div>
        </div>

        {/* Regional Preferences */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Regional Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Currency</label>
              <select
                value={preferences.currency}
                onChange={(e) => handleSelectChange("currency", e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9530]"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => handleSelectChange("language", e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9530]"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Time Zone</label>
              <select
                value={preferences.timeZone}
                onChange={(e) => handleSelectChange("timeZone", e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9530]"
              >
                <option value="UTC-8">Pacific Time (UTC-8)</option>
                <option value="UTC-7">Mountain Time (UTC-7)</option>
                <option value="UTC-6">Central Time (UTC-6)</option>
                <option value="UTC-5">Eastern Time (UTC-5)</option>
                <option value="UTC+0">GMT (UTC+0)</option>
                <option value="UTC+1">Central European Time (UTC+1)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8 border-t">
        <Button onClick={handleSave} className="bg-[#FF9530] hover:bg-[#e8851c] text-white px-8" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  )
}

export default PreferencesSettings
