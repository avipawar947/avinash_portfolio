'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/animations';
import 'lenis/dist/lenis.css';

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (isAdmin) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        setLenis(null);
        if (typeof window !== 'undefined') (window as any).__lenis = null;
      }
      return;
    }

    if (lenisRef.current) return;

    const instance = new Lenis({
      autoRaf: false,
      anchors: true,
      autoToggle: true,
      lerp: 0.1,
      smoothWheel: true,
      allowNestedScroll: true,
      respectReducedMotion: true,
    });

    lenisRef.current = instance;
    setLenis(instance);
    if (typeof window !== 'undefined') (window as any).__lenis = instance;

    instance.on('scroll', () => ScrollTrigger.update());
    const tickerCb = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tickerCb);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
      if (typeof window !== 'undefined') (window as any).__lenis = null;
    };
  }, [isAdmin]);

  // Reset scroll position on client-side route changes (Next won't always
  // win the race against Lenis' animated scroll).
  useEffect(() => {
    if (!lenis) return;
    if (typeof window !== 'undefined' && window.location.hash) return;
    lenis.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
