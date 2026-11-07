'use client';

import type { StatusItem } from '@/lib/progress';

interface Props {
  items: StatusItem[];
  title?: string;
  active?: string | null;
  onChange?: (key: string | null) => void;
  bare?: boolean; // bỏ khung ngoài khi nhúng vào card khác
}

export function StatusSummaryBar({ items, title, active = null, onChange, bare }: Props) {
  const total = items.reduce((sum, i) => sum + i.count, 0);
  const interactive = Boolean(onChange);

  const chipBase =
    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition';

  return (
    <div
      className={
        bare
          ? ''
          : 'rounded-3xl border border-[#C58A99]/60 bg-white p-4 shadow-[0_8px_24px_-14px_rgba(120,70,60,0.3)]'
      }
    >
      {title && (
        <div className="mb-3 flex items-baseline justify-between">
          <span className="font-serif text-lg text-[#5C3410]">{title}</span>
          <span className="text-xs text-[#5C3410]/60">{total} mục</span>
        </div>
      )}

      <div
        className="flex h-3 overflow-hidden rounded-full bg-[#EFEAE0]"
        role="img"
        aria-label={items.map((i) => `${i.label}: ${i.count}`).join(', ')}
      >
        {total > 0 &&
          items
            .filter((i) => i.count > 0)
            .map((i) => (
              <div
                key={i.key}
                title={`${i.label}: ${i.count}`}
                className="h-full transition-all duration-500"
                style={{ width: `${(i.count / total) * 100}%`, backgroundColor: i.color }}
              />
            ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {interactive && (
          <button
            type="button"
            onClick={() => onChange?.(null)}
            className={`${chipBase} ${
              active === null
                ? 'border-[#5C3410] bg-[#5C3410] text-white'
                : 'border-[#E3DDD0] text-[#5C3410]/70 hover:bg-[#F6F2EA]'
            }`}
          >
            Tất cả · {total}
          </button>
        )}

        {items.map((i) => {
          const selected = active === i.key;
          const content = (
            <>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: i.color }} />
              {i.label} · {i.count}
            </>
          );
          return interactive ? (
            <button
              key={i.key}
              type="button"
              onClick={() => onChange?.(selected ? null : i.key)}
              className={`${chipBase} ${
                selected ? 'text-[#5C3410]' : 'border-[#E3DDD0] text-[#5C3410]/70 hover:bg-[#F6F2EA]'
              }`}
              style={selected ? { borderColor: i.color, backgroundColor: `${i.color}22` } : undefined}
            >
              {content}
            </button>
          ) : (
            <span key={i.key} className={`${chipBase} border-[#E3DDD0] text-[#5C3410]/70`}>
              {content}
            </span>
          );
        })}
      </div>
    </div>
  );
}