import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/utils/metadataUtils';

export const metadata: Metadata = buildPageMetadata({
  title: 'デッキ詳細',
  description: '公開されたデッキの詳細情報を確認できます。',
});

export default function DeckDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
