'use client';

import React from 'react';
import { UserRole } from '@/models/enums';

interface VerifiedBadgeProps {
  /** ユーザーのロールに応じて表示を切り替え */
  role: UserRole;
  /** バッジ右側のラベル。未指定ならアイコンのみを表示 */
  label?: string;
  /** メール認証時に表示するラベルの上書き */
  emailLabel?: string;
  /** アノニマス時に表示するラベルの上書き */
  anonymousLabel?: string;
  /** アノニマス時にバッジを非表示にする */
  hideAnonymous?: boolean;
  /** 追加のクラス名 */
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  role,
  label,
  emailLabel,
  anonymousLabel,
  hideAnonymous = false,
  className,
}) => {
  if (role === UserRole.ANONYMOUS && hideAnonymous) {
    return null;
  }

  const roleStyle = (() => {
    switch (role) {
      case UserRole.EMAIL:
        return {
          container: 'border-blue-200 bg-blue-50 text-blue-800',
          icon: 'bg-blue-500 text-white',
          aria: 'メール認証済み',
        } as const;
      case UserRole.ANONYMOUS:
      default:
        return {
          container: 'border-slate-200 bg-slate-50 text-slate-600',
          icon: 'bg-slate-300 text-white',
          aria: '未認証ユーザー',
        } as const;
    }
  })();

  const containerClasses = label
    ? 'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold leading-none'
    : 'inline-flex items-center';

  const resolvedLabel = (() => {
    if (role === UserRole.EMAIL) {
      return emailLabel ?? label;
    }
    return anonymousLabel ?? label;
  })();

  const combinedClassName = [containerClasses, roleStyle.container, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={combinedClassName} aria-label={roleStyle.aria} title={roleStyle.aria}>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full shadow-sm ${roleStyle.icon}`}>
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.00016 12.6667L4.8335 9.5L3.66683 10.6667L8.00016 15L17.0002 6.00001L15.8335 4.83334L8.00016 12.6667Z"
            fill="currentColor"
          />
        </svg>
      </span>
      {resolvedLabel && <span className="text-xs font-semibold leading-none">{resolvedLabel}</span>}
    </span>
  );
};
