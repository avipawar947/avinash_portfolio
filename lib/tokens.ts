/**
 * Single source of truth for design tokens, mirrored in tailwind.config.ts.
 * Import this in JS/TS logic (e.g. inline SVGs, canvas, motion configs)
 * where a Tailwind class isn't an option. Components should otherwise
 * prefer Tailwind utility classes over importing this directly.
 */
export const tokens = {
  colors: {
    bg: '#0B0B0B',
    surface: '#0D0D0D',
    heading: '#FFFFFF',
    bodySecondary: '#B0B0B0',
    designation: '#404040',
    cardFrom: '#131313',
    cardTo: '#2C2C2C',
    stroke: 'rgba(224,224,224,0.1)',
    line: 'rgba(208,208,208,0.05)',
  },
  fonts: {
    display: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'Inter', -apple-system, sans-serif",
  },
  type: {
    h1: { size: '160px', lineHeight: '200px', letterSpacing: '0.02em', weight: 510 },
    h2: { size: '32px', lineHeight: '56px', letterSpacing: '0.02em', weight: 590 },
    h3: { size: '20px', lineHeight: '32px', letterSpacing: '0.02em', weight: 400 },
  },
  radii: { pill: '100px', card: '8px', frame: '16px' },
} as const;
