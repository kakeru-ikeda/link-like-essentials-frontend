'use client';

import React, { useState } from 'react';

interface DeckTabsProps {
  children: React.ReactNode;
}

interface DeckTab {
  id: number;
  name: string;
}

export const DeckTabs: React.FC<DeckTabsProps> = ({ children }) => {
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const [tabs, setTabs] = useState<DeckTab[]>([
    { id: 1, name: 'デッキ1' },
    { id: 2, name: 'デッキ2' },
    { id: 3, name: 'デッキ3' },
  ]);

  return (
    <div className="flex h-full">
      {/* メインコンテンツエリア */}
      <div className="flex-1 h-full">
        {children}
      </div>

      {/* 右側縦タブ */}
      <div className="w-12 border-l border-gray-200 bg-gray-50 h-full overflow-y-auto">
        <div className="p-1">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`w-full px-2 py-6 rounded-md text-sm font-medium transition ${
                  activeTabId === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                style={{ writingMode: 'vertical-rl' }}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* 新規デッキ追加ボタン（将来用） */}
          <button
            disabled
            className="w-full mt-4 px-2 py-6 rounded-md text-sm font-medium bg-gray-200 text-gray-400"
            style={{ writingMode: 'vertical-rl' }}
          >
            ＋ 新規デッキ
          </button>
        </div>
      </div>
    </div>
  );
};
