import { STATUS_META, type ContentStatus, type TestStatus } from '@/lib/progress';

export function StatusBadge({ status }: { status: ContentStatus | TestStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: `${meta.color}26`, color: meta.text }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
      {meta.label}
    </span>
  );
}