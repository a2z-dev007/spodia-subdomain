import { useMemo } from 'react'
import { calculateFinalAmount } from '@/utils/taxCalculation'
import { format } from 'date-fns'

export const usePriceCalculation = (bookingFormData: any) => {
  return useMemo(() => {
    // Simply return the values that are already calculated and stored in Redux
    // These are the SAME values the modal uses
    const subtotal = bookingFormData.totalPrice || 0
    
    // Get tax and deduction details from Redux
    const taxationDetails = bookingFormData.taxationDetails || []
    const deductionDetails = bookingFormData.deductionDetails || []
    
    // Calculate tax and deductions using the same logic as modal
    const taxResult = calculateFinalAmount(subtotal, taxationDetails, [])
    const deductionResult = calculateFinalAmount(subtotal, [], deductionDetails)
    
    const totalTax = taxResult.totalTax
    const totalDeductions = deductionResult.totalDeductions
    
    // Get the rate percentages
    const gstRate = taxationDetails[0]?.tax_entries?.[0]?.rate || 12
    const serviceChargeRate = deductionDetails[0]?.deduction_entries?.[0]?.rate || 4
    
    return {
      subtotal,
      totalTax,
      totalDeductions,
      total: subtotal + totalTax + totalDeductions,
      taxDetails: [
        { name: 'GST', rate: gstRate, amount: totalTax },
        { name: 'Service Charge', rate: serviceChargeRate, amount: totalDeductions }
      ]
    }
  }, [bookingFormData])
}
