"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point for GSAP plugins.
 *
 * Importing plugins in more than one module is harmless, but registering
 * them in more than one place makes it easy to end up with a component
 * that renders before `registerPlugin` has run. Every module that needs
 * GSAP should import from here instead of from "gsap" directly.
 */
let registered = false;

if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
