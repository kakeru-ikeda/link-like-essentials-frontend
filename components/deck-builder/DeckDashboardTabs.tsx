'use client';

import React from 'react';

export type TabColor = 'blue' | 'amber' | 'emerald' | 'purple';

export interface DeckDashboardTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: TabColor;
}

interface DeckDashboardTabsProps {
  tabs: DeckDashboardTab[];
  activeTabId: string;
  onChangeTab: (id: string) => void;
  children: React.ReactNode;
}

const TAB_COLOR_STYLES: Record<
  TabColor,
  { active: string; inactive: string; border: string }
> = {
  blue: {
    active: 'bg-blue-500 text-white',
    inactive: 'text-blue-400 hover:bg-blue-50 hover:text-blue-600',
    border: 'border-blue-400',
  },
  amber: {
    active: 'bg-amber-500 text-white',
    inactive: 'text-amber-400 hover:bg-amber-50 hover:text-amber-600',
    border: 'border-amber-400',
  },
  emerald: {
    active: 'bg-emerald-500 text-white',
    inactive: 'text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600',
    border: 'border-emerald-400',
  },
  purple: {
    active: 'bg-purple-500 text-white',
    inactive: 'text-purple-400 hover:bg-purple-50 hover:text-purple-600',
    border: 'border-purple-400',
  },
};

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
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const activeColor: TabColor = activeTab?.color ?? 'blue';
  const activeColorStyle = TAB_COLOR_STYLES[activeColor];

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden gap-0">
      {/* 左側: タブナビゲーション */}
      <div className="flex flex-col gap-1 pt-1 pr-2 border-r border-gray-200 flex-shrink-0 w-14">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const color: TabColor = tab.color ?? 'blue';
          const colorStyle = TAB_COLOR_STYLES[color];
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-md px-1 py-2 text-[9px] font-medium transition-colors leading-tight ${
                isActive ? colorStyle.active : colorStyle.inactive
              }`}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span className="text-center whitespace-pre-line">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 右側: コンテンツ（アクティブタブの色でボーダー） */}
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden pl-3 min-w-0 border-l-2 -ml-px ${activeColorStyle.border}`}
      >
        {children}
      </div>
    </div>
  );
};
