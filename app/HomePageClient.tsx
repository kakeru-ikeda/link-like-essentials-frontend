'use client';
import React from 'react';
import { DeckBuilder } from '@/components/deck/DeckBuilder';
import { DeckDashboard } from '@/components/deck/DeckDashboard';
import { DeckTabs } from '@/components/deck/DeckTabs';
import { useDeckTabs } from '@/hooks/useDeckTabs';
import { useDeck } from '@/hooks/useDeck';

export function HomePageClient() {
  const { tabs, activeTabId, addTab, deleteTab, switchTab } = useDeckTabs();
  const { isFriendSlotEnabled } = useDeck();

  // DeckBuilderの必要幅を計算
  const deckBuilderWidth = React.useMemo(() => {
    if (isFriendSlotEnabled) {
      // フレンド有効: 4グループ分の幅 + 余裕
      return 'clamp(896px, 65%, 1280px)';
    } else {
      // フレンド無効: 3グループ分の幅
      return 'clamp(640px, 58%, 928px)';
    }
  }, [isFriendSlotEnabled]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <DeckTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onChangeTab={switchTab}
        onAddTab={addTab}
        onDeleteTab={deleteTab}
      >
        <div className="h-full flex gap-4 px-4 py-2 min-h-0 overflow-hidden">
          {/* 左側: デッキビルダー */}
          <div
            className="min-h-0 flex flex-col overflow-visible transition-all duration-300"
            style={{
              width: deckBuilderWidth,
              flexShrink: 0,
            }}
          >
            <DeckBuilder />
          </div>

          {/* 右側: DeckDashboard */}
          <div className="flex-1 min-w-0 flex flex-col gap-4 py-2">
            <DeckDashboard />
          </div>
        </div>
      </DeckTabs>
    </div>
  );
}
