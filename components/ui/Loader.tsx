'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Full-screen preloader matching Loader.png / Loader_2.png:
 * a dark radial-gradient backdrop, a soft glowing ring, and the
 * "AP" monogram centered inside a darker inner circle.
 *
 * COLOR ANIMATION: everything driven by the CSS custom properties
 * below (--ring-glow, --badge-from, --badge-to). When you send the
 * exact color-shift you want (e.g. glow cycling white -> grey -> white,
 * or a colored accent pulse), only this file needs to change —
 * update the `pulse` keyframes / the variables, nothing else in the
 * app depends on this component's internals.
 */
export default function Loader({ onFinish }: { onFinish?: () => void }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setHidden(true);
      onFinish?.();
    }, 2200); // total loader duration before reveal
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* faint background grid, matches rest of site */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(208,208,208,0.05) 0px, rgba(208,208,208,0.05) 1px, transparent 1px, transparent 220px),' +
                'repeating-linear-gradient(0deg, rgba(208,208,208,0.05) 0px, rgba(208,208,208,0.05) 1px, transparent 1px, transparent 220px)',
            }}
          />

          <motion.div
            className="relative flex h-[200px] w-[200px] items-center justify-center rounded-full"
            style={
              {
                '--ring-glow': 'rgba(255,255,255,0.15)',
                '--badge-from': '#131313',
                '--badge-to': '#2C2C2C',
              } as React.CSSProperties
            }
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* outer glow ring */}
            <span
              className="absolute inset-0 rounded-full animate-loaderGlow"
              style={{ boxShadow: '0 0 60px 10px var(--ring-glow)' }}
            />
            {/* inner dark badge */}
            <span
              className="relative flex h-[170px] w-[170px] items-center justify-center rounded-full border border-white/5"
              style={{ background: 'linear-gradient(180deg, var(--badge-from) 0%, var(--badge-to) 100%)' }}
            >
              <span className="font-display text-[40px] italic tracking-tight text-white">AP</span>
            </span>
          </motion.div>

          <style jsx global>{`
            @keyframes loaderGlow {
              0%, 100% { opacity: 0.6; }
              50% { opacity: 1; }
            }
            .animate-loaderGlow {
              animation: loaderGlow 1.8s ease-in-out infinite;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
