'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type Theme = 'default' | 'dark' | 'pink' | 'purple' | 'blue' | 'green' | 'light-green' | 'yellow' | 'beach';

export function Background() {
  const [theme, setTheme] = useState<Theme>('beach'); 
  const [isOpen, setIsOpen] = useState(false);
  const [customBg, setCustomBg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Khôi phục cài đặt từ localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    if (savedTheme) setTheme(savedTheme);

    const savedCustom = localStorage.getItem('app-custom-bg');
    if (savedCustom) setCustomBg(savedCustom);
  }, []);

  // Hàm đổi màu nền
  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    setCustomBg(null);
    localStorage.removeItem('app-custom-bg');
    setTimeout(() => setIsOpen(false), 200); 
  };

  // Hàm xử lý upload ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCustomBg(base64String);
        localStorage.setItem('app-custom-bg', base64String);
        setIsOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const colors: { id: Theme; label: string; color: string; }[] = [
    { id: 'default', label: 'Mặc định', color: '#FDFBF7' },
    { id: 'pink', label: 'Hồng đào', color: '#F8B8B9' },
    { id: 'purple', label: 'Tím oải hương', color: '#CCB5D5' },
    { id: 'blue', label: 'Xanh phi yến', color: '#A0AEDF' },
    { id: 'green', label: 'Xanh lá đậm', color: '#90AD6B' },
    { id: 'light-green', label: 'Xanh mạ non', color: '#D2DB98' },
    { id: 'yellow', label: 'Vàng nắng', color: '#F4E279' },
    { id: 'dark', label: 'Chế độ tối', color: '#1e293b' },
  ];

  const bgStyle = {
    backgroundImage: customBg 
      ? `url(${customBg})` 
      : theme === 'beach' ? "url('/beach-bg.jpg')" 
      : 'none',
    backgroundColor: !customBg && theme !== 'beach'
      ? colors.find(c => c.id === theme)?.color || '#FDFBF7' 
      : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  };

  return (
    <>
      {/* LỚP BACKGROUND CHÍNH */}
      <div 
        className="fixed inset-0 -z-50 transition-all duration-700 ease-in-out"
        style={bgStyle}
      />

      {/* VÙNG KÉO THẢ NÚT BẢNG MÀU */}
      <motion.div 
        drag 
        dragMomentum={false} // Tắt quán tính để thả đâu đứng đó
        dragElastic={0.1}
        className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }} // Quan trọng để kéo thả mượt trên mobile
      >
        
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          className="hidden" 
        />

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              // Ngăn việc kéo menu làm di chuyển cả khung chứa
              onPointerDown={(e) => e.stopPropagation()} 
              className="bg-white/95 backdrop-blur-xl p-3 rounded-3xl shadow-2xl border border-white/60 flex flex-col gap-1.5 w-48 max-h-[70vh] overflow-y-auto cursor-default"
            >
              <p className="text-[10px] font-extrabold text-slate-400 text-center mb-1 uppercase tracking-widest pointer-events-none">Bảng màu</p>
              
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => changeTheme('beach')}
                className={`text-left px-3 py-2 rounded-2xl text-sm font-bold transition-all flex items-center gap-3 ${theme === 'beach' && !customBg ? 'bg-blue-50 ring-2 ring-blue-300 text-[#8B5A2B]' : 'hover:bg-gray-100 text-slate-600'}`}
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-300 to-amber-200 flex-shrink-0 shadow-sm border border-white"></span> 
                Nền Bãi Biển
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: '#ecfdf5' }} whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="text-left px-3 py-2 rounded-2xl text-sm font-bold text-emerald-600 transition-all flex items-center gap-3 border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-white/50 mb-2"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg leading-none">+</div> 
                Tự thêm ảnh
              </motion.button>

              {colors.map((item, index) => (
                <motion.button 
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => changeTheme(item.id)}
                  className={`text-left px-3 py-2 rounded-2xl text-sm font-bold transition-all flex items-center gap-3 ${theme === item.id && !customBg ? 'bg-slate-100 ring-2 ring-slate-300 text-slate-800' : 'hover:bg-gray-100 text-slate-600'}`}
                >
                  <span className="w-5 h-5 rounded-full flex-shrink-0 shadow-sm border border-black/10" style={{ backgroundColor: item.color }}></span> 
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* NÚT BẤM CHÍNH */}
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-white/60 flex items-center justify-center text-2xl transition-colors"
          title="Kéo thả để di chuyển, bấm để mở bảng màu"
        >
          🎨
        </motion.button>
      </motion.div>
    </>
  );
}