// app/kanji/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from '@/lib/axios';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Kanji {
  id: string;
  kanji: string;
  hanViet: string;
  meaningVi: string;
  onyomi: string;
  kunyomi: string;
  level: string;
  strokeCount?: number;
  radical?: string;
  words?: string[]; 
}

// TỪ ĐIỂN MINI: Cung cấp sẵn Hán Việt và Từ ghép
const kanjiData: Record<string, { hanViet: string, words: string[] }> = {
  '日': { hanViet: 'NHẬT', words: ['日本 (Nhật Bản)', '日曜日 (Chủ nhật)', '毎日 (Mỗi ngày)'] },
  '一': { hanViet: 'NHẤT', words: ['一つ (Một cái)', '一人 (Một người)', '一月 (Tháng 1)'] },
  '国': { hanViet: 'QUỐC', words: ['外国 (Nước ngoài)', '国語 (Quốc ngữ)', '国民 (Quốc dân)'] },
  '人': { hanViet: 'NHÂN', words: ['日本人 (Người Nhật)', '一人 (Một người)', '大人 (Người lớn)'] },
  '年': { hanViet: 'NIÊN', words: ['今年 (Năm nay)', '来年 (Năm sau)', '毎年 (Mỗi năm)'] },
  '大': { hanViet: 'ĐẠI', words: ['大学 (Đại học)', '大きい (To lớn)', '大切 (Quan trọng)'] },
  '学': { hanViet: 'HỌC', words: ['学生 (Học sinh)', '大学 (Đại học)', '学校 (Trường học)'] },
  '水': { hanViet: 'THỦY', words: ['水曜日 (Thứ 4)', '水道 (Đường ống nước)', '水泳 (Bơi lội)'] },
  '火': { hanViet: 'HỎA', words: ['火曜日 (Thứ 3)', '火山 (Núi lửa)', '花火 (Pháo hoa)'] },
  '山': { hanViet: 'SƠN', words: ['富士山 (Núi Phú Sĩ)', '山田 (Tên Yamada)', '登山 (Leo núi)'] },
  '川': { hanViet: 'XUYÊN', words: ['川口 (Tên Kawaguchi)', '小川 (Dòng suối)'] },
  '万': { hanViet: 'VẠN', words: ['万年筆 (Bút máy)', '万歳 (Muôn năm)', '万一 (Vạn nhất)'] },
  '七': { hanViet: 'THẤT', words: ['七夕 (Lễ Thất Tịch)', '七つ (Bảy cái)', '七日 (Ngày mùng 7)'] },
  '十': { hanViet: 'THẬP', words: ['十分 (10 phút)', '二十歳 (20 tuổi)', '十人 (Mười người)'] },
  '二': { hanViet: 'NHỊ', words: ['二人 (Hai người)', '二月 (Tháng 2)', '二日 (Ngày mùng 2)'] },
  '本': { hanViet: 'BẢN', words: ['日本 (Nhật Bản)', '本屋 (Hiệu sách)', '一本 (Một cái)'] },
  '中': { hanViet: 'TRUNG', words: ['中国 (Trung Quốc)', '中学校 (Cấp 2)', '真ん中 (Ở giữa)'] },
  '上': { hanViet: 'THƯỢNG', words: ['上手 (Giỏi)', '上着 (Áo khoác)', '以上 (Trở lên)'] },
  '長': { hanViet: 'TRƯỜNG', words: ['社長 (Giám đốc)', '長い (Dài)', '校長 (Hiệu trưởng)'] },
  '出': { hanViet: 'XUẤT', words: ['出口 (Cửa ra)', '出す (Lấy ra)', '出席 (Tham dự)'] },
  '三': { hanViet: 'TAM', words: ['三月 (Tháng 3)', '三つ (Ba cái)', '三日月 (Trăng lưỡi liềm)'] },
  '週': { hanViet: 'CHU', words: ['週末 (Cuối tuần)', '今週 (Tuần này)', '再来週 (Tuần sau nữa)'] },
};

const cardGradients = [
  'from-pink-200/80 to-rose-100/80', 'from-amber-200/80 to-orange-100/80',
  'from-emerald-200/80 to-teal-100/80', 'from-blue-200/80 to-sky-100/80', 'from-purple-200/80 to-fuchsia-100/80'
];

export default function KanjiPage() {
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedKanji, setSelectedKanji] = useState<Kanji | null>(null);
  
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAdding, setIsAdding] = useState(false);
  const [newKanji, setNewKanji] = useState({ kanji: '', hanViet: '', meaningVi: '', onyomi: '', kunyomi: '', exampleJa: '', exampleVi: '' });

  const fetchKanji = async () => {
    try {
      setError(''); 
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const sysRes = await axios.get('/kanji', { headers });
      let allKanji = sysRes.data || [];

      if (token) {
        try {
          const userRes = await axios.get('/kanji/custom', { headers });
          allKanji = [...allKanji, ...(userRes.data || [])];
        } catch (userError) {
          console.log("Bỏ qua Kanji cá nhân.");
        }
      }
      setKanjiList(allKanji);
    } catch (err: any) {
      console.error(err);
      setError('Không thể tải dữ liệu Kanji hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKanji(); }, []);

  const handleAddKanji = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert("Bạn cần đăng nhập để thêm Kanji cá nhân!");
        return;
      }
      await axios.post('/kanji/custom', newKanji, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAdding(false);
      setNewKanji({ kanji: '', hanViet: '', meaningVi: '', onyomi: '', kunyomi: '', exampleJa: '', exampleVi: '' });
      fetchKanji();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi thêm Kanji');
    }
  };

  const filteredKanji = useMemo(() => {
    return kanjiList.filter((k) => {
      const matchLevel = filterLevel === 'ALL' || k.level === filterLevel;
      const searchLower = searchQuery.toLowerCase();
      
      const dictData = kanjiData[k.kanji];

      const matchSearch = 
        k.kanji.includes(searchQuery) || 
        (k.hanViet && k.hanViet.toLowerCase().includes(searchLower)) ||
        (dictData && dictData.hanViet.toLowerCase().includes(searchLower)) ||
        (k.meaningVi && k.meaningVi.toLowerCase().includes(searchLower));
      return matchLevel && matchSearch;
    });
  }, [kanjiList, filterLevel, searchQuery]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-nunito text-[#8B5A2B]">Đang tải dữ liệu...</div>;

  return (
    <main className="min-h-screen py-20 px-4 font-nunito relative">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header & Công cụ */}
        <div className="flex flex-col gap-6 mb-10 bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-white/50 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-[#8B5A2B]">Thư viện Kanji</h1>
            <div className="flex gap-3">
              <button onClick={() => setIsAdding(true)} className="bg-emerald-500 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-emerald-600 transition-colors">
                + Thêm Kanji
              </button>
              <Link href="/" className="bg-[#8B5A2B] text-white px-6 py-2.5 rounded-full hover:bg-[#6d4622] transition-colors shadow-md font-bold">
                Về trang chủ
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" placeholder="Tìm chữ Kanji, Hán Việt..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-5 py-3 bg-white border-2 border-[#8B5A2B]/20 rounded-full focus:outline-none focus:border-[#8B5A2B] text-slate-800 shadow-sm"
            />
            <div className="flex gap-2">
              {['ALL', 'N5', 'N4', 'N3'].map(level => (
                <button
                  key={level} onClick={() => setFilterLevel(level)}
                  className={`px-5 py-2.5 rounded-full font-bold transition-all shadow-sm ${
                    filterLevel === level ? 'bg-[#8B5A2B] text-white transform scale-105' : 'bg-white text-slate-600 hover:bg-gray-50'
                  }`}
                >
                  {level === 'ALL' ? 'Tất cả' : level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="bg-red-50/90 text-red-500 p-4 rounded-xl mb-6 font-bold">{error}</div>}

        {/* GRID KANJI (QUAY LẠI 5 CỘT) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredKanji.map((item, index) => {
            const gradient = cardGradients[index % cardGradients.length];
            
            // Lấy dữ liệu từ điển mini (nếu có)
            const dictData = kanjiData[item.kanji];
            const displayWord = dictData?.words[0] || (item.words && item.words.length > 0 ? item.words[0] : null);

            return (
              <motion.div 
                key={item.id} 
                whileHover={{ y: -8 }}
                className="group bg-white/80 backdrop-blur-lg rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-white/60 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col relative"
                onClick={() => setSelectedKanji(item)}
              >
                <div className={`h-32 w-full bg-gradient-to-br ${gradient} relative flex items-center justify-center overflow-hidden`}>
                  <span className="text-7xl font-serif text-[#4A2F1D]/90 drop-shadow-md relative z-10 transform group-hover:scale-110 transition-transform duration-500">{item.kanji}</span>
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/80 backdrop-blur-md text-[#8B5A2B] text-[10px] font-extrabold rounded-full shadow-sm">{item.level}</span>
                </div>
                
                <div className="p-4 flex flex-col items-center text-center w-full">
                  {/* CHỈ HIỂN THỊ 1 TỪ GHÉP ĐẠI DIỆN */}
                  <div className="text-sm text-[#8B5A2B] font-medium mb-4 h-12 flex flex-col justify-center">
                    {displayWord ? (
                      <>
                        <span className="font-bold text-lg text-slate-800">{displayWord.split(' (')[0]}</span>
                        <span className="text-[10px] text-slate-500">
                          {displayWord.split(' (')[1]?.replace(')', '') || (item.words && item.words[1]) || ''}
                        </span>
                      </>
                    ) : (
                      <span className="italic text-slate-400">(Chưa có ví dụ)</span>
                    )}
                  </div>

                  <motion.div 
                    whileHover={{ scale: 1.05, backgroundColor: '#FFF0E5' }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 bg-[#FFF9F2] text-[#8B5A2B] rounded-full border-2 border-[#8B5A2B]/20 font-quicksand font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm"
                  >
                    Chi tiết <span className="text-base">🔍</span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* MODAL CHI TIẾT */}
      <AnimatePresence>
        {selectedKanji && (() => {
          const dictData = kanjiData[selectedKanji.kanji];
          const displayHanViet = dictData?.hanViet || selectedKanji.hanViet;
          const displayWords = dictData?.words || selectedKanji.words || [];

          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A2F1D]/40 backdrop-blur-md p-4" onClick={() => setSelectedKanji(null)}>
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 max-w-3xl w-full shadow-2xl border-2 border-white relative max-h-[90vh] overflow-y-auto">
                
                <button onClick={() => setSelectedKanji(null)} className="absolute top-6 right-8 text-slate-400 hover:text-red-500 font-bold text-4xl transition-colors">&times;</button>
                
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                  <div className="flex flex-col items-center w-full md:w-1/3">
                    <div className="w-40 h-40 bg-gradient-to-br from-[#FFF9F2] to-[#FFE5D9] rounded-[2rem] flex items-center justify-center shadow-inner mb-6 border-2 border-white">
                      <span className="text-[100px] font-serif text-[#4A2F1D] drop-shadow-lg leading-none">{selectedKanji.kanji}</span>
                    </div>
                    <div className="flex gap-3">
                      {selectedKanji.strokeCount && (
                        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Số nét</span>
                          <span className="text-xl font-black text-[#8B5A2B]">{selectedKanji.strokeCount}</span>
                        </div>
                      )}
                      {selectedKanji.radical && (
                        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bộ thủ</span>
                          <span className="text-xl font-black text-[#8B5A2B]">{selectedKanji.radical}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-2/3 text-left flex flex-col gap-6">
                    <div>
                      <h2 className="text-5xl font-playfair font-bold text-[#8B5A2B] mb-4 flex items-center gap-4">
                        {displayHanViet || '---'}
                        <span className="text-xs font-nunito bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full mt-2">{selectedKanji.level}</span>
                      </h2>
                    </div>
                    
                    {displayWords && displayWords.length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg mb-3 flex items-center gap-2">
                          <span className="text-xl">🧩</span> Từ ghép
                        </h4>
                        <div className="flex flex-col gap-2">
                          {displayWords.map((word, i) => {
                            const [jp, vi] = word.includes(' (') ? word.split(' (') : [word, ''];
                            return (
                              <motion.div 
                                key={i} 
                                whileHover={{ x: 5 }}
                                className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm"
                              >
                                <span className="text-2xl font-serif font-bold text-[#4A2F1D] min-w-[60px]">{jp}</span>
                                <span className="text-slate-600 font-medium">
                                  {vi ? vi.replace(')', '') : 'Đang cập nhật nghĩa...'}
                                </span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Âm Onyomi & Kunyomi (Đã chia thành các nút nhỏ) */}
                    <div className="bg-[#FFF9F2] rounded-[1.5rem] p-6 border border-[#8B5A2B]/10 shadow-inner flex flex-col gap-6">
                      
                      {/* ONYOMI */}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-[#8B5A2B] text-white text-xs font-bold px-3 py-1 rounded-lg">ON</span>
                          <span className="text-sm font-bold text-slate-400">Âm Onyomi</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedKanji.onyomi ? selectedKanji.onyomi.split(/[,，]/).map((on, idx) => (
                            <span key={idx} className="bg-white px-4 py-1.5 rounded-full text-lg font-medium text-slate-800 border border-slate-200 shadow-sm">
                              {on.trim()}
                            </span>
                          )) : <span className="text-slate-400 italic">---</span>}
                        </div>
                      </div>

                      {/* KUNYOMI */}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-[#8B5A2B] text-white text-xs font-bold px-3 py-1 rounded-lg">KUN</span>
                          <span className="text-sm font-bold text-slate-400">Âm Kunyomi</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedKanji.kunyomi ? selectedKanji.kunyomi.split(/[,，]/).map((kun, idx) => (
                            <span key={idx} className="bg-white px-4 py-1.5 rounded-full text-lg font-medium text-slate-800 border border-slate-200 shadow-sm">
                              {kun.trim()}
                            </span>
                          )) : <span className="text-slate-400 italic">---</span>}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* MODAL THÊM KANJI */}
      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A2F1D]/40 backdrop-blur-md p-4" onClick={() => setIsAdding(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border-2 border-white relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsAdding(false)} className="absolute top-5 right-6 text-slate-400 hover:text-red-500 font-bold text-3xl transition-colors">&times;</button>
              
              <h2 className="text-3xl font-playfair font-bold text-[#8B5A2B] mb-6 text-center">Thêm Kanji Cá Nhân</h2>
              
              <form onSubmit={handleAddKanji} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Chữ Kanji (VD: 日)" value={newKanji.kanji} onChange={e => setNewKanji({...newKanji, kanji: e.target.value})} className="col-span-2 px-4 py-3 bg-white border-2 border-[#8B5A2B]/30 rounded-xl focus:border-[#8B5A2B] outline-none font-bold text-xl text-center text-slate-800 placeholder-slate-400" />
                  <input placeholder="Hán Việt" value={newKanji.hanViet} onChange={e => setNewKanji({...newKanji, hanViet: e.target.value})} className="col-span-2 px-4 py-2 bg-white border-2 border-[#8B5A2B]/30 rounded-xl focus:border-[#8B5A2B] outline-none text-slate-800 placeholder-slate-400" />
                  
                  <textarea 
                    required 
                    placeholder="Nghĩa tiếng Việt (Có thể xuống dòng)" 
                    value={newKanji.meaningVi} 
                    onChange={e => setNewKanji({...newKanji, meaningVi: e.target.value})} 
                    rows={3}
                    className="col-span-2 px-4 py-2 bg-white border-2 border-[#8B5A2B]/30 rounded-xl focus:border-[#8B5A2B] outline-none text-slate-800 placeholder-slate-400 resize-none" 
                  />

                  <input placeholder="Âm On" value={newKanji.onyomi} onChange={e => setNewKanji({...newKanji, onyomi: e.target.value})} className="px-4 py-2 bg-white border-2 border-[#8B5A2B]/30 rounded-xl focus:border-[#8B5A2B] outline-none text-slate-800 placeholder-slate-400" />
                  <input placeholder="Âm Kun" value={newKanji.kunyomi} onChange={e => setNewKanji({...newKanji, kunyomi: e.target.value})} className="px-4 py-2 bg-white border-2 border-[#8B5A2B]/30 rounded-xl focus:border-[#8B5A2B] outline-none text-slate-800 placeholder-slate-400" />
                </div>
                <button type="submit" className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-md transition-colors">
                  Lưu Kanji
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}