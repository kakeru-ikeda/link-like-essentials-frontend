'use client';

import React, { useState } from 'react';
import { DeckBuilder } from '@/components/deck/DeckBuilder';
import { DeckDashboard } from '@/components/deck/DeckDashboard';
import { DeckTabs } from '@/components/deck/DeckTabs';
import { Button } from '@/components/common/Button';
import { useDeck } from '@/hooks/useDeck';

export default function Home() {
  const { clearAllCards, saveDeck } = useDeck();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* TODO: DeckTabsにprops渡す */}
      <DeckTabs
        tabs={[]}
        activeTabId={''}
        onChangeTab={() => {}}
        onAddTab={() => {}}
        onDeleteTab={() => {}}
      >
        <div className="h-full flex gap-4 px-4 py-2 min-h-0">{" "}
          {/* 左側: デッキビルダー */}
          <div className="w-3/5 min-h-0 flex items-start">
            <DeckBuilder />
          </div>

          {/* 右側: 今後使用するエリア + ボタン */}
          <div className="flex-1 flex flex-col gap-4 pt-4">
            {/* DeckDashboard */}
            <DeckDashboard />
            
            {/* ボタン */}
            <div className="flex flex-col gap-2">
              <Button variant="secondary" onClick={clearAllCards}>
                デッキをクリア
              </Button>
              <Button onClick={saveDeck}>保存</Button>
            </div>
          </div>
        </div>
      </DeckTabs>
    </div>
  );
}
