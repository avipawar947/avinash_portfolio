import Image from 'next/image';

import GradientText from '@/components/ui/GradientText';
import ToolTile from './ToolTile';
import type { ToolItem } from '@/types/content';

const EMBLEM_LOGO_WIDTH = 118;
const EMBLEM_LOGO_HEIGHT = 98;

export default function ToolsGrid({ items }: { items: ToolItem[] }) {
  return (
    <section
      id="tools"
      aria-labelledby="tools-heading"
      className="relative w-full overflow-hidden rounded-[16px] bg-[var(--color-bg)]"
      style={{
        paddingTop: 'var(--section-pad)',
        paddingBottom: 'var(--section-pad)',
      }}
    >
      <div
        className="relative mx-auto flex w-full flex-col items-center"
        style={{
          maxWidth: 'var(--container-max)',
          paddingInline: 'var(--gutter)',
        }}
      >
        {/* Eyebrow */}
        <span
          className="inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]"
          style={{
            padding: 'calc(10 * var(--fig))',
            fontSize: 'max(0.75rem, calc(16 * var(--fig)))',
          }}
        >
          What I Work With
        </span>

        {/* Heading */}
        <h2
          id="tools-heading"
          className="m-0 font-display text-center font-medium text-[var(--color-text)]"
          style={{
            marginTop: 'var(--heading-gap)',
            fontSize: 'max(2.5rem, calc(160 * var(--fig)))',
            lineHeight: 1.1,
            letterSpacing: 'calc(3.2 * var(--fig))',
          }}
        >
          Tools
        </h2>

        {/* Subtitle */}
        <p
          className="m-0 text-center"
          style={{
            marginTop: 'var(--heading-gap)',
            fontSize: 'max(1rem, calc(32 * var(--fig)))',
            lineHeight: 1.75,
            letterSpacing: 'calc(0.64 * var(--fig))',
          }}
        >
          <GradientText className="font-semibold capitalize">
            From Research to wireframes to developer handoff
          </GradientText>
          <br />
          <span className="font-semibold capitalize text-[#b0b0b0] opacity-30">
            the tools behind every project.
          </span>
        </p>

        {/* ── Constellation (desktop) ───────────────────────────────────── */}
        <div
          className="relative mt-[calc(60*var(--fig))] hidden lg:block"
          style={{
            width: 'calc(1416 * var(--fig))',
            height: 'calc(485 * var(--fig))',
          }}
        >
          {/* Connector curves */}
          <Image
            src="/svg/tools-curve-left.svg"
            alt=""
            aria-hidden
            width={491}
            height={340}
            className="absolute"
            style={{
              left: 'calc(94 * var(--fig))',
              top: 'calc(51 * var(--fig))',
              width: 'calc(491 * var(--fig))',
              height: 'calc(340 * var(--fig))',
            }}
          />
          <Image
            src="/svg/tools-curve-right.svg"
            alt=""
            aria-hidden
            width={491}
            height={340}
            className="absolute scale-x-[-1]"
            style={{
              left: 'calc(830 * var(--fig))',
              top: 'calc(51 * var(--fig))',
              width: 'calc(491 * var(--fig))',
              height: 'calc(340 * var(--fig))',
            }}
          />

          {/* ── Emblem (Figma 1:388 / 95621) ────────────────────────────── */}
          <div
            aria-hidden
            className="absolute grid place-items-center"
            style={{
              left: 'calc(586 * var(--fig))',
              top: 'calc(106 * var(--fig))',
              width: 'calc(244 * var(--fig))',
              height: 'calc(244 * var(--fig))',
            }}
          >
            {/* Layer 1 — 244 x 244, semi-transparent gradient + glow shadow */}
            <div
              className="absolute rounded-[16px]"
              style={{
                width: 'calc(244 * var(--fig))',
                height: 'calc(244 * var(--fig))',
                backgroundImage:
                  'linear-gradient(180deg, rgba(19,19,19,0.2) 0%, rgba(44,44,44,0.2) 100%)',
                border: '1px solid rgba(255,255,255,0.04)',
                boxShadow: '0px 0px 60px 1px rgba(255,255,255,0.08)',
              }}
            />
            {/* Layer 2 — 204 x 208, semi-transparent gradient + medium glow */}
            <div
              className="absolute rounded-[16px]"
              style={{
                width: 'calc(204 * var(--fig))',
                height: 'calc(208 * var(--fig))',
                backgroundImage:
                  'linear-gradient(180deg, rgba(19,19,19,0.2) 0%, rgba(44,44,44,0.2) 100%)',
                border: '1px solid rgba(255,255,255,0.04)',
                boxShadow: '0px 0px 40px 1px rgba(255,255,255,0.05)',
              }}
            />
            {/* Layer 3 — 168 x 172, opaque gradient + tight glow */}
            <div
              className="absolute grid place-items-center rounded-[16px]"
              style={{
                width: 'calc(168 * var(--fig))',
                height: 'calc(172 * var(--fig))',
                backgroundImage:
                  'linear-gradient(180deg, #131313 0%, #2C2C2C 100%)',
                border: '1px solid rgba(255,255,255,0.04)',
                boxShadow: '0px 0px 20px 1px rgba(255,255,255,0.04)',
              }}
            >
              {/* AP monogram — same as navbar logo, scaled to Figma 118x98.
                  Avoid `fill` (known black-box bug); use explicit dims. */}
              <Image
                src="/brand/ap-logo.png"
                alt=""
                width={236}
                height={200}
                className="relative"
                style={{
                  width: `calc(${EMBLEM_LOGO_WIDTH} * var(--fig))`,
                  height: `calc(${EMBLEM_LOGO_HEIGHT} * var(--fig))`,
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>

          {/* Tile constellation */}
          <ul className="m-0 list-none p-0">
            {items.map((tool) => (
              <ToolTile key={tool._id} tool={tool} />
            ))}
          </ul>
        </div>

        {/* ── Narrow-screen grid ─────────────────────────────────────────── */}
        <ul className="mt-10 grid w-full max-w-md grid-cols-4 gap-3 p-0 sm:grid-cols-5 lg:hidden">
          {items.map((tool) => (
            <ToolTile key={tool._id} tool={tool} positioned={false} />
          ))}
        </ul>
      </div>
    </section>
  );
}
