'use client';
import React from 'react';
import { DeckBuilder } from '@/components/deck/DeckBuilder';
import { DeckDashboard } from '@/components/deck/DeckDashboard';
import { DeckTabs } from '@/components/deck/DeckTabs';
import { useDeckTabs } from '@/hooks/useDeckTabs';

export default function Home() {
  const { tabs, activeTabId, addTab, deleteTab, switchTab } = useDeckTabs();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <DeckTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onChangeTab={switchTab}
        onAddTab={addTab}
        onDeleteTab={deleteTab}
      >
        <div className="h-full flex gap-4 px-4 py-2 min-h-0">{" "}
          {/* 左側: デッキビルダー */}
          <div className="w-3/5 min-h-0 flex flex-col">
            <DeckBuilder />
          </div>

          {/* 右側: DeckDashboard */}
          <div className="flex-1 flex flex-col gap-4 py-2">
            <DeckDashboard />
          </div>
        </div>
      </DeckTabs>
    </div>
  );
}
