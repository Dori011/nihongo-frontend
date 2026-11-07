// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      
      {/* Nút Đăng nhập / Đăng xuất - Đưa lên góc phải */}
      <div className="absolute top-6 right-6 z-20">
        {isLoggedIn ? (
          <button 
            onClick={handleLogout} 
            className="bg-red-50/90 backdrop-blur-sm text-red-500 border-2 border-red-100 px-6 py-2 rounded-full font-bold hover:bg-red-100 transition-colors shadow-sm"
          >
            Đăng xuất
          </button>
        ) : (
          <div className="flex gap-3">
            <Link href="/login" className="bg-white/80 backdrop-blur-sm border-2 border-[#8B5A2B]/20 text-[#8B5A2B] px-6 py-2 rounded-full font-bold hover:bg-white transition-colors shadow-sm">
              Đăng nhập
            </Link>
            <Link href="/register" className="bg-[#8B5A2B]/90 backdrop-blur-sm text-white px-6 py-2 rounded-full font-bold hover:bg-[#6d4622] transition-colors shadow-sm">
              Đăng ký
            </Link>
          </div>
        )}
      </div>

      {/* Cụm nội dung chính */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center bg-white/60 backdrop-blur-md p-10 md:p-16 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/80 max-w-3xl w-full text-center"
      >
        <h1 className="text-5xl md:text-7xl font-playfair font-bold text-[#8B5A2B] mb-6 leading-tight drop-shadow-sm">
          Chào mừng đến với <br className="md:hidden" /> Nihongo!
        </h1>
        
        <p className="text-[#8B5A2B]/80 mb-10 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
          Góc học tập nhỏ xinh của bạn. Hãy cùng Pudding chinh phục tiếng Nhật mỗi ngày nhé!
        </p>

        <Link href={isLoggedIn ? "/kanji" : "/login"} className="group relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full blur opacity-50 group-hover:opacity-80 transition duration-500"></div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-pink-400 text-white font-quicksand text-xl font-bold px-10 py-4 rounded-full shadow-[0_8px_0_0_#be185d] hover:shadow-[0_4px_0_0_#be185d] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all duration-150 flex items-center gap-2"
          >
            {isLoggedIn ? "Vào học ngay" : "Bắt đầu ngay"} 
            <span className="group-hover:rotate-12 transition-transform duration-300">🎀</span>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}