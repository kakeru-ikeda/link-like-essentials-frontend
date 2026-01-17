import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/utils/metadataUtils';

export const metadata: Metadata = buildPageMetadata({
  title: 'ログイン / 登録',
  description: 'メールアドレスでログイン・登録ができます。',
});

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
