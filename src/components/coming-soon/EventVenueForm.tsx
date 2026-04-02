'use client'

import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { FormField, SelectInput, inputClass } from './FormField'
import { SubmitButton } from './SubmitButton'

const getEventVenueSchema = (today: string) =>
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
    eventType: z.string().min(1, 'Please select an event type'),
    date: z
      .string()
      .min(1, 'Please select an event date')
      .refine((d) => d >= today, { message: 'Date cannot be in the past' }),
    city: z
      .string()
      .min(2, 'City name must be at least 2 characters')
      .max(60, 'City name is too long'),
    guests: z
      .string()
      .optional()
      .refine((v) => !v || /^\d+$/.test(v), { message: 'Must be a number' })
      .refine((v) => !v || parseInt(v) >= 1, { message: 'At least 1 guest' })
      .refine((v) => !v || parseInt(v) <= 10000, { message: 'Max 10,000 guests' }),
    budget: z.string().max(50, 'Too long').optional(),
    catering: z.string().optional(),
    requirements: z.string().max(500, 'Max 500 characters').optional(),
  })

type EventVenueFormData = z.infer<ReturnType<typeof getEventVenueSchema>>

export const EventVenueForm: React.FC = () => {
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const eventVenueSchema = useMemo(() => getEventVenueSchema(today), [today])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventVenueFormData>({
    resolver: zodResolver(eventVenueSchema),
    mode: 'onTouched',
  })

  const onSubmit = async (data: EventVenueFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Event venue inquiry submitted:', data)
    toast.success('Your event inquiry has been sent! We will contact you with the best options.')
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

        <FormField label="Event Type" required error={errors.eventType}>
          <SelectInput
            {...register('eventType')}
            hasError={!!errors.eventType}
            options={['Wedding', 'Corporate', 'Birthday', 'Other']}
            placeholder="Select event type"
          />
        </FormField>

        <FormField label="Event Date" required error={errors.date}>
          <input
            {...register('date')}
            type="date"
            min={today}
            className={inputClass(!!errors.date)}
          />
        </FormField>

        <FormField label="City" required error={errors.city}>
          <input
            {...register('city')}
            type="text"
            placeholder="Event location / city"
            className={inputClass(!!errors.city)}
          />
        </FormField>

        <FormField label="Expected Guest Count" error={errors.guests}>
          <input
            {...register('guests')}
            type="text"
            placeholder="Total number of guests"
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

        <FormField label="Catering Required?" error={errors.catering}>
          <SelectInput
            {...register('catering')}
            hasError={!!errors.catering}
            options={['Yes', 'No']}
            placeholder="Select an option"
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Additional Requirements" error={errors.requirements}>
            <textarea
              {...register('requirements')}
              rows={3}
              placeholder="Tell us more about your event"
              className={inputClass(!!errors.requirements)}
            />
          </FormField>
        </div>
      </div>

      <SubmitButton isSubmitting={isSubmitting} label="👉 Get Venue Assistance" accentColor="blue" />
      <p className="text-center text-xs text-gray-400">Secure connection. We respect your privacy.</p>
    </form>
  )
}
