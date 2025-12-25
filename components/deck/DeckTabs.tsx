'use client';

import { Deck } from '@/models/Deck';
import React from 'react';

interface DeckTabsProps {
  tabs: Pick<Deck, 'id' | 'name'>[];
  activeTabId: string;
  onChangeTab: (id: string) => void;
  onAddTab: () => void;
  onDeleteTab: (id: string) => void;
  children: React.ReactNode;
}

export const DeckTabs: React.FC<DeckTabsProps> = ({ 
  tabs,
  activeTabId,
  onChangeTab,
  onAddTab,
  onDeleteTab,
  children 
}) => {
  
  return (
    <div className="flex h-full overflow-hidden">
      {/* メインコンテンツエリア */}
      <div className="flex-1 h-full overflow-x-visible overflow-y-auto">
        {children}
      </div>

      {/* 右側縦タブ */}
      <div className="w-12 border-l border-gray-200 bg-gray-50 h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-1">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <div key={tab.id} className="relative group">
                <button
                  onClick={() => onChangeTab(tab.id)}
                  className={`w-full px-2 py-5 rounded-md text-sm font-medium transition ${
                    activeTabId === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                  style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                >
                  {tab.name}
                </button>
                {/* 削除ボタン（ホバー時のみ表示） */}
                {tabs.length > 1 && (
                  <button
                    onClick={() => onDeleteTab(tab.id)}
                    className="absolute -top-1 -left-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="デッキを削除"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 新規デッキ追加ボタン（下部固定） */}
        <div className="p-1 border-t border-gray-200">
          <button
            onClick={onAddTab}
            className="w-full px-2 py-6 rounded-md text-sm font-medium transition bg-green-500 hover:bg-green-600 text-white cursor-pointer"
            style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
          >
            ＋
          </button>
        </div>
      </div>
    </div>
  );
};
