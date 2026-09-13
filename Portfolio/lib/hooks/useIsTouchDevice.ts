"use client";

import { useSyncExternalStore } from "react";

/**
 * A device is treated as touch-first when it has no hover-capable
 * pointer. This is the signal used to disable the custom cursor and to
 * downgrade expensive pointer-driven WebGL work.
 */
const QUERY = "(hover: none), (pointer: coarse)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsTouchDevice(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
