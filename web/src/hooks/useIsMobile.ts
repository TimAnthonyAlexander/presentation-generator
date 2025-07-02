import { useEffect, useState } from 'react';
import { theme } from '../generals/theme';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < theme.breakpoints.values.md);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < theme.breakpoints.values.md && !isMobile) {
                setIsMobile(true);
            }
            if (window.innerWidth >= theme.breakpoints.values.md && isMobile) {
                setIsMobile(false);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile]);

    return isMobile;
}

export default useIsMobile;

