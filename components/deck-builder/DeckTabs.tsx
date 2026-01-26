'use client';

import { Deck } from '@/models/deck/Deck';
import React from 'react';
import { useResponsiveDevice } from '@/hooks/ui/useResponsiveDevice';
import { Tooltip } from '@/components/common/Tooltip';

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
  children,
}) => {
  const { isSp } = useResponsiveDevice();

  if (isSp) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-24">
          {children}
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-gray-50 shadow-[0_-4px_10px_rgba(0,0,0,0.12)] pb-safe">
          <div className="relative flex items-center px-3 py-2">
            <div className="flex-1 overflow-x-auto mr-20">
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <div key={tab.id} className="relative group">
                    <Tooltip content={tab.name} position="top">
                      <button
                        onClick={() => onChangeTab(tab.id)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                          activeTabId === tab.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        <span
                          className="inline-block max-w-[120px] truncate"
                          style={{ letterSpacing: '-0.05em' }}
                        >
                          {tab.name}
                        </span>
                      </button>
                    </Tooltip>
                    {tabs.length > 1 && (
                      <button
                        onClick={() => onDeleteTab(tab.id)}
                        className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <button
                onClick={onAddTab}
                className="px-3 py-2 rounded-md text-sm font-medium transition bg-green-500 hover:bg-green-600 text-white whitespace-nowrap shadow"
              >
                ＋ 追加
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <Tooltip content={tab.name} position="left">
                  <button
                    onClick={() => onChangeTab(tab.id)}
                    className={`w-full px-2 py-5 rounded-md text-sm font-medium transition ${
                      activeTabId === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'upright',
                    }}
                  >
                    <span
                      className="inline-block max-h-[200px] overflow-hidden"
                      style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'upright',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        letterSpacing: '-0.05em',
                      }}
                    >
                      {tab.name}
                    </span>
                  </button>
                </Tooltip>
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
