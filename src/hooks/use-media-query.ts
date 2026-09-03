import { useState, useEffect } from "react"

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false)

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = window.matchMedia(query)
    setValue(result.matches)

    if (result.addEventListener) {
      result.addEventListener("change", onChange)
      return () => result.removeEventListener("change", onChange)
    } else {
      result.addListener(onChange)
      return () => result.removeListener(onChange)
    }
  }, [query])

  return value
}
