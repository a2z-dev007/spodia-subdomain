'use client'

import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { FormField, inputClass } from './FormField'
import { SubmitButton } from './SubmitButton'

const getRestaurantSchema = (today: string) =>
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
    preference: z.string().max(100, 'Too long').optional(),
    date: z
      .string()
      .min(1, 'Please select a reservation date')
      .refine((d) => d >= today, { message: 'Date cannot be in the past' }),
    time: z.string().min(1, 'Please select a reservation time'),
    guests: z
      .string()
      .optional()
      .refine((v) => !v || /^\d+$/.test(v), { message: 'Must be a number' })
      .refine((v) => !v || parseInt(v) >= 1, { message: 'At least 1 guest' })
      .refine((v) => !v || parseInt(v) <= 100, { message: 'Max 100 guests' }),
    occasion: z.string().max(100, 'Too long').optional(),
    requests: z.string().max(500, 'Max 500 characters').optional(),
  })

type RestaurantFormData = z.infer<ReturnType<typeof getRestaurantSchema>>

export const RestaurantForm: React.FC = () => {
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const restaurantSchema = useMemo(() => getRestaurantSchema(today), [today])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    mode: 'onTouched',
  })

  const onSubmit = async (data: RestaurantFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Restaurant inquiry submitted:', data)
    toast.success('Your table booking request has been sent! We will confirm your reservation shortly.')
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

        <FormField label="Restaurant Preference (Optional)" error={errors.preference}>
          <input
            {...register('preference')}
            type="text"
            placeholder="Name of restaurant or cuisine"
            className={inputClass(!!errors.preference)}
          />
        </FormField>

        <FormField label="Reservation Date" required error={errors.date}>
          <input
            {...register('date')}
            type="date"
            min={today}
            className={inputClass(!!errors.date)}
          />
        </FormField>

        <FormField label="Reservation Time" required error={errors.time}>
          <input
            {...register('time')}
            type="time"
            className={inputClass(!!errors.time)}
          />
        </FormField>

        <FormField label="Number of Guests" error={errors.guests}>
          <input
            {...register('guests')}
            type="text"
            placeholder="Total guests"
            className={inputClass(!!errors.guests)}
          />
        </FormField>

        <FormField label="Special Occasion?" error={errors.occasion}>
          <input
            {...register('occasion')}
            type="text"
            placeholder="e.g. Birthday, Anniversary"
            className={inputClass(!!errors.occasion)}
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Special Requests" error={errors.requests}>
            <textarea
              {...register('requests')}
              rows={3}
              placeholder="Dietary requirements or seating preference"
              className={inputClass(!!errors.requests)}
            />
          </FormField>
        </div>
      </div>

      <SubmitButton isSubmitting={isSubmitting} label="👉 Request Table Booking" accentColor="orange" />
      <p className="text-center text-xs text-gray-400">Secure connection. We respect your privacy.</p>
    </form>
  )
}
