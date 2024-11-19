'use client';

import { useState, useEffect } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

export const useBreakPoints = () => {
  const config = resolveConfig(tailwindConfig);
  const breakpoints = config.theme.screens;

  const breakpointsNumber = Object.fromEntries(
    Object.entries(breakpoints).map(([key, value]) => [
      key,
      parseInt(value, 10),
    ]),
  );

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isGreaterThanSm: windowWidth >= breakpointsNumber.sm,
    isGreaterThanMd: windowWidth >= breakpointsNumber.md,
    isGreaterThanLg: windowWidth >= breakpointsNumber.lg,
    isGreaterThanXl: windowWidth >= breakpointsNumber.xl,
    isGreaterThan2Xl: windowWidth >= breakpointsNumber['2xl'],
    isLessThanSm: windowWidth < breakpointsNumber.sm,
    isSmOrLess: windowWidth < breakpointsNumber.md,
    isMdOrLess: windowWidth < breakpointsNumber.lg,
    isLgOrLess: windowWidth < breakpointsNumber.xl,
    isXlOrLess: windowWidth < breakpointsNumber['2xl'],
  };
};
