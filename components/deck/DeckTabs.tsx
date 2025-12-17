'use client';

import React, { useState } from 'react';

interface DeckTab {
  id: number;
  name: string;
}

interface DeckTabsProps {
  children: React.ReactNode;
}

export const DeckTabs: React.FC<DeckTabsProps> = ({ children }) => {
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const [tabs, setTabs] = useState<DeckTab[]>([
    { id: 1, name: 'デッキ1' },
    { id: 2, name: 'デッキ2' },
    { id: 3, name: 'デッキ3' },
  ]);
  const [nextId, setNextId] = useState<number>(4);

  const handleAddDeck = (): void => {
    const newDeck = { id: nextId, name: `デッキ${nextId}` };
    setTabs([...tabs, newDeck]);
    setNextId(nextId + 1);
    setActiveTabId(newDeck.id);
  };

  const handleDeleteDeck = (tabId: number): void => {
    if (tabs.length <= 1) {
      alert('最低1つのデッキが必要です');
      return;
    }
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    // 削除したタブがアクティブだった場合、最初のタブをアクティブに
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const handleDelete = (e: React.MouseEvent, tabId: number): void => {
    e.stopPropagation();
    handleDeleteDeck(tabId);
  };

  return (
    <div className="flex h-full">
      {/* メインコンテンツエリア */}
      <div className="flex-1 h-full">
        {children}
      </div>

      {/* 右側縦タブ */}
      <div className="w-12 border-l border-gray-200 bg-gray-50 h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-1">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <div key={tab.id} className="relative group">
                <button
                  onClick={() => setActiveTabId(tab.id)}
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
                    onClick={(e) => handleDelete(e, tab.id)}
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
            onClick={handleAddDeck}
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
