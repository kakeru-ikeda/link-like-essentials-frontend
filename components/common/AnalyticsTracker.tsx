'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logPageView } from '@/services/infrastructure/analyticsService';

/**
 * ページ遷移を自動追跡するコンポーネント
 * Layout に配置してアプリ全体のページビューを記録
 */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      logPageView(pathname);
    }
  }, [pathname]);

  return null;
}
