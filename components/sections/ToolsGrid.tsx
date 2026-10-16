import Image from 'next/image';

import GradientText from '@/components/ui/GradientText';
import ToolEmblem from './ToolEmblem';
import ToolTile from './ToolTile';
import type { ToolItem } from '@/types/content';

export default function ToolsGrid({ items }: { items: ToolItem[] }) {
  return (
    <section
      id="tools"
      aria-labelledby="tools-heading"
      className="relative w-full overflow-hidden rounded-[16px] bg-[var(--color-bg)]"
    >
      {/* ── Mobile / tablet backdrop ─────────────────────────────────────
          The 393px frame's 100px grid, with the three Rectangle 6/7/8 fades
          washing its edges out. Desktop (the 1920px frame) has no backdrop,
          so the whole layer is dropped at `lg`. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 lg:hidden">
        <div className="tools-grid tools-grid-top" />
        <div className="tools-grid tools-grid-bottom" />
        <div className="tools-fade tools-fade-top" />
        <div className="tools-fade tools-fade-mid" />
        <div className="tools-fade tools-fade-bottom" />
      </div>

      <div
        className="relative mx-auto flex w-full flex-col items-center"
        style={{
          maxWidth: 'var(--container-max)',
          paddingInline: 'var(--gutter)',
        }}
      >
        {/* Eyebrow */}
        <span className="tools-eyebrow inline-flex items-center justify-center rounded-[8px] border border-[rgba(224,224,224,0.1)] bg-[#0d0d0d] text-center font-semibold whitespace-nowrap text-[var(--color-text)]">
          What I Work With
        </span>

        {/* Heading */}
        <h2
          id="tools-heading"
          className="tools-heading m-0 font-display text-center font-medium text-[var(--color-text)]"
        >
          Tools
        </h2>

        {/* Subtitle — desktop split (gradient through "handoff"). */}
        <p className="tools-copy m-0 hidden text-center lg:block">
          <GradientText className="font-semibold capitalize">
            From Research to wireframes to developer handoff
          </GradientText>
          <br />
          <span className="font-semibold capitalize text-[#b0b0b0] opacity-30">
            the tools behind every project.
          </span>
        </p>

        {/* Subtitle — the mobile frame re-splits the same sentence into three
            20px rows; the fade now starts after "wireframes". */}
        <p className="tools-copy tools-copy-mobile m-0 text-center lg:hidden">
          <GradientText className="tools-mobile-line font-semibold capitalize">
            From Research to wireframes
          </GradientText>
          <span className="tools-mobile-line font-semibold capitalize text-[#b0b0b0] opacity-25">
            to developer handoff the tools
          </span>
          <span className="tools-mobile-line font-semibold capitalize text-[#b0b0b0] opacity-25">
            behind every project.
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

          {/* Emblem (Figma 1:388 / 95621) */}
          <ToolEmblem
            unit="--fig"
            style={{
              left: 'calc(586 * var(--fig))',
              top: 'calc(106 * var(--fig))',
            }}
          />

          {/* Tile constellation */}
          <ul className="m-0 list-none p-0">
            {items.map((tool) => (
              <ToolTile key={tool._id} tool={tool} />
            ))}
          </ul>
        </div>

        {/* ── Constellation (phone + tablet) ──────────────────────────────
            The 393px frame's 345 x 1005 plot: the same two Vector 469/470
            curves turned 90°, the hub at the plot's centre and the tiles at
            Figma's mobile offsets. Sized by `--tools-u`. */}
        <div className="tools-network-mobile relative lg:hidden">
          <Image
            src="/svg/tools-curve-left.svg"
            alt=""
            aria-hidden
            width={491}
            height={340}
            className="tools-curve tools-curve-a"
          />
          <Image
            src="/svg/tools-curve-left.svg"
            alt=""
            aria-hidden
            width={491}
            height={340}
            className="tools-curve tools-curve-b"
          />

          <ToolEmblem
            unit="--tools-u"
            scale={0.7109276}
            className="tools-hub-mobile"
          />

          <ul className="m-0 list-none p-0">
            {items.map((tool) => (
              <ToolTile key={tool._id} tool={tool} variant="mobile" />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
