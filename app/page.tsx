'use client';

import React from 'react';
import { DeckBuilder } from '@/components/deck/DeckBuilder';
import { Button } from '@/components/common/Button';
import { useDeck } from '@/hooks/useDeck';

export default function Home() {
  const { clearAllCards, saveDeck } = useDeck();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex gap-4 px-4 py-2 min-h-0">
        {/* 左側: デッキビルダー */}
        <div className="w-3/5 min-h-0 flex items-start">
          <DeckBuilder />
        </div>

        {/* 右側: 今後使用するエリア + ボタン */}
        <div className="flex-1 flex flex-col gap-4 pt-4">
          {/* 今後使用するエリア */}
          <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <p className="text-gray-400 text-sm">今後使用予定</p>
          </div>
          
          {/* ボタン */}
          <div className="flex flex-col gap-2">
            <Button variant="secondary" onClick={clearAllCards}>
              デッキをクリア
            </Button>
            <Button onClick={saveDeck}>保存</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
