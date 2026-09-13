import Link from 'next/link';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/navbar', label: 'Navbar' },
  { href: '/admin/hero', label: 'Hero' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/client-logos', label: 'Client Logos' },
  { href: '/admin/process', label: 'Process' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/stats', label: 'Stats' },
  { href: '/admin/journey', label: 'My Journey' },
  { href: '/admin/tools', label: 'Tools' },
  { href: '/admin/footer', label: 'Footer' },
  { href: '/admin/settings', label: 'Settings / Resume' },
];

export default function AdminSidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-white/10 bg-[#0D0D0D] p-6">
      <p className="mb-6 text-sm font-semibold text-white">Portfolio CMS</p>
      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
