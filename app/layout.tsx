import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';
import { Sidebar } from '@/components/common/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Link Like Essentials - デッキビルダー',
  description: 'Link! Like! ラブライブ! のカードデッキビルダー',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>
          <Sidebar>{children}</Sidebar>
        </Providers>
      </body>
    </html>
  );
}
