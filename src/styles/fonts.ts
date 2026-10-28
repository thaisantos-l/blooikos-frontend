import localFont from 'next/font/local';

export const sora = localFont({
  src: '../assets/fonts/sora-latin-variable.woff2',
  weight: '100 800',
  style: 'normal',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
  variable: '--font-sora',
});

// Preparada para a navegação futura; não aplicada pela página temporária.
export const inter = localFont({
  src: '../assets/fonts/inter-latin-variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
  variable: '--font-inter',
  preload: false,
});
