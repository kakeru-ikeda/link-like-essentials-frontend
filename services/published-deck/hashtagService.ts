import { CHARACTERS } from '@/config/characters';
import { Deck } from '@/models/deck/Deck';
import { LiveGrandPrix } from '@/models/live-grand-prix/LiveGrandPrix';
import { GradeChallenge } from '@/models/grade-challenge/GradeChallenge';
import { getDeckSlotMapping } from '@/services/deck/deckConfigService';
import type { DeckSlotMapping } from '@/config/deckSlots';

/**
 * ハッシュタグを正規化（#を自動追加）
 */
export const normalizeHashtag = (tag: string): string => {
  const trimmed = tag.trim();
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
};

/**
 * ハッシュタグの重複チェック
 */
export const isDuplicateHashtag = (
  tag: string,
  existingTags: string[]
): boolean => {
  return existingTags.includes(tag);
};

/**
 * デッキ情報から自動的にハッシュタグを生成
 */
export const generateAutoHashtags = (
  deck: Deck | null,
  liveGrandPrix?: LiveGrandPrix | null,
  gradeChallenge?: GradeChallenge | null
): string[] => {
  if (!deck) return [];

  const isWithinLgpReviewWindow = (eventEndDate?: string): boolean => {
    if (!eventEndDate) return false;
    const end = new Date(eventEndDate);
    if (Number.isNaN(end.getTime())) return false;
    const reviewStart = new Date(end.getTime() - 24 * 60 * 60 * 1000);
    return new Date() >= reviewStart;
  };

  const tags: string[] = [];

  // 期
  if (deck.deckType) {
    tags.push(`#${deck.deckType}`);
  }

  // ライブグランプリが有効の場合
  if (deck.liveGrandPrixId) {
    const isReviewWindow = isWithinLgpReviewWindow(liveGrandPrix?.endDate);
    tags.push(isReviewWindow ? '#ライグラ振り返り' : '#ライグラ');

    // ライブグランプリ開催名
    if (liveGrandPrix?.eventName) {
      tags.push(`#${liveGrandPrix.eventName}`);
    }

    // ライブグランプリステージ
    if (deck.liveGrandPrixStageName) {
      tags.push(`#ステージ${deck.liveGrandPrixStageName}`);
    }
  }

  // グレードチャレンジが有効の場合
  if (deck.gradeChallengeId) {
    tags.push('#グレードチャレンジ');

    // グレードチャレンジタイトル
    if (gradeChallenge?.title) {
      tags.push(`#${gradeChallenge.title} ステージ${deck.gradeChallengeStageName}`);
    }
  }

  // 楽曲名
  if (deck.songName) {
    tags.push(`#${deck.songName}`);
  }

  // センターキャラクターのカードIDが179の場合は#ジェネシス
  if (deck.centerCharacter !== null) {
    const centerChar = CHARACTERS.find(c => c === deck.centerCharacter);
    const slotMapping: DeckSlotMapping[] = getDeckSlotMapping(deck.deckType);
    const centerSlot = slotMapping.find(slot => slot.characterName === centerChar);

    if (centerSlot?.characterName === CHARACTERS[0] && deck.slots) {
        const centerDeckSlot = deck.slots.find(slot => slot.cardId && slot.characterName === centerChar);
        if (centerSlot.slotId === centerDeckSlot?.slotId && centerDeckSlot?.cardId === '179') {
            tags.push('#ジェネシス');
        }
    }
  }

  return tags;
};

/**
 * カスタムハッシュタグを追加
 */
export const addCustomHashtag = (
  inputValue: string,
  existingAutoTags: string[],
  existingCustomTags: string[]
): { success: boolean; tag?: string; customTags?: string[] } => {
  const trimmed = inputValue.trim();
  if (!trimmed) {
    return { success: false };
  }

  // #を自動で追加
  const tag = normalizeHashtag(trimmed);

  // 重複チェック
  const allTags = [...existingAutoTags, ...existingCustomTags];
  if (isDuplicateHashtag(tag, allTags)) {
    return { success: false };
  }

  return {
    success: true,
    tag,
    customTags: [...existingCustomTags, tag],
  };
};

/**
 * カスタムハッシュタグを削除
 */
export const removeCustomHashtag = (
  index: number,
  customTags: string[]
): string[] => {
  return customTags.filter((_, i) => i !== index);
};

/**
 * 全てのハッシュタグを結合
 */
export const combineHashtags = (
  autoTags: string[],
  customTags: string[]
): string[] => {
  return [...autoTags, ...customTags];
};
