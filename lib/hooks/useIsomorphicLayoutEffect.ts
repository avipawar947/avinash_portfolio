"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 *
 * GSAP setup must run before paint or the element is visible for one
 * frame in its un-animated state, which reads as a flash. Plain
 * `useLayoutEffect` warns during SSR, so it is swapped out there — the
 * effect never runs on the server anyway.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;