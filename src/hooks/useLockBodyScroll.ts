import { useEffect } from "react"

let lockCount = 0
let savedScrollY = 0

/**
 * Prevents background page scroll while a modal/drawer is open.
 * Uses reference counting so nested modals restore scroll only when all close.
 */
export function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return

    lockCount += 1
    if (lockCount === 1) {
      savedScrollY = window.scrollY
      document.documentElement.style.setProperty("overflow", "hidden", "important")
      document.body.style.setProperty("overflow", "hidden", "important")
      document.body.style.setProperty("position", "fixed", "important")
      document.body.style.setProperty("top", `-${savedScrollY}px`, "important")
      document.body.style.setProperty("width", "100%", "important")
    }

    return () => {
      lockCount = Math.max(0, lockCount - 1)
      if (lockCount === 0) {
        document.documentElement.style.removeProperty("overflow")
        document.body.style.removeProperty("overflow")
        document.body.style.removeProperty("position")
        document.body.style.removeProperty("top")
        document.body.style.removeProperty("width")
        window.scrollTo(0, savedScrollY)
      }
    }
  }, [isLocked])
}
