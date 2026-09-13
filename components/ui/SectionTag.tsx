/** Small pill label above section headings, e.g. "How I Work", "Recent Work". */
export default function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center gap-2 rounded-card border border-stroke bg-surface px-4 py-2.5 text-label text-heading">
      {children}
    </span>
  );
}
