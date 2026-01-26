'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Deck } from '@/models/deck/Deck';
import { LiveGrandPrix } from '@/models/live-grand-prix/LiveGrandPrix';
import {
  generateAutoHashtags,
  addCustomHashtag,
  removeCustomHashtag,
  combineHashtags,
} from '@/services/infrastructure/hashtagService';

export interface UseHashtagReturn {
  /** 自動生成されたハッシュタグ */
  autoHashtags: string[];
  /** カスタムハッシュタグ */
  customHashtags: string[];
  /** 入力中のタグテキスト */
  inputValue: string;
  /** 入力値を変更 */
  setInputValue: (value: string) => void;
  /** カスタムタグを追加 */
  handleAddCustomHashtag: () => void;
  /** カスタムタグを削除 */
  handleRemoveCustomHashtag: (index: number) => void;
  /** Enterキー処理 */
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * ハッシュタグ管理用カスタムフック
 */
export const useHashtag = (
  deck: Deck | null,
  liveGrandPrix: LiveGrandPrix | null | undefined,
  onChange: (hashtags: string[]) => void
): UseHashtagReturn => {
  const [autoHashtags, setAutoHashtags] = useState<string[]>([]);
  const [customHashtags, setCustomHashtags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  // 常に最新のonChangeコールバックを保持
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // 自動ハッシュタグの生成
  useEffect(() => {
    const tags = generateAutoHashtags(deck, liveGrandPrix);
    setAutoHashtags(tags);
  }, [deck, liveGrandPrix]);

  // ハッシュタグの変更を親に通知
  useEffect(() => {
    const allTags = combineHashtags(autoHashtags, customHashtags);
    onChangeRef.current(allTags);
  }, [autoHashtags, customHashtags]);

  // カスタムハッシュタグの追加
  const handleAddCustomHashtag = useCallback((): void => {
    const result = addCustomHashtag(inputValue, autoHashtags, customHashtags);

    if (result.success && result.customTags) {
      setCustomHashtags(result.customTags);
      setInputValue('');
    } else {
      // 重複の場合も入力をクリア
      setInputValue('');
    }
  }, [inputValue, autoHashtags, customHashtags]);

  // Enterキーでタグを追加
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleAddCustomHashtag();
      }
    },
    [handleAddCustomHashtag]
  );

  // カスタムタグの削除
  const handleRemoveCustomHashtag = useCallback((index: number): void => {
    setCustomHashtags((prev) => removeCustomHashtag(index, prev));
  }, []);

  return {
    autoHashtags,
    customHashtags,
    inputValue,
    setInputValue,
    handleAddCustomHashtag,
    handleRemoveCustomHashtag,
    handleKeyDown,
  };
};
