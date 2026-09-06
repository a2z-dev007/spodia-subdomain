/**
 * Razorpay utility functions
 */

declare global {
  interface Window {
    Razorpay: any
  }
}

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if script is already loaded
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/**
 * Razorpay error response interface
 */
export interface RazorpayErrorResponse {
  error: {
    code: string
    description: string
    source?: string
    step?: string
    reason?: string
    metadata?: {
      order_id?: string
      payment_id?: string
    }
  }
}

/**
 * Razorpay payment options interface
 */
export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  image?: string
  order_id: string
  handler: (response: RazorpaySuccessResponse) => void
  onPaymentFailed?: (response: RazorpayErrorResponse) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, any>
  theme?: {
    color?: string
  }
  modal?: {
    ondismiss?: () => void
    escape?: boolean
    backdropclose?: boolean
    confirm_close?: boolean
    handleback?: boolean
  }
}

/**
 * Razorpay success response interface
 */
export interface RazorpaySuccessResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

/**
 * Open Razorpay payment modal
 */
export const openRazorpayModal = (options: RazorpayOptions) => {
  if (typeof window === 'undefined' || !window.Razorpay) {
    throw new Error('Razorpay SDK is not loaded')
  }

  const { onPaymentFailed, ...razorpayOptions } = options
  const razorpay = new window.Razorpay(razorpayOptions)

  if (onPaymentFailed) {
    razorpay.on('payment.failed', (response: RazorpayErrorResponse) => {
      console.error('💳 [Razorpay] payment.failed event received:', response)
      onPaymentFailed(response)
    })
  }

  try {
    razorpay.open()
  } catch (err) {
    console.error('💳 [Razorpay] Error executing razorpay.open():', err)
    throw err
  }

  return razorpay
}

