"use client"

import * as React from "react"
import PhoneInput, { CountryData } from "react-country-phone-input"
import "react-country-phone-input/lib/style.css"
import "./phone-input.css"
import { cn } from "@/lib/utils"

export interface PhoneMeta {
  /** Dial code without "+", e.g. "91" */
  dialCode: string
  /** ISO2 country code, e.g. "in" */
  iso2: string
  /** Dial code + national number, digits only */
  fullNumber: string
  /** Formatted display value, e.g. "+91 70719-67998" */
  formatted: string
}

export interface PhoneNumberInputProps {
  /** National number digits only (without dial code) */
  value: string
  /** Dial code without "+", e.g. "91". Defaults to India. */
  countryCode?: string
  onChange: (phone: string, meta: PhoneMeta) => void
  /** Receives the initial or externally synchronized full number. */
  onMount?: (meta: PhoneMeta) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  error?: boolean
  valid?: boolean
  /** "dark" for glass/dark forms (e.g. list-property hero) */
  variant?: "light" | "dark"
  /** Input height */
  size?: "sm" | "md" | "lg"
  placeholder?: string
  disabled?: boolean
  name?: string
  id?: string
  required?: boolean
  autoFocus?: boolean
  className?: string
  /** ISO2 of the initially selected country when no value is set */
  defaultCountry?: string
}

const HEIGHTS: Record<NonNullable<PhoneNumberInputProps["size"]>, string> = {
  sm: "2.5rem", // h-10
  md: "2.75rem", // h-11
  lg: "3rem", // h-12
}

const DEFAULT_DIAL_CODE = "91"

/**
 * Reusable mobile number input with a searchable country picker,
 * styled to match the Spodia design system.
 */
const PhoneNumberInput = ({
  value,
  countryCode,
  onChange,
  onMount,
  onBlur,
  error,
  valid,
  variant = "light",
  size = "lg",
  placeholder = "Enter mobile number",
  disabled,
  name,
  id,
  required,
  autoFocus,
  className,
  defaultCountry = "in",
}: PhoneNumberInputProps) => {
  // Parents store only the national number, but the user edits the full
  // string including the dial code. Rebuilding "dial + national" on every
  // keystroke would re-insert the old prefix mid-edit and block retyping the
  // country code, so the full typed value is kept here and only re-synced
  // from props when the parent changes the value externally (reset/autofill).
  const [displayValue, setDisplayValue] = React.useState(
    () => `${countryCode || DEFAULT_DIAL_CODE}${value || ""}`
  )
  const lastEmitted = React.useRef({
    national: value || "",
    dial: countryCode || DEFAULT_DIAL_CODE,
  })
  const onMountRef = React.useRef(onMount)

  React.useEffect(() => {
    onMountRef.current?.({
      dialCode: countryCode || DEFAULT_DIAL_CODE,
      iso2: defaultCountry,
      fullNumber: displayValue,
      formatted: displayValue ? `+${displayValue}` : "",
    })
  }, [])

  React.useEffect(() => {
    const externalValue = value || ""
    const externalDial = countryCode || lastEmitted.current.dial
    if (
      externalValue !== lastEmitted.current.national ||
      externalDial !== lastEmitted.current.dial
    ) {
      const syncedValue = externalValue ? `${externalDial}${externalValue}` : ""
      lastEmitted.current = { national: externalValue, dial: externalDial }
      setDisplayValue(syncedValue)
      onMountRef.current?.({
        dialCode: externalDial,
        iso2: defaultCountry,
        fullNumber: syncedValue,
        formatted: syncedValue ? `+${syncedValue}` : "",
      })
    }
  }, [value, countryCode])

  const wrapperRef = React.useRef<HTMLDivElement>(null)

  // The country dropdown is rendered internally by the package, so tag it
  // with data-lenis-prevent whenever it mounts to stop Lenis smooth-scroll
  // from hijacking wheel/touch events while the list is open.
  React.useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const tagDropdown = () => {
      wrapper
        .querySelectorAll<HTMLElement>(".country-list")
        .forEach((list) => list.setAttribute("data-lenis-prevent", "true"))
    }

    tagDropdown()
    const observer = new MutationObserver(tagDropdown)
    observer.observe(wrapper, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  // Fallback: keep scroll events inside the open dropdown from reaching
  // the window (where Lenis listens) so the page never scrolls behind it.
  const containScroll = (event: React.UIEvent) => {
    if ((event.target as HTMLElement).closest(".country-list")) {
      event.stopPropagation()
    }
  }

  const handleChange = (
    rawValue: string,
    data: CountryData | {},
    _event: React.ChangeEvent<HTMLInputElement>,
    formatted: string
  ) => {
    const country = data as CountryData
    const dial = country?.dialCode || ""
    const national =
      dial && rawValue.startsWith(dial) ? rawValue.slice(dial.length) : rawValue
    setDisplayValue(rawValue)
    lastEmitted.current = { national, dial: dial || DEFAULT_DIAL_CODE }
    onChange(national, {
      dialCode: dial || DEFAULT_DIAL_CODE,
      iso2: country?.countryCode || "",
      fullNumber: rawValue,
      formatted,
    })
  }

  return (
    <div
      ref={wrapperRef}
      className={cn("w-full", className)}
      onWheel={containScroll}
      onTouchMove={containScroll}
    >
      <PhoneInput
        country={defaultCountry}
        value={displayValue}
        onChange={handleChange}
        onBlur={onBlur}
        enableSearch
        searchPlaceholder="search"
        searchNotFound="No countries found"
        countryCodeEditable
        alwaysDefaultMask
        defaultMask="..............."
        disabled={disabled}
        placeholder={placeholder}
        containerClass={cn(
          "spodia-phone",
          variant === "dark" && "spodia-phone--dark",
          error && "spodia-phone--error",
          valid && !error && "spodia-phone--valid"
        )}
        containerStyle={{ "--sp-phone-h": HEIGHTS[size] } as React.CSSProperties}
        inputProps={{
          name,
          id,
          required,
          autoFocus,
          autoComplete: "off",
        }}
      />
    </div>
  )
}

export default PhoneNumberInput
