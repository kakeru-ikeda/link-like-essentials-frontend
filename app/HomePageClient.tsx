'use client';
import React from 'react';
import { DeckBuilder } from '@/components/deck-builder/DeckBuilder';
import { DeckDashboard } from '@/components/deck-builder/DeckDashboard';
import { DeckTabs } from '@/components/deck-builder/DeckTabs';
import { useDeckTabs } from '@/hooks/deck/useDeckTabs';
import { useDeck } from '@/hooks/deck/useDeck';
import { useResponsiveDevice } from '@/hooks/ui/useResponsiveDevice';
import { getDeckSlotMapping } from '@/services/deck/deckConfigService';

export function HomePageClient() {
  const { tabs, activeTabId, addTab, deleteTab, switchTab } = useDeckTabs();
  const { deck, isFriendSlotEnabled } = useDeck();
  const { isSp } = useResponsiveDevice();

  // DeckBuilderの必要幅を上段の実際のグループ数から計算
  const deckBuilderWidth = React.useMemo(() => {
    if (isSp) return '100%';

    const mapping = getDeckSlotMapping(deck?.deckType);
    const topRowNonFriendChars = [
      ...new Set(
        mapping
          .filter((m) => m.row === 0 && m.characterName !== 'フレンド')
          .map((m) => m.characterName)
      ),
    ];
    const nonFriendCount = topRowNonFriendChars.length;
    const hasFriend =
      isFriendSlotEnabled &&
      mapping.some((m) => m.row === 0 && m.characterName === 'フレンド');

    if (nonFriendCount >= 3) {
      // 3キャラ + フレンド有無
      return hasFriend
        ? 'clamp(896px, 65%, 1280px)'
        : 'clamp(640px, 58%, 928px)';
    } else {
      // 2キャラ（BGP等）+ フレンド有無
      return hasFriend
        ? 'clamp(640px, 58%, 928px)'
        : 'clamp(640px, 58%, 928px)';
    }
  }, [deck?.deckType, isFriendSlotEnabled, isSp]);

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
