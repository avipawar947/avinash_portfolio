import Image from 'next/image';

const AP_LOGO_WIDTH = 118;
const AP_LOGO_HEIGHT = 98;

/**
 * The stacked-plate hub at the centre of the tools network (Figma 1:388 /
 * 95621). `unit` is the design-pixel CSS variable of the canvas in use —
 * `--fig` on the 1920px frame, `--tools-u` on the 393px mobile one — and
 * `scale` is the factor the desktop plate sizes are multiplied by on that
 * canvas. The mobile frame's hub is simply the desktop hub at 0.710928:
 * 244 → 173.47, 16px radius → 11.37, the three glows 60/40/20 → 42.66/28.44/
 * 14.22 — so one set of numbers drives both canvases.
 */
export default function ToolEmblem({
  unit,
  scale = 1,
  className,
  style,
}: {
  unit: string;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const size = (design: number) =>
    `calc(${+(design * scale).toFixed(5)} * var(${unit}))`;

  return (
    <div
      aria-hidden
      className={`absolute grid place-items-center${className ? ` ${className}` : ''}`}
      style={{ width: size(244), height: size(244), ...style }}
    >
      {/* Layer 1 — 244 x 244, semi-transparent gradient + glow shadow */}
      <div
        className="absolute"
        style={{
          width: size(244),
          height: size(244),
          borderRadius: size(16),
          backgroundImage:
            'linear-gradient(180deg, rgba(19,19,19,0.2) 0%, rgba(44,44,44,0.2) 100%)',
          border: `${size(1)} solid rgba(255,255,255,0.04)`,
          boxShadow: `0 0 ${size(60)} ${size(1)} rgba(255,255,255,0.08)`,
        }}
      />
      {/* Layer 2 — 204 x 208, semi-transparent gradient + medium glow */}
      <div
        className="absolute"
        style={{
          width: size(204),
          height: size(208),
          borderRadius: size(16),
          backgroundImage:
            'linear-gradient(180deg, rgba(19,19,19,0.2) 0%, rgba(44,44,44,0.2) 100%)',
          border: `${size(1)} solid rgba(255,255,255,0.04)`,
          boxShadow: `0 0 ${size(40)} ${size(1)} rgba(255,255,255,0.05)`,
        }}
      />
      {/* Layer 3 — 168 x 172, opaque gradient + tight glow */}
      <div
        className="absolute grid place-items-center"
        style={{
          width: size(168),
          height: size(172),
          borderRadius: size(16),
          backgroundImage: 'linear-gradient(180deg, #131313 0%, #2C2C2C 100%)',
          border: `${size(1)} solid rgba(255,255,255,0.04)`,
          boxShadow: `0 0 ${size(20)} ${size(1)} rgba(255,255,255,0.04)`,
        }}
      >
        {/* AP monogram — same as navbar logo, scaled from Figma 118x98.
            Avoid `fill` (known black-box bug); use explicit dims. */}
        <Image
          src="/brand/ap-logo.png"
          alt=""
          width={236}
          height={200}
          className="relative"
          style={{
            width: size(AP_LOGO_WIDTH),
            height: size(AP_LOGO_HEIGHT),
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
}
