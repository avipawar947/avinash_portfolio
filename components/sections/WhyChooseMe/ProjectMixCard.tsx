import Image from "next/image";

import GradientText from "@/components/ui/GradientText";

/**
 * "On Average Projects" — Figma node 1:312.
 *
 * 530 x 424, radius 8, flat #1B1B1B. A 470 x 276 plot area at (34, 80)
 * holds four bars over a vertical rule, with a horizontal axis at y=356
 * labelled 0 and 100.
 */
export default function ProjectMixCard({
  bars,
}: {
  bars: { label: string; width: number }[];
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[8px] bg-[#1b1b1b]"
      style={{ aspectRatio: "530 / 424", minHeight: "16rem" }}
    >
      <GradientText
        as="p"
        className="absolute m-0 font-semibold capitalize"
        style={{
          left: "calc(24 * var(--fig))",
          top: "calc(24 * var(--fig))",
          fontSize: "max(0.9375rem, calc(24 * var(--fig)))",
          lineHeight: 1.35,
          letterSpacing: "calc(0.48 * var(--fig))",
        }}
      >
        On Average Projects
      </GradientText>

      {/* Plot area (1:318) */}
      <div
        className="absolute"
        style={{
          left: "calc(34 * var(--fig))",
          top: "calc(80 * var(--fig))",
          width: "calc(470 * var(--fig))",
          height: "calc(276 * var(--fig))",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 h-full"
          style={{ width: "1px", backgroundColor: "rgba(208,208,208,0.2)" }}
        />

        {bars.map((bar, index) => (
          <div
            key={bar.label}
            className="absolute left-0 flex items-center overflow-hidden rounded-r-[100px]"
            style={{
              top: `calc(${24 + index * 62} * var(--fig))`,
              width: `calc(${bar.width} * var(--fig))`,
              height: "calc(42 * var(--fig))",
              paddingLeft: "calc(14 * var(--fig))",
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.1) 55.234%, rgba(176,176,176,0.01) 114.86%)",
            }}
          >
            <GradientText
              className="capitalize whitespace-nowrap"
              style={{
                fontSize: "max(0.75rem, calc(18 * var(--fig)))",
                lineHeight: 1.78,
                letterSpacing: "calc(0.36 * var(--fig))",
              }}
            >
              {bar.label}
            </GradientText>
          </div>
        ))}
      </div>

      {/* Horizontal axis (1:317) */}
      <Image
        src="/svg/axis-horizontal.svg"
        alt=""
        aria-hidden="true"
        width={448}
        height={8}
        className="absolute"
        style={{
          left: "calc(34 * var(--fig))",
          top: "calc(356 * var(--fig))",
          width: "calc(447 * var(--fig))",
          height: "auto",
        }}
      />

      {/* Axis bounds (1:314, 1:316) */}
      <span
        aria-hidden="true"
        className="absolute text-[#717171]"
        style={{
          left: "calc(36 * var(--fig))",
          top: "calc(372 * var(--fig))",
          fontSize: "max(0.6875rem, calc(18 * var(--fig)))",
          letterSpacing: "calc(0.36 * var(--fig))",
        }}
      >
        0
      </span>
      <span
        aria-hidden="true"
        className="absolute text-[#717171]"
        style={{
          left: "calc(472 * var(--fig))",
          top: "calc(372 * var(--fig))",
          fontSize: "max(0.6875rem, calc(18 * var(--fig)))",
          letterSpacing: "calc(0.36 * var(--fig))",
        }}
      >
        100
      </span>
    </div>
  );
}