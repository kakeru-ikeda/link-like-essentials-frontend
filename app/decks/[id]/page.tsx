"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { PublishedDeckDetail } from '@/components/deck/PublishedDeckDetail';
import { useCompiledPublishedDeckDetail } from '@/hooks/useCompiledPublishedDeckDetail';
import { publishedDeckImportService } from '@/services/publishedDeckImportService';
import { PublishedDeckActions } from '@/components/deck/PublishedDeckActions';

const getDeckId = (param: string | string[] | undefined): string | null => {
  if (!param) return null;
  return Array.isArray(param) ? param[0] : param;
};

export default function DeckDetailPage() {
  const params = useParams();
  const deckId = getDeckId(params?.id);

  const {
    publishedDeck,
    publishedDeckLoading,
    publishedDeckError,
    compiledDeck,
    compiling,
    compileError,
  } = useCompiledPublishedDeckDetail(deckId);
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleImport = useCallback(async () => {
    if (!publishedDeck) return;
    setImporting(true);
    setImportError(null);
    try {
      await publishedDeckImportService.importToLocal(publishedDeck);
      router.push('/deck');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'インポートに失敗しました';
      setImportError(message);
    } finally {
      setImporting(false);
    }
  }, [publishedDeck, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">公開デッキ詳細</h1>
          <p className="text-sm text-gray-600">閲覧専用ビューとSNS操作を順次追加します。</p>
        </div>
        {publishedDeck && (
          <PublishedDeckActions
            deck={publishedDeck}
            compiledDeck={compiledDeck}
            onImport={handleImport}
            importing={importing}
            importError={importError}
            compiling={compiling}
          />
        )}
      </div>

      {!deckId && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          デッキIDが不正です。
        </div>
      )}

      {(publishedDeckError || compileError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {publishedDeckError || compileError}
        </div>
      )}

      {(publishedDeckLoading || compiling) && (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
          取得中...
        </div>
      )}

      {!publishedDeckLoading && publishedDeck && (
        <PublishedDeckDetail deck={publishedDeck} compiledDeck={compiledDeck} />
      )}
    </div>
  );
}
