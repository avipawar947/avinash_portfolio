import Image from "next/image";

import GradientText from "@/components/ui/GradientText";

/**
 * "domains worked across" — Figma node 1:328.
 *
 * 530 x 167, radius 8, same vertical rgba(19,19,19,0.8) →
 * rgba(44,44,44,0.8) fill as the figure cards. Four domain labels on one
 * row at 20px Bold, separated by three 10px gradient dots.
 *
 * Sized in `cqw` of the card (app/globals.css) so the row scales with it;
 * the list wraps once the labels can no longer fit on one line.
 */
export default function DomainsCard({ domains }: { domains: string[] }) {
  return (
    <div className="why-card why-card-domains">
      <div className="why-domains-inner">
        <GradientText as="p" className="why-card-label">
          domains worked across
        </GradientText>

        <ul className="why-domains-list">
          {domains.map((domain, index) => (
            <li key={domain} className="why-domains-item">
              <GradientText className="why-domain">{domain}</GradientText>
              {index < domains.length - 1 && (
                <Image
                  src="/svg/dot.svg"
                  alt=""
                  aria-hidden="true"
                  width={10}
                  height={10}
                  className="why-domain-dot"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
