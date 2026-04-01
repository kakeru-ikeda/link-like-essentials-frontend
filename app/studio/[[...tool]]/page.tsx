/**
 * Sanity Studio ルートページ
 *
 * /studio/* へのアクセスで Sanity Studio を表示する。
 * basePath は sanity.config.ts で '/studio' に設定している。
 * sanity パッケージは createContext 等 Client API を使用するため 'use client' が必要。
 */
'use client';
import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config';

export const dynamic = 'force-dynamic';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
