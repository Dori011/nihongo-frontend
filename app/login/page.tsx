// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from '@/lib/axios';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', { email, password });
      localStorage.setItem('access_token', response.data.access_token);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-nunito relative overflow-hidden">
      
      {/* Trang trí nền (tùy chọn) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#FFD1DC]/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#FFE5B4]/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-[#8B5A2B]/10 w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Tiêu đề dùng font Playfair */}
        <h1 className="text-4xl font-playfair font-bold text-[#8B5A2B] text-center mb-2">
          Chào mừng trở lại!
        </h1>
        <p className="text-center text-slate-500 text-sm mb-8">
          Đăng nhập để tiếp tục hành trình học tiếng Nhật
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-semibold text-center border border-red-100 animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-[#8B5A2B] font-bold mb-2 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#FDFBF7] border-2 border-[#8B5A2B]/20 rounded-xl focus:outline-none focus:border-[#8B5A2B] focus:ring-4 focus:ring-[#8B5A2B]/10 transition-all text-slate-700 placeholder-slate-400"
              placeholder="student@pastelbakery.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-[#8B5A2B] font-bold mb-2 text-sm">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#FDFBF7] border-2 border-[#8B5A2B]/20 rounded-xl focus:outline-none focus:border-[#8B5A2B] focus:ring-4 focus:ring-[#8B5A2B]/10 transition-all text-slate-700 placeholder-slate-400"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Nút bấm dùng font Quicksand, hiệu ứng 3D */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-[#8B5A2B] text-white font-quicksand text-lg font-bold py-3 rounded-xl transition-all shadow-[0_6px_0_0_#6d4622] hover:shadow-[0_4px_0_0_#6d4622] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 text-sm">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </main>
  );
}