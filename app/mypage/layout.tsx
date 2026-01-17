import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/utils/metadataUtils';

export const metadata: Metadata = buildPageMetadata({
  title: 'マイページ',
  description: 'プロフィールや投稿デッキ、いいねしたデッキを確認できます。',
});

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return children;
}
