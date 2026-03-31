// Utility to suppress non-critical console warnings
export const suppressNonCriticalWarnings = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    const originalWarn = console.warn
    const originalError = console.error

    console.warn = (...args: any[]) => {
      const message = args.join(' ')
      
      // Suppress known non-critical warnings
      const suppressedWarnings = [
        'web-share',
        'x-rtb-fingerprint-id',
        'Unrecognized feature',
        'Failed to load Google Analytics',
        'Failed to load reCAPTCHA',
        'Failed to load Google Maps'
      ]

      if (!suppressedWarnings.some(warning => message.includes(warning))) {
        originalWarn.apply(console, args)
      }
    }

    console.error = (...args: any[]) => {
      const message = args.join(' ')
      
      // Suppress known non-critical errors
      const suppressedErrors = [
        'x-rtb-fingerprint-id',
        'Expected length, "auto"',
        'Refused to get unsafe header'
      ]

      if (!suppressedErrors.some(error => message.includes(error))) {
        originalError.apply(console, args)
      }
    }
  }
}

// Initialize on client side
if (typeof window !== 'undefined') {
  suppressNonCriticalWarnings()
}