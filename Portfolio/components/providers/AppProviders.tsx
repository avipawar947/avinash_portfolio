"use client";

import { type ReactNode } from "react";

import { CustomCursor } from "@/components/CustomCursor";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

/**
 * Single client boundary for the app.
 *
 * Keeping the providers in one "use client" island means `layout.tsx`
 * and every section that does not need interactivity stay server
 * components.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      {children}
      <CustomCursor />
    </SmoothScrollProvider>
  );
}
