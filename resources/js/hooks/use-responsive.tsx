import { useEffect, useState } from 'react';

const breakpoints = {
    mobileMax: 639, // up to 639px
    tabletteMax: 767, // 640-767
    smallMax: 1023, // 768-1023
    mediumMin: 1024, // >=1024px
    largeMin: 1280, // >=1280px
    desktopMin: 1536, // >=1536px
};

export function useResponsive() {
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(() => {
        function onResize() {
            setWidth(window.innerWidth);
        }

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const isMobile = width <= breakpoints.mobileMax;
    const isTablette = width > breakpoints.mobileMax && width <= breakpoints.tabletteMax;
    const isSmall = width > breakpoints.tabletteMax && width <= breakpoints.smallMax;

    // "At least" flags
    const isMedium = width >= breakpoints.mediumMin;
    const isLarge = width >= breakpoints.largeMin;
    const isDesktop = width >= breakpoints.desktopMin;

    return {
        width,
        isMobile,
        isTablette,
        isSmall,
        isMedium,
        isLarge,
        isDesktop,
    };
}
