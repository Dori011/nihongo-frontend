// frontend/src/components/kanji/KanjiStudyCard.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '@/lib/axios';
import axiosInstance from '@/lib/axios';

interface KanjiData {
  id: string;
  kanji: string;
  hanViet: string;
  meaningVi: string;
  onyomi: string;
  kunyomi: string;
  strokeCount: number;
  radical: string;
  exampleSentence: string;
  exampleMeaning: string;
  status: 'NOT_VIEWED' | 'OPENED' | 'IN_PROGRESS' | 'INCOMPLETE' | 'COMPLETED';
}

export const KanjiStudyCard: React.FC<{ kanji: KanjiData; onUpdate: () => void }> = ({ kanji, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mở chi tiết Kanji và báo Backend đổi trạng thái
  const handleOpenDetail = async () => {
    setIsOpen(true);
    if (kanji.status !== 'COMPLETED') {
      await axiosInstance.post(`/kanji/${kanji.id}/open`);
      onUpdate();
    }
  };

  // Xác nhận đã học xong
  const handleConfirmCompleted = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`/kanji/${kanji.id}/complete`);
      onUpdate();
      setIsOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Card mặt trước */}
      <div className="w-full bg-bakery-vanilla border-2 border-bakery-brown/20 rounded-bakery p-5 shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-start">
          <span className="text-4xl font-bold text-bakery-brown">{kanji.kanji}</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
            kanji.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-bakery-pink text-bakery-brown'
          }`}>
            {kanji.status === 'COMPLETED' ? 'Đã hoàn thành' : kanji.hanViet}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-700">{kanji.meaningVi}</p>

        {/* Nút bấm Pudding để mở rộng chi tiết */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleOpenDetail}
            className="bg-amber-100 hover:bg-amber-200 border-2 border-amber-400 text-amber-900 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition active:scale-95"
          >
            🍮 Xem chi tiết
          </button>
        </div>
      </div>

      {/* Modal Split View 2/3 màn hình */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm p-4">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full md:w-2/3 h-full max-h-[90vh] bg-bakery-vanilla border-4 border-bakery-brown rounded-bakery p-8 overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center border-b-2 border-bakery-brown/10 pb-4">
                  <h2 className="text-3xl font-extrabold text-bakery-brown flex items-center gap-3">
                    <span className="text-6xl">{kanji.kanji}</span>
                    <div>
                      <div className="text-xl text-amber-800">{kanji.hanViet}</div>
                      <div className="text-sm text-gray-500">Số nét: {kanji.strokeCount} | Bộ thủ: {kanji.radical}</div>
                    </div>
                  </h2>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      if (kanji.status !== 'COMPLETED') axios.post(`/kanji/${kanji.id}/leave`).then(onUpdate);
                    }}
                    className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-6 space-y-4 text-bakery-brown">
                  <div className="grid grid-cols-2 gap-4 bg-white/60 p-4 rounded-xl border border-bakery-brown/10">
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase">Âm Onyomi</div>
                      <div className="text-md font-semibold">{kanji.onyomi}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase">Âm Kunyomi</div>
                      <div className="text-md font-semibold">{kanji.kunyomi}</div>
                    </div>
                  </div>

                  <div className="bg-white/60 p-4 rounded-xl border border-bakery-brown/10">
                    <div className="text-xs font-bold text-gray-400 uppercase">Ví dụ & Ngữ cảnh</div>
                    <div className="text-lg font-medium mt-1">{kanji.exampleSentence}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{kanji.exampleMeaning}</div>
                  </div>
                </div>
              </div>

              {/* Khu vực hành động xác nhận */}
              <div className="pt-6 border-t-2 border-bakery-brown/10 flex justify-end gap-3">
                <button
                  disabled={loading || kanji.status === 'COMPLETED'}
                  onClick={handleConfirmCompleted}
                  className={`px-6 py-3 rounded-full font-bold shadow-bakery transition ${
                    kanji.status === 'COMPLETED'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-emerald-400 hover:bg-emerald-500 text-emerald-950 active:scale-95'
                  }`}
                >
                  {kanji.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Xác nhận đã học xong ✨'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};