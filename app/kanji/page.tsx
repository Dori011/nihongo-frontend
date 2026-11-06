// app/kanji/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Link from 'next/link';

interface Kanji {
  id: string;
  kanji: string;
  hanViet: string;
  meaningVi: string;
  onyomi: string;
  kunyomi: string;
  level: string;
}

export default function KanjiPage() {
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKanji = async () => {
      try {
        // Gọi API lấy danh sách Kanji (Giả sử Backend của bạn có route này)
        // Lưu ý: Route này cần được viết bên Backend. Nếu chưa có, xem hướng dẫn bên dưới
        const response = await axios.get('/kanji'); 
        setKanjiList(response.data);
      } catch (err: any) {
        setError('Không thể tải dữ liệu Kanji. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchKanji();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-nunito text-[#8B5A2B]">Đang tải dữ liệu...</div>;
  
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-20 px-4 font-nunito">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-playfair font-bold text-[#8B5A2B]">Thư viện Kanji</h1>
          <Link href="/" className="text-[#8B5A2B] hover:underline font-bold">
            &larr; Về trang chủ
          </Link>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kanjiList.map((item) => (
            <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-sm border-2 border-[#8B5A2B]/10 hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <span className="text-6xl font-serif mb-4 text-[#8B5A2B]">{item.kanji}</span>
              <h3 className="text-2xl font-playfair font-bold text-[#8B5A2B] mb-1">{item.hanViet}</h3>
              <p className="text-slate-500 mb-4">{item.meaningVi}</p>
              <div className="w-full bg-[#FDFBF7] rounded-xl p-3 text-sm text-left">
                <p><span className="font-bold text-emerald-600">Âm On:</span> {item.onyomi}</p>
                <p><span className="font-bold text-emerald-600">Âm Kun:</span> {item.kunyomi}</p>
              </div>
              <span className="mt-4 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                Level {item.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}