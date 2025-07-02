import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current viewport is mobile-sized
 * @param breakpoint The width in pixels below which the view is considered mobile
 */
export default function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}

