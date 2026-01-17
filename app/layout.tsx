import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';
import { Sidebar } from '@/components/common/Sidebar';
import { buildPageMetadata } from '@/utils/metadataUtils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  ...buildPageMetadata({ title: 'Link! Like! デッキビルダー' }),
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
