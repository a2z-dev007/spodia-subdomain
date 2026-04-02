'use client'

import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { FormField, SelectInput, inputClass } from './FormField'
import { SubmitButton } from './SubmitButton'

const getHourlyRoomSchema = (today: string) =>
  z.object({
    name: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(80, 'Name is too long')
      .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters and spaces'),
    mobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    email: z.string().email('Enter a valid email address'),
    city: z
      .string()
      .min(2, 'City name must be at least 2 characters')
      .max(60, 'City name is too long'),
    checkinDate: z
      .string()
      .min(1, 'Please select a check-in date')
      .refine((d) => d >= today, { message: 'Date cannot be in the past' }),
    checkinTime: z.string().min(1, 'Please select a check-in time'),
    duration: z.string().min(1, 'Please select a duration'),
    guests: z
      .string()
      .optional()
      .refine((v) => !v || /^\d+$/.test(v), { message: 'Must be a number' })
      .refine((v) => !v || parseInt(v) >= 1, { message: 'At least 1 guest' })
      .refine((v) => !v || parseInt(v) <= 10, { message: 'Max 10 guests' }),
    budget: z.string().max(50, 'Too long').optional(),
    requests: z.string().max(500, 'Max 500 characters').optional(),
  })

type HourlyRoomFormData = z.infer<ReturnType<typeof getHourlyRoomSchema>>

export const HourlyRoomForm: React.FC = () => {
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const hourlyRoomSchema = useMemo(() => getHourlyRoomSchema(today), [today])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HourlyRoomFormData>({
    resolver: zodResolver(hourlyRoomSchema),
    mode: 'onTouched',
  })

  const onSubmit = async (data: HourlyRoomFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Hourly room inquiry submitted:', data)
    toast.success('Your hourly stay request has been sent! We will find the best property for you.')
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <FormField label="Full Name" required error={errors.name}>
          <input
            {...register('name')}
            type="text"
            placeholder="Enter your full name"
            className={inputClass(!!errors.name)}
          />
        </FormField>

        <FormField label="Mobile Number" required error={errors.mobile}>
          <input
            {...register('mobile')}
            type="tel"
            placeholder="10-digit mobile number"
            maxLength={10}
            className={inputClass(!!errors.mobile)}
          />
        </FormField>

        <FormField label="Email Address" required error={errors.email}>
          <input
            {...register('email')}
            type="email"
            placeholder="Enter your email"
            className={inputClass(!!errors.email)}
          />
        </FormField>

        <FormField label="City" required error={errors.city}>
          <input
            {...register('city')}
            type="text"
            placeholder="Enter your city"
            className={inputClass(!!errors.city)}
          />
        </FormField>

        <FormField label="Check-in Date" required error={errors.checkinDate}>
          <input
            {...register('checkinDate')}
            type="date"
            min={today}
            className={inputClass(!!errors.checkinDate)}
          />
        </FormField>

        <FormField label="Check-in Time" required error={errors.checkinTime}>
          <input
            {...register('checkinTime')}
            type="time"
            className={inputClass(!!errors.checkinTime)}
          />
        </FormField>

        <FormField label="Duration" required error={errors.duration}>
          <SelectInput
            {...register('duration')}
            hasError={!!errors.duration}
            options={['3 Hours', '6 Hours', '12 Hours']}
            placeholder="Select duration"
          />
        </FormField>

        <FormField label="Number of Guests" error={errors.guests}>
          <input
            {...register('guests')}
            type="text"
            placeholder="Number of guests"
            className={inputClass(!!errors.guests)}
          />
        </FormField>

        <FormField label="Budget Range" error={errors.budget}>
          <input
            {...register('budget')}
            type="text"
            placeholder="Estimated budget"
            className={inputClass(!!errors.budget)}
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Special Requests" error={errors.requests}>
            <textarea
              {...register('requests')}
              rows={3}
              placeholder="Any specific requirements"
              className={inputClass(!!errors.requests)}
            />
          </FormField>
        </div>
      </div>

      <SubmitButton isSubmitting={isSubmitting} label="👉 Request Hourly Stay" accentColor="blue" />
      <p className="text-center text-xs text-gray-400">Secure connection. We respect your privacy.</p>
    </form>
  )
}
