'use client';

import { clsx } from 'clsx';

/**
 * Infinite horizontal scroller, pure CSS animation (no JS loop) for perf.
 * Duplicates children once so the loop is seamless — pass `speed` in seconds.
 */
export default function Marquee({
  children,
  speed = 30,
  gap = 140,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  gap?: number;
  className?: string;
}) {
  return (
    <div className={clsx('overflow-hidden', className)}>
      <div
        className="flex w-max items-center"
        style={{ gap, animation: `marquee ${speed}s linear infinite` }}
      >
        <div className="flex items-center" style={{ gap }}>
          {children}
        </div>
        <div className="flex items-center" style={{ gap }} aria-hidden>
          {children}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
