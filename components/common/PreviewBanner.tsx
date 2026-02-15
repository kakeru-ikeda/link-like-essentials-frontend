'use client';

import { isPreview, branchName } from '@/utils/env';

/**
 * プレビュー環境バナー
 *
 * プレビュー環境（developmentブランチ等）でのみ表示される警告バナー。
 * 本番環境との区別を明確にし、誤った環境での操作を防止します。
 */
export default function PreviewBanner() {
  // 本番環境やローカル開発環境では何も表示しない
  if (!isPreview) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-yellow-400 text-gray-900 px-4 py-2 text-center text-sm font-semibold shadow-md">
      <div className="flex items-center justify-center gap-2">
        <span className="text-lg" role="img" aria-label="construction">
          🚧
        </span>
        <span>プレビュー環境</span>
        {branchName && (
          <>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">ブランチ: {branchName}</span>
          </>
        )}
      </div>
    </div>
  );
}
