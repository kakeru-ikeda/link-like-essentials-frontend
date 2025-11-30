'use client';

import React from 'react';

interface HighlightTextProps {
  text: string;
  keywords: string[];
  className?: string;
}

/**
 * テキスト内のキーワードをハイライト表示するコンポーネント
 */
export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  keywords,
  className = '',
}) => {
  if (!keywords || keywords.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // エスケープ関数
  const escapeRegExp = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // キーワードをマッチング用の正規表現に変換
  const patterns: RegExp[] = keywords
    .filter(keyword => keyword && keyword.length > 0)
    .map(keyword => {
      // すでに正規表現パターン（\\ を含む）の場合はそのまま使用
      if (keyword.includes('\\')) {
        try {
          return new RegExp(keyword, 'gi');
        } catch {
          // 不正な正規表現の場合は通常の文字列検索にフォールバック
          return new RegExp(escapeRegExp(keyword), 'gi');
        }
      }
      // 通常の文字列検索
      return new RegExp(escapeRegExp(keyword), 'gi');
    });

  if (patterns.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // すべてのパターンを統合した正規表現を作成
  const combinedPattern = new RegExp(
    patterns.map(p => p.source).join('|'),
    'gi'
  );

  // マッチ位置を収集
  const matches: Array<{ start: number; end: number; text: string }> = [];
  let match: RegExpExecArray | null;
  
  while ((match = combinedPattern.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
    });
  }

  // マッチがない場合はそのまま返す
  if (matches.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // 重複を除去してソート
  const uniqueMatches = matches
    .sort((a, b) => a.start - b.start)
    .filter((match, index, arr) => {
      if (index === 0) return true;
      const prev = arr[index - 1];
      return match.start >= prev.end;
    });

  // テキストを分割してハイライト適用
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  uniqueMatches.forEach((match, index) => {
    // マッチ前のテキスト
    if (match.start > lastIndex) {
      parts.push(
        <span key={`text-${index}`}>
          {text.substring(lastIndex, match.start)}
        </span>
      );
    }

    // ハイライト部分
    parts.push(
      <mark
        key={`highlight-${index}`}
        className="bg-yellow-200 text-gray-900 font-semibold px-0.5 rounded"
      >
        {match.text}
      </mark>
    );

    lastIndex = match.end;
  });

  // 最後のテキスト
  if (lastIndex < text.length) {
    parts.push(
      <span key="text-last">
        {text.substring(lastIndex)}
      </span>
    );
  }

  return <span className={className}>{parts}</span>;
};
