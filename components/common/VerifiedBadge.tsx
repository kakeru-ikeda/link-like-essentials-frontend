'use client';

import React from 'react';
import { UserRole } from '@/models/shared/enums';

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
  /** バッジのサイズ */
  size?: 'sm' | 'md' | 'lg';
  /** 追加のクラス名 */
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  role,
  label,
  emailLabel,
  anonymousLabel,
  hideAnonymous = false,
  size = 'md',
  className,
}) => {
  if (role === UserRole.ANONYMOUS && hideAnonymous) {
    return null;
  }

  const sizeClasses = (() => {
    switch (size) {
      case 'sm':
        return {
          circle: 'h-4 w-4',
          icon: 'h-2.5 w-2.5',
          container: 'px-1.5 py-0.5',
          text: 'text-xs',
          gap: 'gap-1',
        };
      case 'lg':
        return {
          circle: 'h-6 w-6',
          icon: 'h-4 w-4',
          container: 'px-2.5 py-1.5',
          text: 'text-sm',
          gap: 'gap-2',
        };
      case 'md':
      default:
        return {
          circle: 'h-5 w-5',
          icon: 'h-3.5 w-3.5',
          container: 'px-2 py-1',
          text: 'text-xs',
          gap: 'gap-1.5',
        };
    }
  })();

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
    ? `inline-flex items-center gap-1 rounded-full border ${sizeClasses.container} ${sizeClasses.text} font-semibold leading-none`
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
    <span className={combinedClassName} aria-label={roleStyle.aria}>
      <span className={`flex ${sizeClasses.circle} items-center justify-center rounded-full shadow-sm ${roleStyle.icon}`}>
        <svg
          className={sizeClasses.icon}
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
      {resolvedLabel && <span className={`${sizeClasses.text} font-semibold leading-none`}>{resolvedLabel}</span>}
    </span>
  );
};
