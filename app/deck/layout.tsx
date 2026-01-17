import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/utils/metadataUtils';

export const metadata: Metadata = buildPageMetadata({
  title: 'デッキビルダー',
  description: 'Link! Like! ラブライブ! のデッキを作成・管理できます。',
});

export default function DeckLayout({ children }: { children: ReactNode }) {
  return children;
}
