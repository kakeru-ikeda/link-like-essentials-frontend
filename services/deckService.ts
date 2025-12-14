import { Card } from '@/models/Card';
import { Deck } from '@/models/Deck';
import { DeckType } from '@/models/enums';
import { canPlaceCardInSlot } from '@/constants/deckRules';

/**
 * カード配置の結果
 */
export interface CardPlacementResult {
  success: boolean;
  error?: string;
}

/**
 * カードスワップの結果
 */
export interface CardSwapResult {
  success: boolean;
  removedSlots: number[]; // 制約違反で剥がされたスロットID
  error?: string;
}

/**
 * デッキ編成のビジネスロジックを提供するサービス
 */
export class DeckService {
  /**
   * スロットにカードを配置できるか検証
   */
  static validateCardPlacement(
    card: Card,
    slotId: number,
    deckType?: DeckType
  ): CardPlacementResult {
    const validationResult = canPlaceCardInSlot(
      { characterName: card.characterName, rarity: card.rarity },
      slotId,
      deckType
    );

    if (!validationResult.allowed) {
      return {
        success: false,
        error: validationResult.reason || 'カードを配置できません',
      };
    }

    return { success: true };
  }

  /**
   * カードスワップ後の制約チェック
   * スワップ後に制約違反となるカードを検出
   */
  static validateSwap(
    deck: Deck,
    slotId1: number,
    slotId2: number
  ): CardSwapResult {
    const slot1 = deck.slots.find((s) => s.slotId === slotId1);
    const slot2 = deck.slots.find((s) => s.slotId === slotId2);

    if (!slot1 || !slot2) {
      return { success: false, removedSlots: [], error: 'スロットが見つかりません' };
    }

    const removedSlots: number[] = [];

    // slot1に配置されるカード（元のslot2のカード）の検証
    if (slot2.card) {
      const canPlaceInSlot1 = canPlaceCardInSlot(
        { characterName: slot2.card.characterName, rarity: slot2.card.rarity },
        slotId1,
        deck.deckType
      );
      if (!canPlaceInSlot1.allowed) {
        removedSlots.push(slotId1);
      }
    }

    // slot2に配置されるカード（元のslot1のカード）の検証
    if (slot1.card) {
      const canPlaceInSlot2 = canPlaceCardInSlot(
        { characterName: slot1.card.characterName, rarity: slot1.card.rarity },
        slotId2,
        deck.deckType
      );
      if (!canPlaceInSlot2.allowed) {
        removedSlots.push(slotId2);
      }
    }

    return { success: true, removedSlots };
  }

  /**
   * デッキにカードが編成されているかチェック
   */
  static hasCards(deck: Deck | null): boolean {
    return deck?.slots.some((slot) => slot.card !== null) ?? false;
  }

  /**
   * スロットのカードがエースカードかチェック
   */
  static isAceCard(deck: Deck | null, slotId: number): boolean {
    return deck?.aceSlotId === slotId;
  }

  /**
   * スロットにカードが配置されているかチェック
   */
  static hasCardInSlot(deck: Deck | null, slotId: number): boolean {
    const slot = deck?.slots.find((s) => s.slotId === slotId);
    return slot?.card !== null;
  }
}
