// frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  // Đã sửa lại đường dẫn quét file cho chuẩn với Next.js App Router (thay vì ./src)
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bakery: {
          pink: '#FFD1DC',      // Soft strawberry
          cream: '#FFFDD0',     // Custard cream
          vanilla: '#FDFBF7',   // Main background
          yellow: '#FFE5B4',    // Warm butter
          brown: '#8B5A2B',     // Cookie crust (Text & Accent)
          green: '#D4EDDA',     // Matcha green
          peach: '#FFDAB9',     // Pastel peach
        },
        fontFamily: {
        // Định nghĩa các class font chữ dựa trên biến CSS ở layout.tsx
        nunito: ['var(--font-nunito)', 'sans-serif'],
        quicksand: ['var(--font-quicksand)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
        },
      },
      borderRadius: {
        bakery: '1.5rem',
      },
      boxShadow: {
        bakery: '0 6px 0 0 #D4A373',
      },
    },
  },
  plugins: [],
};
export default config;