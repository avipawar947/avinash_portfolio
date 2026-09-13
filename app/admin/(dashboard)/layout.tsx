import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LogoutButton from '@/components/admin/LogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  // The login page itself must render without a session — Next can't
  // easily exclude a segment from a shared layout, so we check the path
  // via a lightweight client redirect there instead; here we just guard
  // everything else.
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-[#0B0B0B] text-white">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-white/10 px-8 py-4">
          <p className="text-sm text-white/50">Signed in as {session.email}</p>
          <LogoutButton />
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
