'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* PC用サイドバー - ホバーで展開 */}
      <aside
        className="hidden md:flex md:flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out fixed left-0 top-0 h-full z-50"
        style={{ width: isSidebarExpanded ? '16rem' : '3rem' }}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* ロゴ/タイトル */}
          <div className="px-3 py-4 border-b border-gray-200 flex justify-center">
            <Link href="/" aria-label="ホームに戻る">
              {isSidebarExpanded ? (
                <Image
                  src="/images/logo.png"
                  alt="Link Like Essentials"
                  width={200}
                  height={70}
                  className="h-16 w-auto"
                  priority
                />
              ) : (
                <Image
                  src="/images/logo_square.png"
                  alt="Link Like Essentials"
                  width={40}
                  height={40}
                  className="w-8"
                  priority
                />
              )}
            </Link>
          </div>

          {/* ナビゲーション */}
          <nav className="flex-1 px-2 py-5 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                    ${isSidebarExpanded ? '' : 'justify-center'}
                  `}
                  title={!isSidebarExpanded ? item.label : undefined}
                >
                  <span className={`text-xl ${isSidebarExpanded ? 'mr-3' : ''}`}>
                    {item.icon}
                  </span>
                  {isSidebarExpanded && <span className="whitespace-nowrap">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* フッター情報 */}
          {isSidebarExpanded && (
            <div className="px-6 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 whitespace-nowrap">
                © 2025 Link Like Essentials
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-12">
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
                <div className="px-6 py-4 border-b border-gray-200">
                  <Link href="/" onClick={closeMobileMenu} aria-label="ホームに戻る">
                    <Image
                      src="/images/logo.png"
                      alt="Link Like Essentials"
                      width={200}
                      height={70}
                      className="h-12 w-auto"
                      priority
                    />
                  </Link>
                </div>

                {/* ナビゲーション */}
                <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
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
        <main className="flex-1 overflow-y-auto overflow-x-visible bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
