export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 max-w-xl text-white/60">
        Pick a section from the left to edit its content, images, or order.
        Every save updates MongoDB and instantly revalidates the live site —
        no redeploy needed.
      </p>
    </div>
  );
}
