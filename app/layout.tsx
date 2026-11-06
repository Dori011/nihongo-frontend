import { PenguinCompanion } from '@/components/mascot/PenguinCompanion';
import { Nunito, Quicksand, Playfair_Display } from 'next/font/google';
import './globals.css';

// 1. Font chữ chính (Nội dung, đoạn văn)
const nunito = Nunito({ 
  subsets: ['latin', 'vietnamese'], 
  variable: '--font-nunito' 
});

// 2. Font chữ phụ (Nút bấm, menu)
const quicksand = Quicksand({ 
  subsets: ['latin', 'vietnamese'], 
  variable: '--font-quicksand' 
});

// 3. Font tiêu đề (Heading)
const playfair = Playfair_Display({ 
  subsets: ['latin', 'vietnamese'], 
  variable: '--font-playfair' 
});

export const metadata = {
  title: 'Nihongo - Góc học tập nhỏ xinh',
  description: 'Học tiếng Nhật cùng chú chim cánh cụt',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${nunito.variable} ${quicksand.variable} ${playfair.variable}`}>
      <body className="font-nunito bg-[#FDFBF7] text-slate-700 antialiased">
        {children}
        <PenguinCompanion bambooBalance={10} />
      </body>
    </html>
  );
}