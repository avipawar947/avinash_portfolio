import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-[#0b0b0b] px-5 py-32 text-center text-white">
      <h1 className="font-display text-4xl font-bold">Case study not found</h1>
      <p className="mt-3 text-white/60">The project you are looking for does not exist.</p>
      <Link href="/#work" className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-medium text-black">
        Back to work
      </Link>
    </main>
  );
}
