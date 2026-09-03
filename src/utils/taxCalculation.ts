/**
 * Tax and Deduction Calculation Utility for Spodia Subdomain
 * Calculates taxes and deductions based on hotel's taxation_details and deduction_details.
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
  type?: string
}

function calculateSlabTax(amount: number, taxEntries: TaxEntry[]): { amount: number; rate: number } {
  let totalTax = 0
  let appliedRate = 0

  const sortedEntries = [...taxEntries].sort((a, b) => a.amount_from - b.amount_from)

  for (const entry of sortedEntries) {
    if (amount >= entry.amount_from && amount <= entry.amount_to) {
      if (entry.tax_category?.toLowerCase() === 'percentage') {
        totalTax += (amount * entry.amount_or_percentage) / 100
        appliedRate = entry.amount_or_percentage
      } else if (entry.tax_category?.toLowerCase() === 'fixed') {
        totalTax += entry.amount_or_percentage
        appliedRate = entry.amount_or_percentage
      }
      break
    }
  }

  return {
    amount: Math.round(totalTax * 100) / 100,
    rate: appliedRate
  }
}

export function calculateTaxes(
  subtotal: number,
  taxationDetails: TaxationDetail[]
): TaxCalculationResult[] {
  const results: TaxCalculationResult[] = []

  for (const taxDetail of taxationDetails || []) {
    if (!taxDetail.status || taxDetail.deleted) {
      continue
    }

    const now = new Date()
    const fromDate = new Date(taxDetail.from_date)
    const toDate = new Date(taxDetail.to_date)

    if (now < fromDate || now > toDate) {
      continue
    }

    let taxAmount = 0
    let taxRate = taxDetail.amount_or_percentage
    let type = 'percentage'

    if (taxDetail.tax_type === 'slab' && taxDetail.tax_entries && taxDetail.tax_entries.length > 0) {
      const slabResult = calculateSlabTax(subtotal, taxDetail.tax_entries)
      taxAmount = slabResult.amount
      taxRate = slabResult.rate
      const appliedSlabEntry = taxDetail.tax_entries.find(entry => subtotal >= entry.amount_from && subtotal <= entry.amount_to)
      type = appliedSlabEntry?.tax_category?.toLowerCase() === 'fixed' ? 'fixed' : 'percentage'
    } else if (taxDetail.tax_type?.toLowerCase() === 'percentage' || taxDetail.tax_category?.toLowerCase() === 'percentage') {
      taxAmount = (subtotal * taxDetail.amount_or_percentage) / 100
      type = 'percentage'
    } else if (taxDetail.tax_type?.toLowerCase() === 'fixed' || taxDetail.tax_category?.toLowerCase() === 'fixed') {
      taxAmount = taxDetail.amount_or_percentage
      type = 'fixed'
    }

    results.push({
      name: taxDetail.name,
      rate: taxRate,
      amount: Math.round(taxAmount * 100) / 100,
      type: type
    })
  }

  return results
}

export function calculateDeductions(
  subtotal: number,
  deductionDetails: DeductionDetail[]
): TaxCalculationResult[] {
  const results: TaxCalculationResult[] = []

  for (const deduction of deductionDetails || []) {
    if (deduction.deleted) {
      continue
    }

    let deductionAmount = 0
    const taxType = deduction.tax_type?.toLowerCase()
    const isPercentage = taxType === 'percentage'
    const isFixed = taxType === 'fixed'

    if (isPercentage) {
      deductionAmount = (subtotal * deduction.amount_or_percentage) / 100
    } else if (isFixed) {
      deductionAmount = deduction.amount_or_percentage
    } else {
      deductionAmount = (subtotal * deduction.amount_or_percentage) / 100
    }

    results.push({
      name: deduction.name,
      rate: deduction.amount_or_percentage,
      amount: Math.round(deductionAmount * 100) / 100,
      type: isFixed ? 'fixed' : 'percentage'
    })
  }

  return results
}

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
