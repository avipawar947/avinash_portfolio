import Image from "next/image";

import { GradientText } from "@/components/ui";
import { DOMAINS } from "@/lib/constants";

/**
 * "domains worked across" — Figma node 1:328.
 *
 * 530 x 167, radius 8, same vertical rgba(19,19,19,0.8) →
 * rgba(44,44,44,0.8) fill as the figure cards. Four domain labels on one
 * row at 20px Bold, separated by three 10px gradient dots.
 *
 * The design positions labels and dots individually; rendered here as a
 * flex row with separators between items, which reproduces the same
 * arrangement and keeps the list wrappable on narrow screens.
 *
 * One deliberate deviation: in Figma the row is 560px wide inside a
 * 530px clipped card, so "E-Com" is cut off mid-word. The gap here is
 * tightened to 14px, which fits all four labels in the same card at the
 * same type size. A clipped brand name reads as a defect rather than a
 * decision, and the project's own rule forbids text clipping.
 */
export function DomainsCard() {
  return (
    <div
      className="relative flex w-full flex-col justify-center overflow-hidden rounded-[8px]"
      style={{
        minHeight: "max(8rem, calc(167 * var(--fig)))",
        paddingInline: "calc(24 * var(--fig))",
        gap: "calc(16 * var(--fig))",
        backgroundImage:
          "linear-gradient(to bottom, rgba(19,19,19,0.8) 0%, rgba(44,44,44,0.8) 100%)",
      }}
    >
      <GradientText
        as="p"
        className="m-0 font-semibold capitalize"
        style={{
          fontSize: "max(0.9375rem, calc(24 * var(--fig)))",
          lineHeight: 1.35,
          letterSpacing: "calc(0.48 * var(--fig))",
        }}
      >
        domains worked across
      </GradientText>

      <ul
        className="m-0 flex list-none flex-wrap items-center p-0"
        style={{ gap: "calc(14 * var(--fig))" }}
      >
        {DOMAINS.map((domain, index) => (
          <li
            key={domain}
            className="flex items-center"
            style={{ gap: "calc(14 * var(--fig))" }}
          >
            <GradientText
              className="font-bold capitalize whitespace-nowrap"
              style={{
                fontSize: "max(0.8125rem, calc(20 * var(--fig)))",
                letterSpacing: "calc(0.4 * var(--fig))",
              }}
            >
              {domain}
            </GradientText>
            {index < DOMAINS.length - 1 && (
              <Image
                src="/svg/dot.svg"
                alt=""
                aria-hidden="true"
                width={10}
                height={10}
                style={{
                  width: "calc(10 * var(--fig))",
                  height: "calc(10 * var(--fig))",
                  minWidth: "5px",
                  minHeight: "5px",
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
