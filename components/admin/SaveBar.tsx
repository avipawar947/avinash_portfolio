export default function SaveBar({
  saving,
  onSave,
  message,
}: {
  saving: boolean;
  onSave: () => void;
  message?: string;
}) {
  return (
    <div className="sticky bottom-0 mt-8 flex items-center justify-between border-t border-white/10 bg-[#0D0D0D] px-6 py-4">
      <span className="text-sm text-white/50">{message}</span>
      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
}
