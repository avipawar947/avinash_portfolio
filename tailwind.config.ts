import type { Config } from 'tailwindcss';

// Design tokens pulled directly from the Figma design system.
// Change values HERE and every component in the app updates —
// never hardcode a color/size in a component file.
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B0B0B',            // page background
        surface: '#0D0D0D',       // tag pill / chip fill
        heading: '#FFFFFF',       // H1 / H2 text
        body: {
          DEFAULT: '#B0B0B0',     // second line body text
          designation: '#404040', // designation / meta text
        },
        card: {
          from: '#131313',        // card gradient start
          to: '#2C2C2C',          // card gradient end
        },
        stroke: 'rgba(224,224,224,0.1)', // pill/card border
        line: 'rgba(208,208,208,0.05)',  // faint grid lines
        lineStrong: 'rgba(208,208,208,0.2)',
      },
      fontFamily: {
        // SF Pro isn't distributable — falls back to the closest system stack.
        display: ['var(--font-display)', '-apple-system', 'BlinkMacSystemFont', 'ui-sans-serif', 'sans-serif'],
        sans: ['var(--font-sans)', '-apple-system', 'ui-sans-serif', 'sans-serif'],
      },
      fontSize: {
        h1: ['160px', { lineHeight: '200px', letterSpacing: '0.02em', fontWeight: '510' }],
        h1Mobile: ['56px', { lineHeight: '64px', letterSpacing: '0.02em', fontWeight: '510' }],
        h2: ['32px', { lineHeight: '56px', letterSpacing: '0.02em', fontWeight: '590' }],
        h2Mobile: ['22px', { lineHeight: '32px', letterSpacing: '0.02em', fontWeight: '590' }],
        h3: ['20px', { lineHeight: '32px', letterSpacing: '0.02em', fontWeight: '400' }],
        body: ['18px', { lineHeight: '32px', letterSpacing: '0.02em', fontWeight: '400' }],
        label: ['16px', { lineHeight: '19px', letterSpacing: '0.02em', fontWeight: '590' }],
      },
      backgroundImage: {
        'btn-gradient': 'radial-gradient(118% 324% at 30% 6%, #FFFFFF 0%, #BDBDBD 53%, #FFFFFF 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(19,19,19,0.8) 0%, rgba(44,44,44,0.8) 100%)',
        'text-gradient': 'linear-gradient(90deg, #FFFFFF 11.74%, rgba(176,176,176,0.1) 119.96%)',
      },
      boxShadow: {
        glow: '1px 1px 40px 1px rgba(255,255,255,0.2)',
      },
      borderRadius: {
        pill: '100px',
        card: '8px',
        frame: '16px',
      },
      maxWidth: {
        canvas: '1920px',
      },
    },
  },
  plugins: [],
};

export default config;
