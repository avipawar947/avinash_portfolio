import Image from "next/image";

import GradientText from "@/components/ui/GradientText";

/**
 * "domains worked across" — Figma node 1:328.
 *
 * 530 x 167, radius 8, same vertical rgba(19,19,19,0.8) →
 * rgba(44,44,44,0.8) fill as the figure cards. Four domain labels on one
 * row at 20px Bold, separated by 10px gradient dots.
 *
 * The row is drawn twice and the track translates by exactly one copy's
 * width (`-50%`), so the loop is seamless at any card width. The trailing
 * dot on every copy — plus its matching gap — keeps the rhythm identical
 * across the seam. Sized in `cqw` of the card (app/globals.css).
 */
export default function DomainsCard({ domains }: { domains: string[] }) {
  const DomainList = ({ ariaHidden }: { ariaHidden?: boolean }) => (
    <ul aria-hidden={ariaHidden} className="why-domains-list">
      {domains.map((domain) => (
        <li key={domain} className="why-domains-item">
          <GradientText className="why-domain">{domain}</GradientText>
          <Image
            src="/svg/dot.svg"
            alt=""
            aria-hidden="true"
            width={10}
            height={10}
            className="why-domain-dot"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="why-card why-card-domains">
      <div className="why-domains-inner">
        <GradientText as="p" className="why-card-label">
          domains worked across
        </GradientText>

        <div className="why-domains-viewport">
          <div className="why-domains-track">
            <DomainList />
            {/* Second copy exists only to make the loop seamless. */}
            <DomainList ariaHidden />
          </div>
        </div>
      </div>
    </div>
  );
}
