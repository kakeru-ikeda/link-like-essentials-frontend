/**
 * Sanity Studio ルートページ
 *
 * /studio/* へのアクセスで Sanity Studio を表示する。
 * basePath は sanity.config.ts で '/studio' に設定している。
 */
import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config';

export const dynamic = 'force-dynamic';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
