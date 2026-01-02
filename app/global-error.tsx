'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
        <div className="space-y-4 px-6 text-center">
          <h2 className="text-xl font-semibold">エラーが発生しました</h2>
          <p className="text-sm text-gray-600">ページの再読み込みをお試しください。</p>
          <button
            type="button"
            onClick={reset}
            className="rounded bg-black px-4 py-2 text-white shadow hover:bg-black/80"
          >
            再試行
          </button>
        </div>
      </body>
    </html>
  );
}
