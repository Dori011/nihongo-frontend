// ---------- Kiểu dữ liệu ----------
export type ContentStatus =
  | 'NOT_VIEWED' | 'OPENED' | 'VIEWING' | 'IN_PROGRESS' | 'INCOMPLETE' | 'COMPLETED';
export type TestStatus =
  | 'NOT_OPENED' | 'OPENED' | 'IN_PROGRESS' | 'INCOMPLETE' | 'COMPLETED' | 'EXPIRED';
export type SelfReview = 'UNRATED' | 'UNDERSTOOD' | 'NEEDS_REVIEW';
export type ProgressKind = 'kanji' | 'custom-kanji' | 'vocab';
export type ActivityType =
  | 'OPEN_KANJI' | 'OPEN_VOCAB' | 'COMPLETE_KANJI' | 'COMPLETE_VOCAB'
  | 'REVIEW_MARK' | 'OPEN_TEST' | 'COMPLETE_TEST' | 'DAILY_LOGIN';

export interface ItemProgress { status: ContentStatus; selfReview: SelfReview }
export type ProgressMap = Record<string, ItemProgress>;

export interface Bucket {
  total: number; mastered: number; learning: number; needsReview: number; notViewed: number;
  byStatus: Partial<Record<ContentStatus, number>>;
}

export interface DashboardData {
  user: { username: string; bambooBalance: number };
  streak: { current: number; last7: { date: string; active: boolean }[] };
  kanji: Bucket;
  vocab: Bucket;
  tests: {
    total: number; completed: number;
    byStatus: Partial<Record<TestStatus, number>>;
    lastCompleted: { title: string; score: number; maxScore: number; submittedAt: string | null } | null;
  };
  recentActivity: { id: string; type: ActivityType; label: string; createdAt: string }[];
}

export interface TestStatusRow {
  testId: string; title: string; type: string; level: string; maxScore: number;
  attemptId: string | null; status: TestStatus; score: number | null; submittedAt: string | null;
}

// ---------- Nhãn + màu ----------
export interface StatusMeta { label: string; color: string; text: string }

export const STATUS_META: Record<ContentStatus | TestStatus, StatusMeta> = {
  NOT_VIEWED:  { label: 'Chưa xem',        color: '#CFC8B8', text: '#6B6253' },
  NOT_OPENED:  { label: 'Chưa xem',        color: '#CFC8B8', text: '#6B6253' },
  OPENED:      { label: 'Đã xem',          color: '#B59E8C', text: '#6A4F3C' },
  VIEWING:     { label: 'Đã đọc',          color: '#C08497', text: '#8A4A5E' },
  IN_PROGRESS: { label: 'Đang hoàn thành', color: '#A65E65', text: '#7A3840' },
  INCOMPLETE:  { label: 'Chưa hoàn thành', color: '#D9A441', text: '#8A6414' },
  COMPLETED:   { label: 'Đã hoàn thành',   color: '#8A9A26', text: '#5E6A12' },
  EXPIRED:     { label: 'Hết giờ',         color: '#8C8C8C', text: '#555555' },
};

export const CONTENT_ORDER: ContentStatus[] =
  ['NOT_VIEWED', 'OPENED', 'VIEWING', 'IN_PROGRESS', 'INCOMPLETE', 'COMPLETED'];
export const TEST_ORDER: TestStatus[] =
  ['NOT_OPENED', 'OPENED', 'IN_PROGRESS', 'INCOMPLETE', 'EXPIRED', 'COMPLETED'];

export interface StatusItem { key: string; label: string; color: string; count: number }

export function countBy<S extends string>(values: S[]): Partial<Record<S, number>> {
  const out: Partial<Record<S, number>> = {};
  for (const v of values) out[v] = (out[v] ?? 0) + 1;
  return out;
}

export function buildStatusItems<S extends ContentStatus | TestStatus>(
  counts: Partial<Record<S, number>>,
  order: readonly S[],
): StatusItem[] {
  return order.map((key) => ({
    key,
    label: STATUS_META[key].label,
    color: STATUS_META[key].color,
    count: counts[key] ?? 0,
  }));
}

// ---------- Gọi API ----------
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// ⚠️ Sửa đúng 1 chỗ này cho khớp cách bạn đang lưu token đăng nhập
export function getToken(): string | null {
  return typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? `Lỗi ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const progressApi = {
  dashboard: () => request<DashboardData>('/dashboard'),
  list: (kind: ProgressKind) => request<ProgressMap>(`/progress/${kind}`),
  open: (kind: ProgressKind, id: string) =>
    request<ItemProgress>(`/progress/${kind}/${id}/open`, { method: 'POST' }),
  read: (kind: ProgressKind, id: string) =>
    request<ItemProgress>(`/progress/${kind}/${id}/read`, { method: 'POST' }),
  review: (kind: ProgressKind, id: string, value: SelfReview) =>
    request<ItemProgress>(`/progress/${kind}/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ value }),
    }),
  tests: () => request<TestStatusRow[]>('/progress/tests'),
  openTest: (id: string) =>
    request<{ attemptId: string; status: TestStatus }>(`/progress/tests/${id}/open`, {
      method: 'POST',
    }),
};