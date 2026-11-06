'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring, // Thêm thư viện lò xo
  type TargetAndTransition,
} from 'framer-motion';

type Mood = 'idle' | 'happy' | 'excited' | 'wave' | 'sad' | 'thinking';
type Action = 'run' | 'lie' | 'wave' | 'grabbed' | null;
type Pose = Mood | 'sleep' | 'lie' | 'run' | 'grabbed' | 'falling'; // Thêm trạng thái rơi

const SIZE = 128;
const RUN_SPEED = 170;
const STORAGE_KEY = 'nihongo:penguin-position';
const DEFAULT_SPRITE = '/penguin-knife.png'; // Nhớ đổi tên file ảnh cho khớp

// Cấu hình lò xo cho vị trí (để khi thả ra nó nảy nhẹ)
const springConfig = { damping: 15, stiffness: 100 };

const BASE = { y: 0, rotate: 0, scale: 1, scaleY: 1, filter: 'grayscale(0) brightness(1)' };
const SETTLE = { duration: 0.35 };
const loop = (duration: number) => ({ repeat: Infinity, duration, ease: 'easeInOut' as const });

const POSES: Record<Pose, TargetAndTransition> = {
  idle: { ...BASE, y: [0, -3, 0], scaleY: [1, 1.03, 1], transition: { default: SETTLE, y: loop(2.6), scaleY: loop(2.6) } },
  happy: { ...BASE, y: [0, -16, 0], rotate: [-5, 5, -5], transition: { default: SETTLE, y: loop(0.7), rotate: loop(1.4) } },
  excited: { ...BASE, y: [0, -26, 0], scale: [1, 1.1, 1], rotate: [-10, 10, -10], transition: { default: SETTLE, y: loop(0.5), scale: loop(0.5), rotate: loop(1) } },
  wave: { ...BASE, y: [0, -4, 0], rotate: [0, -14, 14, -14, 14, 0], transition: { default: SETTLE, y: loop(0.7), rotate: loop(1.4) } },
  run: { ...BASE, y: [0, -12, 0], rotate: [-7, 7, -7], scaleY: [1, 0.94, 1], transition: { default: SETTLE, y: loop(0.3), rotate: loop(0.6), scaleY: loop(0.3) } },
  sleep: { ...BASE, rotate: 90, y: 10, scale: [1, 1.04, 1], transition: { default: SETTLE, rotate: { duration: 0.6 }, scale: loop(3) } },
  lie: { ...BASE, rotate: 90, y: 10, scale: [1, 1.03, 1], transition: { default: SETTLE, rotate: { duration: 0.6 }, scale: loop(2.4) } },
  sad: { ...BASE, rotate: [0, -4, 0], y: [2, 4, 2], scaleY: 0.96, filter: 'grayscale(0.45) brightness(0.95)', transition: { default: SETTLE, rotate: loop(3), y: loop(3) } },
  thinking: { ...BASE, rotate: [4, 9, 4], y: [0, -2, 0], transition: { default: SETTLE, rotate: loop(2.2), y: loop(2.2) } },
  
  // Bị kéo: Xoay lắc mạnh, kéo giãn chiều dọc
  grabbed: { 
    ...BASE, 
    scale: 1.1, 
    scaleY: 1.15, 
    y: -10, 
    rotate: [-20, 20, -20, 20, -20], 
    transition: { default: SETTLE, rotate: { repeat: Infinity, duration: 0.4, ease: 'linear' } } 
  },
  // Đang rơi: Xoay tròn
  falling: {
    ...BASE,
    rotate: 180,
    transition: { duration: 0.5 }
  }
};

// ... (Phần MoodFx giữ nguyên như cũ) ...
const FX: Partial<Record<Pose, string[]>> = {
  happy: ['💕', '💗'], excited: ['✨', '⭐', '✨'], wave: ['👋'], sleep: ['💤', '💤'],
  lie: ['🎵'], sad: ['💧'], thinking: ['🤔'], grabbed: ['❗', '💦'], falling: ['❗'],
};

function MoodFx({ pose }: { pose: Pose }) {
  const emojis = FX[pose];
  if (!emojis) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 h-0">
      {emojis.map((emoji, i) => (
        <motion.span key={`${pose}-${i}`} className="absolute text-xl" style={{ left: `${20 + i * 28}%` }}
          initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 0], y: [0, -36], scale: [0.6, 1, 0.9] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}>
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

const TAP_LINES = [
  { text: 'Hihi, nhột quá!', mood: 'happy' as Mood },
  { text: 'Học thêm một chút nữa nhé?', mood: 'wave' as Mood },
  { text: 'Mình canh bài cho bạn nè 🔪💕', mood: 'happy' as Mood },
  { text: 'Hôm nay bạn ôn Kanji chưa đó?', mood: 'thinking' as Mood },
];

export const PenguinCompanion: React.FC<{ bambooBalance?: number; message?: string }> = ({ bambooBalance = 10 }) => {
  const reduceMotion = useReducedMotion();
  
  // Sử dụng MotionValue gốc và Spring cho vị trí
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, springConfig); // Lò xo cho trục X
  const y = useSpring(rawY, springConfig); // Lò xo cho trục Y

  const boundsRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<{ stop: () => void } | null>(null);
  const actionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [ready, setReady] = useState(false);
  const [action, setAction] = useState<Action>(null);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [below, setBelow] = useState(false);
  const [side, setSide] = useState<'left' | 'center' | 'right'>('center');
  const [bubble, setBubble] = useState<{ text: string; id: number } | null>(null);

  const savePosition = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: rawX.get(), y: rawY.get() })); } catch {}
  }, [rawX, rawY]);

  const clampToViewport = useCallback(() => {
    rawX.set(Math.min(Math.max(0, rawX.get()), Math.max(0, window.innerWidth - SIZE)));
    rawY.set(Math.min(Math.max(0, rawY.get()), Math.max(0, window.innerHeight - SIZE)));
  }, [rawX, rawY]);

  const updateAnchor = useCallback(() => {
    const px = rawX.get();
    setBelow(rawY.get() < 150);
    setSide(px < 100 ? 'left' : px > window.innerWidth - SIZE - 100 ? 'right' : 'center');
  }, [rawX, rawY]);

  useEffect(() => {
    let startX = window.innerWidth - SIZE - 40;
    let startY = window.innerHeight - SIZE - 40;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
        startX = saved.x; startY = saved.y;
      }
    } catch {}
    
    // Khởi tạo vị trí ban đầu (không dùng spring để tránh bị trượt từ góc 0,0)
    rawX.set(startX); rawY.set(startY); 
    updateAnchor(); setReady(true);

    const unsubX = rawX.on('change', updateAnchor);
    const unsubY = rawY.on('change', updateAnchor);
    const onResize = () => { clampToViewport(); updateAnchor(); };
    window.addEventListener('resize', onResize);

    return () => {
      unsubX(); unsubY(); window.removeEventListener('resize', onResize);
      runRef.current?.stop(); if (actionTimer.current) clearTimeout(actionTimer.current);
    };
  }, [rawX, rawY, clampToViewport, updateAnchor]);

  const startAction = useCallback((next: Action, ms: number) => {
    if (actionTimer.current) clearTimeout(actionTimer.current);
    setAction(next);
    if (next && ms > 0) actionTimer.current = setTimeout(() => setAction(null), ms);
  }, []);

  const stopRunning = useCallback(() => { runRef.current?.stop(); runRef.current = null; }, []);

  const runTo = useCallback((targetX: number) => {
    stopRunning();
    const distance = Math.abs(targetX - rawX.get());
    if (distance < 40) return;
    setFacing(targetX > rawX.get() ? 1 : -1);
    startAction('run', 0);
    runRef.current = animate(rawX, targetX, {
      duration: distance / RUN_SPEED, ease: 'linear',
      onComplete: () => { runRef.current = null; setAction(null); savePosition(); },
    });
  }, [rawX, startAction, stopRunning, savePosition]);

  useEffect(() => {
    if (bubble && action === 'run') { stopRunning(); startAction(null, 0); savePosition(); }
  }, [bubble, action, stopRunning, startAction, savePosition]);

  const canWander = ready && !reduceMotion && !bubble && action === null;

  useEffect(() => {
    if (!canWander) return;
    const timer = setTimeout(() => {
      const roll = Math.random();
      if (roll < 0.6) {
        const maxX = Math.max(0, window.innerWidth - SIZE);
        let target = Math.random() * maxX;
        if (Math.abs(target - rawX.get()) < 120) target = rawX.get() < maxX / 2 ? Math.max(0, maxX - 40) : 40;
        runTo(target);
      } else if (roll < 0.8) startAction('lie', 5000);
      else startAction('wave', 2800);
    }, 7000 + Math.random() * 8000);
    return () => clearTimeout(timer);
  }, [canWander, runTo, startAction, rawX]);

  const handleDragStart = () => { 
    stopRunning(); 
    startAction('grabbed', 0); 
  };
  
  const handleDragEnd = () => { 
    clampToViewport(); 
    savePosition(); 
    startAction(null, 0); 
  };
  
  const handleTap = () => {
    if (action === 'grabbed') return;
    stopRunning(); startAction(null, 0);
    const line = TAP_LINES[Math.floor(Math.random() * TAP_LINES.length)];
    setBubble({ text: line.text, id: Date.now() });
    setTimeout(() => setBubble(null), 3500);
  };

  const pose: Pose = action === 'grabbed' ? 'grabbed' : bubble ? 'happy' : (action ?? 'idle');

  const anchorClass = [below ? 'top-full mt-2' : 'bottom-full mb-2', side === 'left' ? 'left-0' : side === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'].join(' ');
  const alignClass = side === 'left' ? 'items-start' : side === 'right' ? 'items-end' : 'items-center';
  const dotMargin = side === 'left' ? 'ml-10' : side === 'right' ? 'mr-10' : '';
  const colClass = below ? 'flex-col-reverse' : 'flex-col';

  return (
    <>
      <div ref={boundsRef} aria-hidden className="pointer-events-none fixed inset-0" />
      <motion.div
        className="fixed left-0 top-0 z-50 cursor-grab touch-none select-none active:cursor-grabbing"
        // LƯU Ý: Dùng rawX, rawY cho kéo thả, còn x, y (spring) cho hiệu ứng
        style={{ x, y, width: SIZE, height: SIZE, opacity: ready ? 1 : 0 }}
        drag
        dragConstraints={boundsRef} 
        dragElastic={0.2} // Cho phép kéo giãn nhẹ ra ngoài biên
        dragMomentum={false}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd} 
        onTap={handleTap}
      >
        <div className={`pointer-events-none absolute w-max max-w-[230px] ${anchorClass}`}>
          <AnimatePresence mode="wait">
            {bubble && (
              <motion.div key={bubble.id} className={`flex ${colClass} ${alignClass}`}
                initial={{ opacity: 0, scale: 0.8, y: below ? -6 : 6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}>
                <div className="rounded-[1.75rem] border-[3px] border-[#8B5A2B]/20 bg-white px-4 py-3 text-center text-sm text-slate-700 shadow-lg">
                  <p className="font-semibold">{bubble.text}</p>
                  <div className="mt-2 flex items-center justify-center gap-1 rounded-full bg-emerald-50 py-1 text-xs font-bold text-emerald-600">
                    🎋 Số dư: {bambooBalance}
                  </div>
                </div>
                <div className={`flex ${colClass} items-center gap-1 ${dotMargin}`}>
                  <span className="mt-1 h-3 w-3 rounded-full border-[3px] border-[#8B5A2B]/20 bg-white" />
                  <span className="h-2 w-2 rounded-full border-[3px] border-[#8B5A2B]/20 bg-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <MoodFx pose={pose} />

        <motion.div className="h-full w-full" animate={{ scaleX: facing }} transition={{ duration: 0.15 }}>
          <motion.div className="h-full w-full" animate={reduceMotion ? BASE : POSES[pose]}>
            <img
              src={DEFAULT_SPRITE}
              alt="Chú chim cánh cụt"
              draggable={false}
              // Thêm hiệu ứng mix-blend-multiply để xóa nền trắng của ảnh
              className="pointer-events-none h-full w-full select-none object-contain drop-shadow-xl mix-blend-multiply"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};