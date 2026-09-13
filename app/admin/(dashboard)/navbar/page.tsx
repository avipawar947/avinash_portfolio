'use client';

/**
 * TODO: build this out following the exact pattern used in
 * app/admin/(dashboard)/hero/page.tsx (singleton sections: navbar,
 * journey, footer, settings) or .../projects/page.tsx (array sections:
 * process, gallery, stats, tools) -- fetch from /api/navbar with SWR,
 * edit local state, PUT/POST/DELETE back, mutate() to refresh.
 */
export default function NavbarAdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold capitalize">navbar</h1>
      <p className="mt-2 max-w-lg text-white/50">
        Editor not built yet -- wire this up the same way as the Hero and
        Projects editors (see code comments in this file).
      </p>
    </div>
  );
}
