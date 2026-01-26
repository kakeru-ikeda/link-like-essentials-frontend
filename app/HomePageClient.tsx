'use client';
import React from 'react';
import { DeckBuilder } from '@/components/deck-builder/DeckBuilder';
import { DeckDashboard } from '@/components/deck-builder/DeckDashboard';
import { DeckTabs } from '@/components/deck-builder/DeckTabs';
import { useDeckTabs } from '@/hooks/deck/useDeckTabs';
import { useDeck } from '@/hooks/deck/useDeck';
import { useResponsiveDevice } from '@/hooks/ui/useResponsiveDevice';

export function HomePageClient() {
  const { tabs, activeTabId, addTab, deleteTab, switchTab } = useDeckTabs();
  const { isFriendSlotEnabled } = useDeck();
  const { isSp } = useResponsiveDevice();

  // DeckBuilderの必要幅を計算
  const deckBuilderWidth = React.useMemo(() => {
    if (isSp) {
      return '100%';
    }
    if (isFriendSlotEnabled) {
      // フレンド有効: 4グループ分の幅 + 余裕
      return 'clamp(896px, 65%, 1280px)';
    } else {
      // フレンド無効: 3グループ分の幅
      return 'clamp(640px, 58%, 928px)';
    }
  }, [isFriendSlotEnabled, isSp]);

  return (
    <div className={isSp ? 'min-h-screen flex flex-col bg-white' : 'h-screen flex flex-col overflow-hidden'}>
      <DeckTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onChangeTab={switchTab}
        onAddTab={addTab}
        onDeleteTab={deleteTab}
      >
        <div className={isSp ? 'flex flex-col gap-3 px-3 py-3 min-h-0 overflow-y-auto' : 'h-full flex gap-4 px-4 py-2 min-h-0 overflow-hidden'}>
          {/* 上部: デッキビルダー（SPは全幅） */}
          <div
            className={isSp ? 'w-full min-h-0 flex flex-col' : 'min-h-0 flex flex-col overflow-visible transition-all duration-300'}
            style={{
              width: deckBuilderWidth,
              flexShrink: isSp ? 1 : 0,
            }}
          >
            <DeckBuilder />
          </div>

          {/* 下部: DeckDashboard（SPは下段配置） */}
          <div className={isSp ? 'w-full min-h-0 flex flex-col gap-3' : 'flex-1 min-w-0 flex flex-col gap-4 py-2'}>
            <DeckDashboard />
          </div>
        </div>
      </DeckTabs>
    </div>
  );
}
