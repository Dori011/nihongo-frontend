'use client';

import { useEffect, useState } from 'react';
import { progressApi, type ItemProgress, type ProgressKind, type SelfReview } from '@/lib/progress';
import { StatusBadge } from './StatusBadge';

const READ_AFTER_MS = 8000;

interface Props {
  kind: ProgressKind;
  itemId: string;
  onChange?: (progress: ItemProgress) => void;
}

export function ReviewBar({ kind, itemId, onChange }: Props) {
  const [state, setState] = useState<ItemProgress | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mở trang => "Đã xem"; ở lại đủ lâu => "Đã đọc"
  useEffect(() => {
    let cancelled = false;
    setState(null);

    progressApi
      .open(kind, itemId)
      .then((s) => !cancelled && setState(s))
      .catch(() => {});

    const timer = setTimeout(() => {
      progressApi
        .read(kind, itemId)
        .then((s) => !cancelled && setState(s))
        .catch(() => {});
    }, READ_AFTER_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [kind, itemId]);

  const rate = async (value: SelfReview) => {
    if (busy) return;
    const next: SelfReview = state?.selfReview === value ? 'UNRATED' : value;
    setBusy(true);
    setError(null);
    try {
      const s = await progressApi.review(kind, itemId, next);
      setState(s);
      onChange?.(s);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Có lỗi xảy ra');
    } finally {
      setBusy(false);
    }
  };

  const understood = state?.selfReview === 'UNDERSTOOD';
  const needsReview = state?.selfReview === 'NEEDS_REVIEW';

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#C58A99]/50 bg-white p-3">
      <StatusBadge status={state?.status ?? 'NOT_VIEWED'} />

      <div className="ml-auto flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => rate('UNDERSTOOD')}
          aria-pressed={understood}
          className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition disabled:opacity-60 ${
            understood
              ? 'border-[#8A9A26] bg-[#8A9A26] text-white'
              : 'border-[#8A9A26]/50 text-[#5E6A12] hover:bg-[#8A9A26]/10'
          }`}
        >
          ✅ Đã xem, nắm rồi
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => rate('NEEDS_REVIEW')}
          aria-pressed={needsReview}
          className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition disabled:opacity-60 ${
            needsReview
              ? 'border-[#C08497] bg-[#C08497] text-white'
              : 'border-[#C08497]/60 text-[#8A4A5E] hover:bg-[#C08497]/10'
          }`}
        >
          🔁 Cần xem lại
        </button>
      </div>

      {error && <p className="w-full text-xs text-red-600">{error}</p>}
    </div>
  );
}