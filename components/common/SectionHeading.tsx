'use client';

import React from 'react';

interface SectionHeadingProps {
  /** 見出しテキスト */
  children: React.ReactNode;
  /** 見出し右側に配置する追加要素（バッジ、ツールチップなど） */
  trailing?: React.ReactNode;
  /** アクセントカラーのテーマ */
  accent?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';
  /**
   * 見出しサイズ
   * - `sm`（デフォルト）: text-sm / バー h-4
   * - `xs`: text-[11px] / バー h-3（サブ見出しなど小さい用途向け）
   */
  size?: 'sm' | 'xs';
  /** htmlFor属性（label要素として使う場合） */
  htmlFor?: string;
  /** 追加のクラス名 */
  className?: string;
}

const ACCENT_STYLES: Record<
  NonNullable<SectionHeadingProps['accent']>,
  { bar: string; text: string }
> = {
  blue: {
    bar: 'bg-blue-500',
    text: 'text-blue-900',
  },
  purple: {
    bar: 'bg-purple-500',
    text: 'text-purple-900',
  },
  emerald: {
    bar: 'bg-emerald-500',
    text: 'text-emerald-900',
  },
  amber: {
    bar: 'bg-amber-500',
    text: 'text-amber-900',
  },
  rose: {
    bar: 'bg-rose-500',
    text: 'text-rose-900',
  },
};

const SIZE_STYLES: Record<
  NonNullable<SectionHeadingProps['size']>,
  { bar: string; text: string }
> = {
  sm: { bar: 'h-4', text: 'text-sm' },
  xs: { bar: 'h-3', text: 'text-[11px]' },
};

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  children,
  trailing,
  accent = 'blue',
  size = 'sm',
  htmlFor,
  className = '',
}) => {
  const accentStyle = ACCENT_STYLES[accent];
  const sizeStyle = SIZE_STYLES[size];

  const content = (
    <span className="flex items-center gap-2">
      {/* アクセントバー */}
      <span
        className={`inline-block w-1 ${sizeStyle.bar} rounded-full ${accentStyle.bar}`}
        aria-hidden="true"
      />
      {/* 見出しテキスト */}
      <span className={`${sizeStyle.text} font-semibold ${accentStyle.text}`}>{children}</span>
      {/* 追加要素 */}
      {trailing && (
        <span className="flex items-center gap-1.5">{trailing}</span>
      )}
    </span>
  );

  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={`block mb-1.5 ${className}`}>
        {content}
      </label>
    );
  }

  return <div className={`mb-1.5 ${className}`}>{content}</div>;
};
