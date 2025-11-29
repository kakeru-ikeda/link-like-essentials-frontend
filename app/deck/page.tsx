'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DeckPage() {
  const router = useRouter();

  useEffect(() => {
    // ルートページにリダイレクト
    router.replace('/');
  }, [router]);

  return null;
}
