'use client';

import React from 'react';
import { DASHBOARD_TAB_COLORS, type DashboardTabColor } from '@/styles/colors';
import { hexToRgba } from '@/utils/colorUtils';

export interface DeckDashboardTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: DashboardTabColor;
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
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const activeColor: DashboardTabColor = activeTab?.color ?? 'blue';
  const activeHex = DASHBOARD_TAB_COLORS[activeColor];

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden gap-0">
      {/* 左側: タブナビゲーション */}
      <div className="flex flex-col gap-1 pt-1 pr-2 border-r border-gray-200 flex-shrink-0 w-14">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const hex = DASHBOARD_TAB_COLORS[tab.color ?? 'blue'];
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              style={
                isActive
                  ? { backgroundColor: hex, color: '#ffffff' }
                  : { color: hex }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = hexToRgba(hex, 0.12);
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '';
                }
              }}
              className="flex flex-col items-center justify-center gap-0.5 rounded-md px-1 py-2 text-[9px] font-medium transition-colors leading-tight"
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span className="text-center whitespace-pre-line">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 右側: コンテンツ（アクティブタブの色でボーダー） */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden pl-3 min-w-0 border-l-2 -ml-px"
        style={{ borderColor: activeHex }}
      >
        {children}
      </div>
    </div>
  );
};
