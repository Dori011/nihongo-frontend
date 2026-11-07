'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PenguinProps {
  bambooBalance: number;
  message?: string;
  emotion?: 'happy' | 'angry' | 'studying' | 'sleepy';
}

export const PenguinCompanion: React.FC<PenguinProps> = ({
  bambooBalance,
  message,
  emotion = 'happy',
}) => {
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState('');

  useEffect(() => {
    if (message) {
      setBubbleText(message);
      setShowBubble(true);
      const timer = setTimeout(() => setShowBubble(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleTap = () => {
    const lines = [
      'Hihi, nhột quá!',
      'Học thêm chút nữa nhé?',
      'Mình canh bài cho bạn nè 💕',
      'Hôm nay bạn ôn Kanji chưa đó?'
    ];
    setBubbleText(lines[Math.floor(Math.random() * lines.length)]);
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), 4000);
  };

  return (
    <div className="fixed bottom-10 right-10 z-50 flex items-end justify-end">
      
      {/* KHUNG CHAT */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="absolute bottom-full right-0 mb-2 mr-6 w-max max-w-[220px] bg-white border-[3px] border-[#8B5A2B]/20 rounded-[2rem] p-4 shadow-lg pointer-events-none"
          >
            <p className="font-nunito font-semibold text-[#4A2F1D] text-center text-sm">{bubbleText}</p>
            <div className="mt-2 text-xs font-bold flex items-center justify-center gap-1 text-emerald-600 bg-emerald-50 rounded-full py-1">
              🎋 Số dư: {bambooBalance}
            </div>
            
            {/* Bong bóng suy nghĩ */}
            <div className="absolute -bottom-3 right-8 w-3 h-3 bg-white border-[3px] border-[#8B5A2B]/20 rounded-full" />
            <div className="absolute -bottom-7 right-5 w-2 h-2 bg-white border-[3px] border-[#8B5A2B]/20 rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HÌNH DÁNG CHIM CÁNH CỤT BẰNG SVG (GIỐNG ẢNH 100%) */}
      <motion.div
        onClick={handleTap}
        animate={{ y: [0, -8, 0] }} 
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="relative w-28 h-24 cursor-pointer pointer-events-auto flex items-end justify-center"
      >
        {/* SVG Chim cánh cụt */}
        <svg 
          viewBox="0 0 200 180" 
          className="w-full h-full drop-shadow-xl overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Lông trên đầu */}
          <path d="M 95 30 Q 90 10 100 15 Q 100 5 110 20 Z" fill="#4A5B7C" />
          <path d="M 100 30 Q 110 10 115 20 Q 120 5 120 25 Z" fill="#4A5B7C" />
          
          {/* Viền xanh đậm (Thân) */}
          <path d="M 100 180 C 20 180 10 140 15 90 C 20 40 60 30 100 30 C 140 30 180 40 185 90 C 190 140 180 180 100 180 Z" fill="#4A5B7C" />
          
          {/* Mặt trắng */}
          <path d="M 100 175 C 35 175 25 140 30 95 C 35 55 65 45 100 45 C 135 45 165 55 170 95 C 175 140 165 175 100 175 Z" fill="#FFFDFA" />
          
          {/* Mắt trái */}
          <ellipse cx="70" cy="100" rx="6" ry="9" fill="#33415C" transform="rotate(10 70 100)" />
          
          {/* Mắt phải */}
          <ellipse cx="130" cy="100" rx="6" ry="9" fill="#33415C" transform="rotate(-10 130 100)" />
          
          {/* Mỏ vàng (hình trái tim) */}
          <path d="M 100 115 C 85 115 85 130 100 135 C 115 130 115 115 100 115 Z" fill="#EAB84C" />
          
          {/* Má hồng trái */}
          <ellipse cx="50" cy="120" rx="18" ry="10" fill="#F9D3D3" opacity="0.6" filter="blur(2px)" />
          
          {/* Má hồng phải */}
          <ellipse cx="150" cy="120" rx="18" ry="10" fill="#F9D3D3" opacity="0.6" filter="blur(2px)" />
        </svg>

        {/* Trái tim bay lơ lửng */}
        <motion.div 
          animate={{ y: [-5, -20, -5], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
          className="absolute -top-4 right-2 text-pink-400 text-lg"
        >
          💕
        </motion.div>
      </motion.div>
    </div>
  );
};