import Link from 'next/link';
import { clsx } from 'clsx';

type Variant = 'primary' | 'ghost' | 'icon';

/**
 * variant="primary" -> the white radial-gradient pill button (Download Resume, Contact Us)
 * variant="ghost"    -> dark tag-style pill button (nav underline items, "Recent Work" tag)
 * variant="icon"     -> circular icon-only button (LinkedIn, socials)
 */
export default function Button({
  href,
  onClick,
  variant = 'primary',
  children,
  className,
  type = 'button',
}: {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
}) {
  const base = 'inline-flex items-center justify-center transition-transform active:scale-95';
  const styles: Record<Variant, string> = {
    primary:
      'rounded-pill bg-btn-gradient px-6 py-3 text-[16px] font-medium text-[#010101] shadow-glow hover:scale-[1.02]',
    ghost:
      'rounded-card border border-stroke bg-surface px-4 py-2.5 text-label text-heading hover:bg-white/5',
    icon: 'h-12 w-12 rounded-full bg-btn-gradient shadow-glow hover:scale-[1.05]',
  };

  const classes = clsx(base, styles[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
