'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type Mood = 'idle' | 'happy' | 'excited' | 'sad' | 'thinking' | 'wave';

export interface MascotMessage {
  id: number;
  text: string;
  mood: Mood;
  duration: number;
  reward?: number; // có giá trị => hiển thị kiểu thông báo nhận thưởng
}

interface SayOptions {
  mood?: Mood;
  duration?: number;
}

interface MascotContextValue {
  current: MascotMessage | null;
  baseMood: Mood;
  sleeping: boolean;
  balance: number | null;
  setBalance: (value: number) => void;
  setMood: (mood: Mood) => void;
  say: (text: string, options?: SayOptions) => void;
  reward: (amount: number, reason: string) => void;
}

const MascotContext = createContext<MascotContextValue | null>(null);

const IDLE_BEFORE_SLEEP_MS = 45_000; // 45 giây không thao tác thì ngủ
const AWAY_BEFORE_WELCOME_MS = 60_000; // rời tab quá 1 phút thì chào lại
const MAX_QUEUE = 5;

export function MascotProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<MascotMessage[]>([]);
  const [baseMood, setMood] = useState<Mood>('idle');
  const [balance, setBalance] = useState<number | null>(null);
  const [sleeping, setSleeping] = useState(false);

  const idRef = useRef(0);
  const lastActiveRef = useRef(Date.now());
  const sleepingRef = useRef(false);
  const hiddenAtRef = useRef<number | null>(null);

  const current = queue[0] ?? null;

  const push = useCallback((message: Omit<MascotMessage, 'id'>) => {
    const id = ++idRef.current;
    setQueue((q) => {
      const next = { ...message, id };
      // Hàng đợi đầy: bỏ tin chờ cũ nhất, giữ tin đang hiển thị
      return q.length >= MAX_QUEUE ? [q[0], ...q.slice(2), next] : [...q, next];
    });
  }, []);

  const say = useCallback(
    (text: string, options: SayOptions = {}) => {
      push({
        text,
        mood: options.mood ?? 'happy',
        duration: options.duration ?? 4000,
      });
    },
    [push],
  );

  const reward = useCallback(
    (amount: number, reason: string) => {
      push({ text: reason, mood: 'excited', duration: 5500, reward: amount });
    },
    [push],
  );

  // Hết thời gian thì bỏ tin hiện tại, tin kế tiếp tự hiện
  const currentId = current?.id;
  const currentDuration = current?.duration;
  useEffect(() => {
    if (currentId === undefined || currentDuration === undefined) return;
    const timer = setTimeout(() => setQueue((q) => q.slice(1)), currentDuration);
    return () => clearTimeout(timer);
  }, [currentId, currentDuration]);

  // Theo dõi hoạt động của user: ngủ khi vắng, dậy khi quay lại
  useEffect(() => {
    const onActivity = () => {
      lastActiveRef.current = Date.now();
      if (sleepingRef.current) {
        sleepingRef.current = false;
        setSleeping(false);
        say('Hử? Mình dậy rồi nè!', { mood: 'wave', duration: 3000 });
      }
    };

    const events = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    const interval = window.setInterval(() => {
      if (
        !sleepingRef.current &&
        Date.now() - lastActiveRef.current > IDLE_BEFORE_SLEEP_MS
      ) {
        sleepingRef.current = true;
        setSleeping(true);
      }
    }, 5000);

    const onVisibility = () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now();
        return;
      }
      const hiddenAt = hiddenAtRef.current;
      hiddenAtRef.current = null;
      lastActiveRef.current = Date.now();
      if (sleepingRef.current) {
        sleepingRef.current = false;
        setSleeping(false);
      }
      if (hiddenAt && Date.now() - hiddenAt > AWAY_BEFORE_WELCOME_MS) {
        say('Mừng bạn quay lại! Học tiếp nào~', { mood: 'wave' });
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [say]);

  const value = useMemo<MascotContextValue>(
    () => ({ current, baseMood, sleeping, balance, setBalance, setMood, say, reward }),
    [current, baseMood, sleeping, balance, say, reward],
  );

  return <MascotContext.Provider value={value}>{children}</MascotContext.Provider>;
}

export function useMascot() {
  const ctx = useContext(MascotContext);
  if (!ctx) throw new Error('useMascot phải được dùng bên trong <MascotProvider>');
  return ctx;
}