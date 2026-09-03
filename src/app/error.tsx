"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
          Something went wrong!
        </h1>

        <p className="text-gray-600 text-center mb-8">
          We apologize for the inconvenience. An unexpected error has occurred.
          Please try again or return to the homepage.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Error Details (Development Only):
            </p>
            <pre className="text-xs text-red-600 overflow-auto max-h-40 whitespace-pre-wrap">
              {error.message}
            </pre>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">Error ID: {error.digest}</p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button
            onClick={reset}
            className="flex-1 bg-[#FF9530] hover:bg-[#e8851c] text-white font-bold"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="flex-1 font-bold"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </Button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> If this problem persists, please contact our
            support team at{" "}
            <a
              href="mailto:support@spodia.com"
              className="underline hover:text-blue-900"
            >
              support@spodia.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
