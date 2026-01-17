import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/utils/metadataUtils';

export const metadata: Metadata = buildPageMetadata({
  title: 'カード一覧',
  description: 'カードを検索・閲覧できます。豊富なフィルター機能でかんたんに目的のカードを見つけられます。',
});

export default function CardsLayout({ children }: { children: ReactNode }) {
  return children;
}
