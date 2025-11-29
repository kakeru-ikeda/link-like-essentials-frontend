'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  children?: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'デッキビルダー', href: '/', icon: '🎴' },
  { label: 'マイデッキ', href: '/my-decks', icon: '📚' },
  { label: 'カード一覧', href: '/cards', icon: '🔍' },
  { label: '統計情報', href: '/stats', icon: '📊' },
];

export function Sidebar({ children }: SidebarProps): JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* PC用サイドバー - 常時表示 */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* ロゴ/タイトル */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">
              Link Like<br />Essentials
            </h1>
            <p className="text-sm text-gray-600 mt-1">デッキビルダー</p>
          </div>

          {/* ナビゲーション */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* フッター情報 */}
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              © 2025 Link Like Essentials
            </p>
          </div>
        </div>
      </aside>

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* SP用ヘッダー（ハンバーガーメニュー） */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">
              Link Like Essentials
            </h1>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="メニューを開く"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </header>

        {/* SP用サイドバー（オーバーレイ） */}
        {isMobileMenuOpen && (
          <>
            {/* 背景オーバーレイ */}
            <div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeMobileMenu}
            />

            {/* サイドバーコンテンツ */}
            <aside className="md:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl">
              <div className="flex flex-col h-full">
                {/* ロゴ/タイトル */}
                <div className="px-6 py-6 border-b border-gray-200">
                  <h1 className="text-xl font-bold text-gray-900">
                    Link Like<br />Essentials
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">デッキビルダー</p>
                </div>

                {/* ナビゲーション */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`
                          flex items-center px-4 py-3 rounded-lg transition-colors
                          ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 font-semibold'
                              : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <span className="mr-3 text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* フッター情報 */}
                <div className="px-6 py-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    © 2025 Link Like Essentials
                  </p>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
