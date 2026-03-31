/**
 * Throttle function to limit how often a function can be called
 * @param func - The function to throttle
 * @param delay - The delay in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastRan: number = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();

    if (lastRan && now < lastRan + delay) {
      // If we're within the throttle period, clear any pending timeout
      // and schedule a new one to run at the end of the period
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        lastRan = Date.now();
        func.apply(this, args);
      }, delay - (now - lastRan));
    } else {
      // If we're outside the throttle period, run immediately
      lastRan = now;
      func.apply(this, args);
    }
  };
}

/**
 * Debounce function to delay execution until after a period of inactivity
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
