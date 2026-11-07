// app/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F2EFE9] p-8 font-serif text-[#4A3B32]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10">
          <p className="text-[#A38D82] text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
            Chào buổi tối <span>🌸</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Hôm nay mình cùng tưới vườn chữ nhé</h1>
          <p className="text-[#8E7D73] text-lg font-sans">
            Mỗi từ mới là một hạt giống — chăm đều tay, vườn sẽ nở hoa.
          </p>
        </header>

        {/* Hàng 1: Chuỗi ngày học & Tiến độ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Thẻ Chuỗi ngày học */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E6E0D8] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#B58A8A] font-sans font-bold mb-6">
                <span>🔥</span> Chuỗi ngày học
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-6xl font-bold">0</span>
                <span className="text-xl">ngày</span>
              </div>
            </div>
            <div>
              <div className="flex gap-2 mb-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-2 flex-1 bg-[#F0EBE1] rounded-full" />
                ))}
              </div>
              <p className="text-xs text-[#A38D82] font-sans">7 ngày gần nhất</p>
            </div>
          </div>

          {/* Thẻ Tiến độ (Chiếm 2 cột) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E6E0D8] md:col-span-2 flex flex-col md:flex-row items-center gap-8">
            {/* Biểu đồ tròn (Fake) */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path className="text-[#F0EBE1]" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#B58A8A]" strokeDasharray="30, 100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#7C8C45]" strokeDasharray="40, 100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            </div>

            <div className="flex-1 w-full">
              <h3 className="text-xl font-bold mb-6">Tiến độ khu vườn · 10 từ</h3>
              <div className="space-y-4 font-sans text-sm">
                <div>
                  <div className="flex justify-between mb-1"><span className="flex items-center gap-2"><span className="text-green-600">❀</span> Đã thuộc</span> <span>3</span></div>
                  <div className="w-full bg-[#F0EBE1] h-2 rounded-full"><div className="bg-[#7C8C45] h-2 rounded-full w-[30%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1"><span className="flex items-center gap-2"><span className="text-pink-600">🌱</span> Đang học</span> <span>4</span></div>
                  <div className="w-full bg-[#F0EBE1] h-2 rounded-full"><div className="bg-[#B58A8A] h-2 rounded-full w-[40%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1"><span className="flex items-center gap-2"><span className="text-gray-400">🍂</span> Cần ôn lại</span> <span>3</span></div>
                  <div className="w-full bg-[#F0EBE1] h-2 rounded-full"><div className="bg-[#C4B5A5] h-2 rounded-full w-[30%]"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hàng 2: Các nút tính năng */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E6E0D8] cursor-pointer group flex flex-col justify-between h-32">
            <div>
              <h3 className="text-xl font-bold mb-2">Thêm từ mới</h3>
              <p className="text-[#8E7D73] font-sans text-sm">Gieo hạt giống mới</p>
            </div>
            <div className="text-right text-[#8E7D73] group-hover:text-[#7C8C45] transition-colors">&rarr;</div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E6E0D8] cursor-pointer group flex flex-col justify-between h-32">
            <div>
              <h3 className="text-xl font-bold mb-2">Lật thẻ ôn tập</h3>
              <p className="text-[#8E7D73] font-sans text-sm">Ôn lại nhẹ nhàng</p>
            </div>
            <div className="text-right text-[#8E7D73] group-hover:text-[#B58A8A] transition-colors">&rarr;</div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E6E0D8] cursor-pointer group flex flex-col justify-between h-32">
            <div>
              <h3 className="text-xl font-bold mb-2">Luyện tập</h3>
              <p className="text-[#8E7D73] font-sans text-sm">Trắc nghiệm, nghe, ghép</p>
            </div>
            <div className="text-right text-[#8E7D73] group-hover:text-[#B58A8A] transition-colors">&rarr;</div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}