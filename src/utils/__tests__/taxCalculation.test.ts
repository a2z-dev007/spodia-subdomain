/**
 * Tax Calculation Utility Tests
 * 
 * These tests verify the tax and deduction calculation logic
 */

import { calculateTaxes, calculateDeductions, calculateFinalAmount, TaxationDetail, DeductionDetail } from '../taxCalculation'

describe('Tax Calculation Utility', () => {
  // Sample taxation details (GST with slab)
  const gstTaxationDetails: TaxationDetail[] = [
    {
      id: 6,
      country: 101,
      country_name: 'India',
      name: 'GST',
      code: 'B',
      tax_type: 'slab',
      tax_category: null,
      amount_or_percentage: 0,
      from_date: '2025-01-01',
      to_date: '2028-12-31',
      sac_code: '99654',
      tax_entries: [
        {
          id: 6,
          tax: 6,
          tax_category: 'percentage', // Check tax_category inside tax_entry
          amount_or_percentage: 12,
          amount_from: 0,
          amount_to: 7500
        },
        {
          id: 7,
          tax: 6,
          tax_category: 'percentage', // Check tax_category inside tax_entry
          amount_or_percentage: 18,
          amount_from: 7501,
          amount_to: 999999
        }
      ],
      status: true,
      status_remark: '',
      created: '2025-08-18T11:41:31.168064Z',
      deleted: false,
      created_by: 2,
      full_name: 'Admin Admin'
    }
  ]

  // Sample deduction details (Service Charge)
  const serviceChargeDeductions: DeductionDetail[] = [
    {
      id: 10,
      name: 'Service Charge',
      country: 101,
      country_name: 'India',
      code: 'D',
      tax_type: 'Percentage',
      amount_or_percentage: 4,
      applicable_for: 'User',
      created: '2025-08-17T17:48:58.727966Z',
      deleted: false,
      created_by: 2,
      full_name: 'Admin Admin'
    }
  ]

  describe('calculateTaxes', () => {
    it('should calculate 12% GST for amount under 7500', () => {
      const result = calculateTaxes(5000, gstTaxationDetails)
      
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('GST')
      expect(result[0].amount).toBe(600) // 5000 * 12% = 600
    })

    it('should calculate 18% GST for amount over 7500', () => {
      const result = calculateTaxes(10000, gstTaxationDetails)
      
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('GST')
      expect(result[0].amount).toBe(1800) // 10000 * 18% = 1800
    })

    it('should return empty array for inactive tax', () => {
      const inactiveTax = [{
        ...gstTaxationDetails[0],
        status: false
      }]
      
      const result = calculateTaxes(5000, inactiveTax)
      expect(result).toHaveLength(0)
    })

    it('should return empty array for deleted tax', () => {
      const deletedTax = [{
        ...gstTaxationDetails[0],
        deleted: true
      }]
      
      const result = calculateTaxes(5000, deletedTax)
      expect(result).toHaveLength(0)
    })

    it('should handle fixed amount in slab tax_entry', () => {
      const fixedSlabTax: TaxationDetail[] = [{
        ...gstTaxationDetails[0],
        tax_entries: [
          {
            id: 8,
            tax: 6,
            tax_category: 'fixed', // Fixed amount in slab
            amount_or_percentage: 500,
            amount_from: 0,
            amount_to: 7500
          },
          {
            id: 9,
            tax: 6,
            tax_category: 'fixed',
            amount_or_percentage: 1000,
            amount_from: 7501,
            amount_to: 999999
          }
        ]
      }]
      
      // For ₹5,000 (first slab)
      const result1 = calculateTaxes(5000, fixedSlabTax)
      expect(result1[0].amount).toBe(500)
      
      // For ₹10,000 (second slab)
      const result2 = calculateTaxes(10000, fixedSlabTax)
      expect(result2[0].amount).toBe(1000)
    })
  })

  describe('calculateDeductions', () => {
    it('should calculate 4% service charge', () => {
      const result = calculateDeductions(10000, serviceChargeDeductions)
      
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Service Charge')
      expect(result[0].amount).toBe(400) // 10000 * 4% = 400
    })

    it('should return empty array for deleted deduction', () => {
      const deletedDeduction = [{
        ...serviceChargeDeductions[0],
        deleted: true
      }]
      
      const result = calculateDeductions(10000, deletedDeduction)
      expect(result).toHaveLength(0)
    })

    it('should handle fixed amount deduction', () => {
      const fixedDeduction: DeductionDetail[] = [{
        ...serviceChargeDeductions[0],
        tax_type: 'Fixed',
        amount_or_percentage: 500
      }]
      
      const result = calculateDeductions(10000, fixedDeduction)
      
      expect(result).toHaveLength(1)
      expect(result[0].amount).toBe(500)
    })
  })

  describe('calculateFinalAmount', () => {
    it('should calculate final amount with GST and service charge', () => {
      const result = calculateFinalAmount(10000, gstTaxationDetails, serviceChargeDeductions)
      
      expect(result.subtotal).toBe(10000)
      expect(result.taxes).toHaveLength(1)
      expect(result.taxes[0].amount).toBe(1800) // 18% GST
      expect(result.deductions).toHaveLength(1)
      expect(result.deductions[0].amount).toBe(400) // 4% Service Charge
      expect(result.totalTax).toBe(1800)
      expect(result.totalDeductions).toBe(400)
      expect(result.finalAmount).toBe(12200) // 10000 + 1800 + 400
    })

    it('should handle empty taxation and deduction details', () => {
      const result = calculateFinalAmount(10000, [], [])
      
      expect(result.subtotal).toBe(10000)
      expect(result.taxes).toHaveLength(0)
      expect(result.deductions).toHaveLength(0)
      expect(result.totalTax).toBe(0)
      expect(result.totalDeductions).toBe(0)
      expect(result.finalAmount).toBe(10000)
    })

    it('should round amounts to 2 decimal places', () => {
      const result = calculateFinalAmount(10333.33, gstTaxationDetails, serviceChargeDeductions)
      
      // All amounts should be rounded to 2 decimal places
      expect(result.subtotal).toBe(10333.33)
      expect(Number.isInteger(result.totalTax * 100)).toBe(true) // Check if rounded to 2 decimals
      expect(Number.isInteger(result.totalDeductions * 100)).toBe(true)
      expect(Number.isInteger(result.finalAmount * 100)).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero amount', () => {
      const result = calculateFinalAmount(0, gstTaxationDetails, serviceChargeDeductions)
      
      expect(result.subtotal).toBe(0)
      expect(result.finalAmount).toBe(0)
    })

    it('should handle negative amount gracefully', () => {
      const result = calculateFinalAmount(-1000, gstTaxationDetails, serviceChargeDeductions)
      
      // Should still calculate, but with negative values
      expect(result.subtotal).toBe(-1000)
      expect(result.finalAmount).toBeLessThan(0)
    })

    it('should handle very large amounts', () => {
      const result = calculateFinalAmount(1000000, gstTaxationDetails, serviceChargeDeductions)
      
      expect(result.subtotal).toBe(1000000)
      expect(result.taxes[0].amount).toBe(180000) // 18% GST
      expect(result.deductions[0].amount).toBe(40000) // 4% Service Charge
      expect(result.finalAmount).toBe(1220000)
    })
  })
})
