"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react"

interface PayloadPreviewProps {
  payload: any
  title?: string
}

const PayloadPreview = ({ payload, title = "Booking Payload Preview" }: PayloadPreviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Card className="mt-6 border-2 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-3 text-xs"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 px-3 text-xs"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  Expand
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Summary Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div className="bg-white rounded-lg p-2">
            <p className="text-xs text-gray-500">Total Rooms</p>
            <p className="text-sm font-semibold text-gray-900">{payload.roomsCount || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-xs text-gray-500">Total Guests</p>
            <p className="text-sm font-semibold text-gray-900">{payload.no_of_guests || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-xs text-gray-500">Total Price</p>
            <p className="text-sm font-semibold text-gray-900">₹{payload.total || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-xs text-gray-500">Booking Type</p>
            <p className="text-sm font-semibold text-gray-900 uppercase">{payload.booking_type || 'B2C'}</p>
          </div>
        </div>

        {/* Expanded JSON View */}
        {isExpanded && (
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-green-400 font-mono">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        )}

        {/* Info Message */}
        <div className="mt-3 p-2 bg-blue-100 rounded-lg">
          <p className="text-xs text-blue-800">
            ℹ️ This payload will be sent to the payment success API after Razorpay payment confirmation.
            Check the browser console for the complete payload structure.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default PayloadPreview
