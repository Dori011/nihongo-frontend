import { MascotProvider } from '@/components/mascot/MascotProvider';
import { PenguinCompanion } from '@/components/mascot/PenguinCompanion';
import { Background } from '@/components/Background';
import { Sidebar } from '@/components/Sidebar';
import { Nunito, Quicksand, Playfair_Display } from 'next/font/google';
import './globals.css';

const nunito = Nunito({ subsets: ['latin', 'vietnamese'], variable: '--font-nunito' });
const quicksand = Quicksand({ subsets: ['latin', 'vietnamese'], variable: '--font-quicksand' });
const playfair = Playfair_Display({ subsets: ['latin', 'vietnamese'], variable: '--font-playfair' });

export const metadata = { title: 'Nihongo', description: 'Học tiếng Nhật' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${nunito.variable} ${quicksand.variable} ${playfair.variable}`}>
      {/* Xóa hết class màu nền ở body */}
      <body className="antialiased text-slate-700">
        
        <Background />

        <MascotProvider>
          <Sidebar />
          
          {/* Dùng pl-64 (padding-left) thay vì ml-64 (margin-left) */}
          <main className="md:pl-64 min-h-screen w-full relative">
            {children}
          </main>
          
          <PenguinCompanion bambooBalance={10} />
        </MascotProvider>
      </body>
    </html>
  );
}