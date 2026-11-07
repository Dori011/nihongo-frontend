'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const menuItems = [
  { name: 'Trang chủ', href: '/', icon: '🏠' },
  { name: 'Kanji', href: '/kanji', icon: '📖' },
  { name: 'Từ vựng', href: '/vocabulary', icon: '📝' },
  { name: 'Bài Test', href: '/test', icon: '🏆' },
  { name: 'Viết câu AI', href: '/ai-check', icon: '✍️' },
  { name: 'Nhiệm vụ', href: '/missions', icon: '🎁' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <>
      {/* --- SIDEBAR CHO LAPTOP --- */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-[#FFF8F0] border-r-2 border-[#F0D9C9] shadow-[4px_0_24px_rgba(139,90,43,0.05)] z-40 p-5 font-nunito">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 mb-8 px-2 group">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FFB7B2] to-[#E2A76F] rounded-2xl flex items-center justify-center text-2xl shadow-md transition-transform duration-300 group-hover:scale-110">
            🍮
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-playfair font-bold text-[#8B5A2B] leading-none">Nihongo</span>
            <span className="text-[10px] font-bold text-[#D49A76] tracking-widest uppercase mt-1">Japanese Learning</span>
          </div>
        </Link>

        {/* DANH SÁCH MENU */}
        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 3 }} 
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-colors duration-300 overflow-hidden border-2 ${
                    isActive 
                      ? 'bg-[#FCE3D0] border-[#F0B893] text-[#8B5A2B] shadow-[0_4px_0_0_#F0B893]' 
                      : 'bg-white border-transparent text-slate-500 hover:bg-[#FFF0E5] hover:text-[#8B5A2B]'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      initial={{ x: '-100%' }} animate={{ x: '200%' }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent w-1/2 -skew-x-12 pointer-events-none"
                    />
                  )}
                  <span className="text-xl relative z-10">{item.icon}</span>
                  <span className="relative z-10">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* --- KHU VỰC USER / SETTINGS (Dưới cùng) --- */}
        <div className="mt-4 pt-4 border-t-2 border-[#F0D9C9] relative">
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-2xl shadow-xl border border-[#F0D9C9] p-2 flex flex-col gap-1 z-50"
              >
                <Link href="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-[#FFF8F0] rounded-xl text-sm font-bold text-slate-600 transition-colors">
                  <span>👤</span> Tài khoản
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-[#FFF8F0] rounded-xl text-sm font-bold text-slate-600 transition-colors">
                  <span>⚙️</span> Cài đặt
                </Link>
                <div className="h-px bg-slate-100 w-full my-1"></div>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 rounded-xl text-sm font-bold text-red-500 transition-colors text-left w-full">
                  <span>🚪</span> Đăng xuất
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nút bấm hiển thị Avatar / Đăng nhập */}
          {isLoggedIn ? (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-3 w-full p-2 rounded-2xl transition-colors ${showUserMenu ? 'bg-[#FFF0E5]' : 'hover:bg-[#FFF0E5]'}`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-orange-300 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                U
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-[#8B5A2B]">Học viên</span>
                <span className="text-[10px] text-slate-500 font-medium">Xem hồ sơ</span>
              </div>
            </motion.button>
          ) : (
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full p-3 rounded-2xl bg-[#8B5A2B] text-white font-bold shadow-md hover:bg-[#6d4622] transition-colors"
              >
                <span>🔑</span> Đăng nhập
              </motion.div>
            </Link>
          )}
        </div>
      </aside>

      {/* --- BOTTOM NAV CHO MOBILE --- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#FFF8F0]/95 backdrop-blur-xl border-t-2 border-[#F0D9C9] z-50 flex justify-around py-2 px-1 pb-safe shadow-[0_-4px_20px_rgba(139,90,43,0.1)]">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-full">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl w-full ${
                  isActive ? 'text-[#E2875A]' : 'text-slate-400'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-bold font-nunito">{item.name}</span>
                {isActive && <div className="w-1.5 h-1.5 bg-[#E2875A] rounded-full mt-1"></div>}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}