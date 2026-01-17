'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useResponsiveDevice } from '@/hooks/useResponsiveDevice';

interface SidebarProps {
  children?: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'デッキビルダー',
    href: '/',
    icon: (
      <Image
        src="/images/icons/builder.png"
        alt="デッキビルダー"
        width={24}
        height={24}
        className="w-6 h-6"
      />
    ),
  },
  {
    label: '投稿デッキ',
    href: '/decks',
    icon: (
      <Image
        src="/images/icons/decks.png"
        alt="投稿デッキ"
        width={24}
        height={24}
        className="w-6 h-6"
      />
    ),
  },
  {
    label: 'カード一覧',
    href: '/cards',
    icon: (
      <Image
        src="/images/icons/search.png"
        alt="カード一覧"
        width={24}
        height={24}
        className="w-6 h-6"
      />
    ),
  },
  {
    label: 'お知らせ',
    href: '/news',
    icon: (
      <Image
        src="/images/icons/news.png"
        alt="お知らせ"
        width={24}
        height={24}
        className="w-6 h-6"
      />
    ),
  },
];

const MY_PAGE_ITEM: NavItem = {
  label: 'マイページ',
  href: '/mypage',
  icon: (
    <Image
      src="/images/icons/people.png"
      alt="マイページ"
      width={24}
      height={24}
      className="w-6 h-6"
    />
  )
};

export function Sidebar({ children }: SidebarProps): JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const pathname = usePathname();
  const { profile, fetchProfile } = useUserProfile();
  const { isPc } = useResponsiveDevice();

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  const avatarSrc = profile?.avatarUrl
    ? `${profile.avatarUrl}${profile.avatarUrl.includes('?') ? '&' : '?'}v=${encodeURIComponent(
        profile.updatedAt
      )}`
    : null;

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
        style={{ width: isSidebarExpanded ? '16rem' : '3.5rem' }}
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
                    flex items-center py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                    ${isSidebarExpanded ? 'px-3' : 'px-2 justify-center'}
                  `}
                  title={!isSidebarExpanded ? item.label : undefined}
                >
                  <span
                    className={`flex items-center justify-center shrink-0 ${
                      isSidebarExpanded ? 'mr-3' : ''
                    }`}
                  >
                    {item.icon}
                  </span>
                  {isSidebarExpanded && <span className="whitespace-nowrap">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* マイページ（最下部固定） */}
          <div className="px-2 pb-5">
            <Link
              href={MY_PAGE_ITEM.href}
              className={`
                flex items-center py-3 rounded-lg transition-colors
                ${
                  pathname === MY_PAGE_ITEM.href
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }
                ${isSidebarExpanded ? 'px-3' : 'px-2 justify-center'}
              `}
              title={!isSidebarExpanded ? MY_PAGE_ITEM.label : undefined}
            >
              <span
                className={`flex items-center justify-center shrink-0 ${
                  isSidebarExpanded ? 'mr-3' : ''
                }`}
              >
                {avatarSrc ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarSrc}
                      alt="マイアバター"
                      className="w-full h-full object-cover"
                    />
                  </span>
                ) : (
                  MY_PAGE_ITEM.icon
                )}
              </span>
              {isSidebarExpanded && <span className="whitespace-nowrap">{MY_PAGE_ITEM.label}</span>}
            </Link>
          </div>

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
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ marginLeft: isPc ? '3rem' : undefined }}
      >
        {/* SP用ヘッダー（ハンバーガーメニュー） */}
        {!isPc && (
          <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <Image
              src="/images/logo_square.png"
              alt="Link Like Essentials"
              width={40}
              height={40}
              className="w-8"
              priority
            />

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
        )}

        {/* SP用サイドバー（オーバーレイ） */}
        {!isPc && isMobileMenuOpen && (
          <>
            {/* 背景オーバーレイ */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeMobileMenu}
            />

            {/* サイドバーコンテンツ */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl">
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
                        <span className="mr-3 flex items-center justify-center">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* マイページ（モバイル下部固定） */}
                <div className="px-4 pb-5">
                  <Link
                    href={MY_PAGE_ITEM.href}
                    onClick={closeMobileMenu}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition-colors
                      ${
                        pathname === MY_PAGE_ITEM.href
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="mr-3 flex items-center justify-center">
                      {avatarSrc ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={avatarSrc}
                            alt="マイアバター"
                            className="w-full h-full object-cover"
                          />
                        </span>
                      ) : (
                        MY_PAGE_ITEM.icon
                      )}
                    </span>
                    <span>{MY_PAGE_ITEM.label}</span>
                  </Link>
                </div>

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
