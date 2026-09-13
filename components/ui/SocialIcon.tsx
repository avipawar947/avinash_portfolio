import Link from 'next/link';

const paths: Record<string, string> = {
  linkedin:
    'M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4V21H3V8.98zM9 8.98h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97V21H9V8.98z',
  behance:
    'M22 7h-6V5h6v2zM8.6 12.1c1.2-.6 1.9-1.6 1.9-3 0-2.5-1.9-3.6-4.4-3.6H0v14h6.4c2.7 0 5-1.2 5-4 0-1.8-1-3-2.8-3.4zM3.3 8.1h2.6c1 0 1.9.3 1.9 1.5 0 1.1-.7 1.6-1.8 1.6H3.3V8.1zm3 8.4H3.3v-3.6h3.1c1.3 0 2.1.6 2.1 1.8 0 1.3-1 1.8-2.2 1.8zM24 14.4c0-3-1.7-5.4-4.9-5.4-3.1 0-5.2 2.3-5.2 5.4 0 3.2 2 5.4 5.3 5.4 2.4 0 4.1-1.1 4.7-3.3h-2.6c-.2.7-1 1.1-2 1.1-1.5 0-2.3-.9-2.4-2.4h7c0-.3.1-.5.1-.8zm-7-1.3c.2-1.3 1-2.1 2.2-2.1 1.3 0 2 .8 2.1 2.1h-4.3z',
  gmail:
    'M22 5.5v13a1.5 1.5 0 01-1.5 1.5H19v-9.4l-7 4.9-7-4.9V20H3.5A1.5 1.5 0 012 18.5v-13A1.5 1.5 0 013.5 4h.7l7.8 5.6L19.8 4h.7A1.5 1.5 0 0122 5.5z',
  twitter:
    'M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.3 1.7-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 00-7 3.7A11.7 11.7 0 013 4.9a4.1 4.1 0 001.3 5.5c-.6 0-1.2-.2-1.8-.5v.1c0 2 1.4 3.6 3.3 4a4.2 4.2 0 01-1.9.1 4.1 4.1 0 003.9 2.9A8.3 8.3 0 012 18.6a11.7 11.7 0 006.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.3z',
};

/** Circular social icon button, used in Navbar / Contact CTA / Footer. */
export default function SocialIcon({
  platform,
  url,
  className = '',
}: {
  platform: keyof typeof paths;
  url: string;
  className?: string;
}) {
  const d = paths[platform];
  if (!d) return null;
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-btn-gradient shadow-glow transition-transform hover:scale-105 ${className}`}
      aria-label={platform}
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[19px] fill-[#010101]">
        <path d={d} />
      </svg>
    </Link>
  );
}
