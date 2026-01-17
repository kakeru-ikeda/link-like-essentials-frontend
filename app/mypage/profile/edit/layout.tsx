import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/utils/metadataUtils';

export const metadata: Metadata = buildPageMetadata({
  title: 'プロフィール編集',
  description: 'プロフィール情報を作成・更新できます。',
});

export default function ProfileEditLayout({ children }: { children: ReactNode }) {
  return children;
}
