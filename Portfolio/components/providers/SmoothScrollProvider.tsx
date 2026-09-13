"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

import { gsap, ScrollTrigger } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type LenisRef = RefObject<Lenis | null>;

const LenisContext = createContext<LenisRef | null>(null);

/**
 * Access the live Lenis instance.
 *
 * Returns a ref rather than the instance itself: Lenis is an imperative
 * object that nothing renders from, and handing back state would
 * re-render the whole tree the moment it initialises. Read
 * `lenis.current` inside event handlers and effects.
 *
 * `current` is null before mount and whenever the user prefers reduced
 * motion, so every call site must handle null.
 */
export function useLenis(): LenisRef {
  const ref = useContext(LenisContext);
  if (!ref) {
    throw new Error("useLenis must be used within <SmoothScrollProvider>");
  }
  return ref;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Reduced-motion users get native scrolling. ScrollTrigger still
    // works; it just reads the real scroll position instead of Lenis'.
    if (prefersReducedMotion) return;

    const instance = new Lenis({
      // TODO(figma): tune against the prototype's scroll feel.
      // Kept intentionally light so input never feels laggy.
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices already have momentum scrolling; smoothing it
      // again fights the platform and feels broken.
      syncTouch: false,
    });

    lenisRef.current = instance;

    // Keep ScrollTrigger's cached positions in sync with Lenis.
    instance.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker rather than its own rAF loop, so
    // both run on one frame and cannot drift apart.
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    // lagSmoothing lets GSAP fast-forward after a dropped frame, which
    // desynchronises it from Lenis. Disable it while Lenis drives.
    gsap.ticker.lagSmoothing(0);

    // Positions measured before the smooth-scroll wrapper existed are
    // stale by one frame.
    ScrollTrigger.refresh();

    return () => {
      instance.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}
