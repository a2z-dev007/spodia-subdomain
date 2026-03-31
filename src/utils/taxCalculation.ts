/**
 * Tax and Deduction Calculation Utility
 * 
 * This utility calculates taxes and deductions based on hotel's taxation_details and deduction_details
 * from the listing API response.
 */

export interface TaxEntry {
  id: number
  tax: number
  tax_category: 'percentage' | 'fixed'
  amount_or_percentage: number
  amount_from: number
  amount_to: number
}

export interface TaxationDetail {
  id: number
  country: number
  country_name: string
  name: string
  code: string
  tax_type: 'slab' | 'percentage' | 'fixed'
  tax_category: 'percentage' | 'fixed' | null
  amount_or_percentage: number
  from_date: string
  to_date: string
  sac_code?: string
  tax_entries?: TaxEntry[]
  status: boolean
  status_remark: string
  created: string
  deleted: boolean
  created_by: number
  full_name: string
}

export interface DeductionDetail {
  id: number
  name: string
  country: number
  country_name: string
  code: string
  tax_type: 'Percentage' | 'Fixed'
  amount_or_percentage: number
  applicable_for: string
  created: string
  deleted: boolean
  created_by: number
  full_name: string
}

export interface TaxCalculationResult {
  name: string
  rate: number
  amount: number
}

/**
 * Calculate tax based on slab entries
 * For slab-based taxation, we need to check which slab the amount falls into
 * and apply the tax accordingly based on the tax_category within each slab entry
 * Returns both the tax amount and the rate that was applied
 */
function calculateSlabTax(amount: number, taxEntries: TaxEntry[]): { amount: number; rate: number } {
  let totalTax = 0
  let appliedRate = 0

  // Sort tax entries by amount_from to ensure correct order
  const sortedEntries = [...taxEntries].sort((a, b) => a.amount_from - b.amount_from)

  for (const entry of sortedEntries) {
    // Check if the amount falls within this slab range
    if (amount >= entry.amount_from && amount <= entry.amount_to) {
      // Check the tax_category inside the tax_entry
      if (entry.tax_category?.toLowerCase() === 'percentage') {
        // Apply percentage tax on the entire amount (not just the slab portion)
        totalTax += (amount * entry.amount_or_percentage) / 100
        appliedRate = entry.amount_or_percentage
      } else if (entry.tax_category?.toLowerCase() === 'fixed') {
        // Apply fixed amount tax
        totalTax += entry.amount_or_percentage
        appliedRate = entry.amount_or_percentage
      }
      break // Found the applicable slab, no need to check further
    }
  }

  return {
    amount: Math.round(totalTax * 100) / 100,
    rate: appliedRate
  }
}

/**
 * Calculate taxes based on taxation_details from hotel API
 */
export function calculateTaxes(
  subtotal: number,
  taxationDetails: TaxationDetail[]
): TaxCalculationResult[] {
  const results: TaxCalculationResult[] = []

  for (const taxDetail of taxationDetails) {
    // Skip if tax is not active or deleted
    if (!taxDetail.status || taxDetail.deleted) {
      continue
    }

    // Check if tax is within valid date range
    const now = new Date()
    const fromDate = new Date(taxDetail.from_date)
    const toDate = new Date(taxDetail.to_date)

    if (now < fromDate || now > toDate) {
      continue // Tax not applicable for current date
    }

    let taxAmount = 0
    let taxRate = taxDetail.amount_or_percentage

    if (taxDetail.tax_type === 'slab' && taxDetail.tax_entries && taxDetail.tax_entries.length > 0) {
      // Slab-based taxation
      const slabResult = calculateSlabTax(subtotal, taxDetail.tax_entries)
      taxAmount = slabResult.amount
      taxRate = slabResult.rate // Use the rate from the applied slab
    } else if (taxDetail.tax_type?.toLowerCase() === 'percentage' || taxDetail.tax_category?.toLowerCase() === 'percentage') {
      // Percentage-based taxation
      taxAmount = (subtotal * taxDetail.amount_or_percentage) / 100
    } else if (taxDetail.tax_type?.toLowerCase() === 'fixed' || taxDetail.tax_category?.toLowerCase() === 'fixed') {
      // Fixed amount taxation
      taxAmount = taxDetail.amount_or_percentage
    }

    results.push({
      name: taxDetail.name,
      rate: taxRate, // Use the actual applied rate
      amount: Math.round(taxAmount * 100) / 100 // Round to 2 decimal places
    })
  }

  return results
}

/**
 * Calculate deductions based on deduction_details from hotel API
 */
export function calculateDeductions(
  subtotal: number,
  deductionDetails: DeductionDetail[]
): TaxCalculationResult[] {
  const results: TaxCalculationResult[] = []

  for (const deduction of deductionDetails) {
    // Skip if deduction is deleted
    if (deduction.deleted) {
      continue
    }

    let deductionAmount = 0

    if (deduction.tax_type?.toLowerCase() === 'percentage') {
      // Percentage-based deduction
      deductionAmount = (subtotal * deduction.amount_or_percentage) / 100
    } else if (deduction.tax_type?.toLowerCase() === 'fixed') {
      // Fixed amount deduction
      deductionAmount = deduction.amount_or_percentage
    }

    results.push({
      name: deduction.name,
      rate: deduction.amount_or_percentage,
      amount: Math.round(deductionAmount * 100) / 100 // Round to 2 decimal places
    })
  }

  return results
}

/**
 * Calculate final amount with all taxes and deductions
 */
export function calculateFinalAmount(
  subtotal: number,
  taxationDetails: TaxationDetail[],
  deductionDetails: DeductionDetail[]
): {
  subtotal: number
  taxes: TaxCalculationResult[]
  deductions: TaxCalculationResult[]
  totalTax: number
  totalDeductions: number
  finalAmount: number
} {
  const taxes = calculateTaxes(subtotal, taxationDetails)
  const deductions = calculateDeductions(subtotal, deductionDetails)

  const totalTax = taxes.reduce((sum, tax) => sum + tax.amount, 0)
  const totalDeductions = deductions.reduce((sum, deduction) => sum + deduction.amount, 0)

  const finalAmount = subtotal + totalTax + totalDeductions

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxes,
    deductions,
    totalTax: Math.round(totalTax * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    finalAmount: Math.round(finalAmount * 100) / 100
  }
}
