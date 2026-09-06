"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to dynamically measure header element height and set --header-height CSS variable.
 * @param selector CSS selector for the header element (default: 'header')
 * @returns Current numeric header height in pixels
 */
export function useHeaderHeight(selector: string = "header"): number {
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  useEffect(() => {
    let headerEl: HTMLElement | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const updateHeight = () => {
      headerEl = document.querySelector<HTMLElement>(selector);
      if (headerEl) {
        const height = headerEl.offsetHeight;
        if (height > 0) {
          setHeaderHeight((prev) => (prev !== height ? height : prev));
          document.documentElement.style.setProperty(
            "--header-height",
            `${height}px`
          );
        }
      }
    };

    updateHeight();

    headerEl = document.querySelector<HTMLElement>(selector);
    if (headerEl && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateHeight();
      });
      resizeObserver.observe(headerEl);
    }

    window.addEventListener("resize", updateHeight, { passive: true });
    window.addEventListener("scroll", updateHeight, { passive: true });

    const timer = setTimeout(updateHeight, 350);

    return () => {
      if (resizeObserver && headerEl) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("scroll", updateHeight);
      clearTimeout(timer);
    };
  }, [selector]);

  return headerHeight;
}

export default useHeaderHeight;
