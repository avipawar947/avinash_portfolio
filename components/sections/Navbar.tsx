import Image from "next/image";
import Button from "@/components/ui/Button";
import type { NavbarContent } from "@/types/content";

export default function Navbar({ content }: { content: NavbarContent }) {
  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-white/10 bg-bg/80 px-6 backdrop-blur md:px-12">
      <div className="flex items-center gap-3">
        {content.logoImageUrl ? (
          <Image src={content.logoImageUrl} alt="logo" width={40} height={40} />
        ) : (
          <div className="h-10 w-10 rounded-full bg-white/10" />
        )}
        <span className="font-display text-[16px] font-bold tracking-wide text-heading">
          {content.logoText}
        </span>
      </div>

      <nav className="hidden items-center gap-2 rounded-pill md:flex">
        {content.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="px-6 py-3 text-[16px] text-heading/90 transition hover:text-heading"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <Button
          variant="primary"
          href={content.resumeUrl || "#"}
          className="hidden md:inline-flex"
        >
          Download Resume
        </Button>
        <Button variant="icon" href="#" aria-label="menu" className="md:hidden">
          <span className="h-[2px] w-4 bg-[#010101]" />
        </Button>
      </div>
    </header>
  );
}
