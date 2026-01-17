import type { Metadata } from 'next';
import { HomePageClient } from './HomePageClient';
import { buildPageMetadata } from '@/utils/metadataUtils';

export const metadata: Metadata = buildPageMetadata({
  description: 'スクールアイドルステージ（スクステ）のカードデッキを簡単に作成・管理・共有できるツールです。',
});

export default function Home() {
  return <HomePageClient />;
}
