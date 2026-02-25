'use client';

import React from 'react';

export interface DeckDashboardTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface DeckDashboardTabsProps {
  tabs: DeckDashboardTab[];
  activeTabId: string;
  onChangeTab: (id: string) => void;
  children: React.ReactNode;
}

/**
 * DeckDashboard 内の縦型タブナビゲーション。
 * - 左側に縦並びのタブボタン
 * - 右側にアクティブタブのコンテンツ
 */
export const DeckDashboardTabs: React.FC<DeckDashboardTabsProps> = ({
  tabs,
  activeTabId,
  onChangeTab,
  children,
}) => {
  return (
    <div className="flex flex-1 min-h-0 overflow-hidden gap-0">
      {/* 左側: タブナビゲーション */}
      <div className="flex flex-col gap-1 pt-1 pr-2 border-r border-gray-200 flex-shrink-0 w-14">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-md px-1 py-2 text-[9px] font-medium transition-colors leading-tight ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span className="text-center whitespace-pre-line">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 右側: コンテンツ */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pl-3 min-w-0">
        {children}
      </div>
    </div>
  );
};
