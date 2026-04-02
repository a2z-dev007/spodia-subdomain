"use client"

import { useState } from "react"
import LoginForm from "./LoginForm"

// Simple test component to verify LoginForm functionality
const LoginFormTest = () => {
  const [showTest, setShowTest] = useState(false)

  if (!showTest) {
    return (
      <div className="p-4">
        <button 
          onClick={() => setShowTest(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Login Form
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-bold text-blue-800 mb-2">Test Scenarios:</h2>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Try invalid email format</li>
            <li>• Try empty password</li>
            <li>• Try wrong credentials (3 times for rate limiting)</li>
            <li>• Check network error handling</li>
            <li>• Verify toast notifications</li>
          </ul>
        </div>
        <LoginForm />
        <button 
          onClick={() => setShowTest(false)}
          className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded"
        >
          Hide Test
        </button>
      </div>
    </div>
  )
}

export default LoginFormTest