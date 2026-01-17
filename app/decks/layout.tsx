import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/utils/metadataUtils';

export const metadata: Metadata = buildPageMetadata({
  title: '投稿デッキ',
  description: '公開されたデッキを閲覧できます。お気に入りのデッキをインポートして、自分のデッキとして保存もできます。',
});

export default function DecksLayout({ children }: { children: ReactNode }) {
  return children;
}
