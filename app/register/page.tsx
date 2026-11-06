// app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from '@/lib/axios';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post('/auth/register', { email, username, password });
      setSuccess('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      // Lỗi thường gặp: Email không nằm trong Whitelist
      setError(err.response?.data?.message || 'Đăng ký thất bại. Email của bạn có thể chưa được cấp phép.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
      <div className="bg-white p-8 rounded-[2rem] shadow-lg border-[3px] border-[#8B5A2B]/20 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-[#8B5A2B] text-center mb-6">
          Tạo tài khoản mới
        </h1>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm text-center">{error}</div>}
        {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl mb-4 text-sm text-center">{success}</div>}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-[#8B5A2B] font-semibold mb-1">Email (Phải có trong Whitelist)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 border-[#8B5A2B]/20 rounded-xl focus:outline-none focus:border-[#8B5A2B] text-slate-700"
              placeholder="student@pastelbakery.com"
              required
            />
          </div>

          <div>
            <label className="block text-[#8B5A2B] font-semibold mb-1">Tên hiển thị</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border-2 border-[#8B5A2B]/20 rounded-xl focus:outline-none focus:border-[#8B5A2B] text-slate-700"
              placeholder="Ví dụ: Học Sinh Chăm Chỉ"
              required
            />
          </div>
          
          <div>
            <label className="block text-[#8B5A2B] font-semibold mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-[#8B5A2B]/20 rounded-xl focus:outline-none focus:border-[#8B5A2B] text-slate-700"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center text-[#8B5A2B]/70 mt-6 text-sm">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-[#8B5A2B] font-bold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
}