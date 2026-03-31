import { useState, useEffect, useRef } from 'react';

export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame to throttle scroll events
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show buttons when scrolling up or at the top
          if (currentScrollY < lastScrollY || currentScrollY < 100) {
            setIsVisible(false);
          } 
          // Hide buttons when scrolling down
          else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(true);
          }
          
          setLastScrollY(currentScrollY);
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return isVisible;
}
