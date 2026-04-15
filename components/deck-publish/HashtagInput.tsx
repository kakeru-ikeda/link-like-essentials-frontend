'use client';

import React from 'react';
import { Deck } from '@/models/deck/Deck';
import { LiveGrandPrix } from '@/models/live-grand-prix/LiveGrandPrix';
import { GradeChallenge } from '@/models/grade-challenge/GradeChallenge';
import { useHashtag } from '@/hooks/published-deck/useHashtag';
import { HelpTooltip } from '@/components/common/HelpTooltip';

interface HashtagInputProps {
  deck: Deck | null;
  liveGrandPrix?: LiveGrandPrix | null;
  gradeChallenge?: GradeChallenge | null;
  onChange: (hashtags: string[]) => void;
}

export const HashtagInput: React.FC<HashtagInputProps> = ({
  deck,
  liveGrandPrix,
  gradeChallenge,
  onChange,
}) => {
  const {
    autoHashtags,
    customHashtags,
    inputValue,
    setInputValue,
    handleAddCustomHashtag,
    handleAddRecommendedTag,
    handleRemoveCustomHashtag,
    handleKeyDown,
  } = useHashtag(deck, liveGrandPrix, gradeChallenge, onChange);

  const RECOMMENDED_TAGS = [
    '#リンクラ思い出の編成',
    '#好き好きクラブのみなさんのBGP',
  ] as const;

  const allTags = [...autoHashtags, ...customHashtags];
  const isTagAdded = (tag: string) => allTags.includes(tag);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium text-gray-700">タグ</label>
        <HelpTooltip
          content="公開デッキを検索する際に使用する、絞り込み用タグを設定します。"
          position="top"
          className="mb-0.5"
          size={4}
        />
      </div>

      {/* 自動生成されたハッシュタグ */}
      {autoHashtags.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-2">
            {autoHashtags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* カスタムハッシュタグ */}
      {customHashtags.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-2">
            {customHashtags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveCustomHashtag(index)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* おすすめタグ */}
      <div>
        <p className="text-xs text-gray-500 mb-1.5">おすすめタグ</p>
        <div className="flex flex-wrap gap-2">
          {RECOMMENDED_TAGS.map((tag) => {
            const added = isTagAdded(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddRecommendedTag(tag)}
                disabled={added}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  added
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-sm hover:from-pink-600 hover:to-orange-500 hover:shadow-md'
                }`}
              >
                {added ? '✓ ' : '+ '}
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* タグ追加用の入力欄 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="タグを追加... (Enterで追加)"
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          type="button"
          onClick={handleAddCustomHashtag}
          disabled={!inputValue.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          追加
        </button>
      </div>
    </div>
  );
};
