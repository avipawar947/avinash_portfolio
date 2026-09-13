import Image from 'next/image';
import SocialIcon from '@/components/ui/SocialIcon';
import type { FooterContent, NavbarContent } from '@/types/content';

export default function Footer({
  footer,
  navbar,
}: {
  footer: FooterContent;
  navbar: NavbarContent;
}) {
  return (
    <footer className="relative w-full bg-[#181818] px-6 pb-10 pt-16 md:px-12">
      <div className="mx-auto max-w-canvas">
        <div className="flex items-center gap-3">
          {navbar.logoImageUrl && (
            <Image src={navbar.logoImageUrl} alt="logo" width={48} height={40} />
          )}
          <span className="font-display text-[16px] font-bold text-heading">{navbar.logoText}</span>
        </div>

        <div className="mt-8 flex flex-wrap gap-6 text-[16px] text-heading">
          {footer.roleTags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
          <span>{footer.location}</span>
        </div>

        <div className="my-10 border-t border-dashed border-white/20" />

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-[14px] text-heading">{footer.copyrightText}</p>
          <div className="flex gap-4 text-[14px] text-heading">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/cookies">Cookies</a>
          </div>
          <div className="flex gap-3">
            {footer.socialLinks.map((s) => (
              <SocialIcon key={s.platform} platform={s.platform} url={s.url} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
