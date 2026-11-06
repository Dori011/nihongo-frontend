// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center relative font-nunito">
      
      {/* Thanh điều hướng */}
      <nav className="absolute top-6 right-6 flex gap-4 font-quicksand">
        {isLoggedIn ? (
          <button 
            onClick={handleLogout} 
            className="bg-red-50 text-red-500 border-2 border-red-100 px-5 py-2 rounded-full font-bold hover:bg-red-100 transition-colors shadow-sm"
          >
            Đăng xuất
          </button>
        ) : (
          <>
            <Link 
              href="/login" 
              className="bg-white border-2 border-[#8B5A2B]/20 text-[#8B5A2B] px-5 py-2 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              Đăng nhập
            </Link>
            <Link 
              href="/register" 
              className="bg-[#8B5A2B] text-white px-5 py-2 rounded-full font-bold hover:bg-[#6d4622] transition-colors shadow-sm"
            >
              Đăng ký
            </Link>
          </>
        )}
      </nav>

      {/* Cụm nội dung chính */}
      <div className="flex flex-col items-center text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Tiêu đề lớn dùng font Playfair (có chân, sang trọng) */}
        <h1 className="text-5xl md:text-6xl font-playfair font-bold text-[#8B5A2B] mb-6 leading-tight">
          Chào mừng đến với <br className="md:hidden" /> Nihongo!
        </h1>
        
        {/* Nội dung phụ dùng font Nunito (mềm mại) */}
        <p className="text-[#8B5A2B]/70 mb-8 text-lg md:text-xl font-medium max-w-md">
          Góc học tập nhỏ xinh của bạn. Hãy cùng Pudding chinh phục tiếng Nhật mỗi ngày nhé!
        </p>

        {/* Nút kêu gọi hành động (Call to Action) dùng font Quicksand */}
        <div className="flex gap-4">
          <Link 
            href={isLoggedIn ? "/kanji" : "/login"} 
            className="bg-emerald-500 text-white font-quicksand text-lg font-bold px-8 py-3 rounded-bakery hover:bg-emerald-600 hover:-translate-y-1 transition-all shadow-[0_6px_0_0_#047857] hover:shadow-[0_4px_0_0_#047857] active:translate-y-1 active:shadow-none"
          >
            {isLoggedIn ? "Vào học ngay 🚀" : "Bắt đầu ngay 🚀"}
          </Link>
        </div>
      </div>

    </main>
  );
}