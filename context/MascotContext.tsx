'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type Mood = 'idle' | 'thinking' | 'wave' | 'sad' | 'happy';

interface MascotContextType {
  message: string | null;
  balance: number;
  mood: Mood;
  say: (msg: string, options?: { mood?: Mood }) => void;
  reward: (amount: number, msg?: string) => void;
  setMood: (mood: Mood) => void;
  setBalance: (balance: number) => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

export function MascotProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>('Hôm nay mình cùng làm vài câu tiếng Nhật nhé!');
  const [balance, setBalance] = useState(10);
  const [mood, setMood] = useState<Mood>('idle');

  const say = (msg: string, options?: { mood?: Mood }) => {
    setMessage(msg);
    if (options?.mood) setMood(options.mood);
  };

  const reward = (amount: number, msg?: string) => {
    setBalance((prev) => prev + amount);
    if (msg) say(msg, { mood: 'happy' });
  };

  return (
    <MascotContext.Provider value={{ message, balance, mood, say, reward, setMood, setBalance }}>
      {children}
    </MascotContext.Provider>
  );
}

export const useMascot = () => {
  const context = useContext(MascotContext);
  if (!context) throw new Error('useMascot must be used within MascotProvider');
  return context;
};