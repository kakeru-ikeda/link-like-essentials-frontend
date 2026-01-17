import { Card } from '@/models/Card';
import { Deck, DeckSlot, DeckForCloud } from '@/models/Deck';
import { DeckType } from '@/models/enums';
import { canPlaceCardInSlot } from '@/services/deckRulesService';
import { getDeckSlotMapping } from '@/services/deckConfigService';
import { DeckSlotMapping } from '@/config/deckSlots';
import { PublishedDeck } from '@/models/PublishedDeck';
import { cardCatalogService } from '@/services/cardCatalogService';
import { CharacterName } from '@/config/characters';
import { songCatalogService } from '@/services/songCatalogService';
import { liveGrandPrixCatalogService } from '@/services/liveGrandPrixCatalogService';

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
 * デッキタイプ変更の検証結果
 */
export interface DeckTypeChangeValidation {
  canChange: boolean;
  requiresConfirmation: boolean; // カードが存在する場合true
  message?: string;
}

/**
 * ライブグランプリステージ変更の検証結果
 */
export interface StageChangeValidation {
  canChange: boolean;
  requiresConfirmation: boolean; // デッキタイプが変更される場合true
  deckTypeWillChange: boolean;
  currentDeckType?: DeckType;
  newDeckType?: DeckType;
  message?: string;
}

/**
 * デッキ編成のビジネスロジックを提供するサービス
 */
export class DeckService {
  /**
   * PublishedDeck(DeckForCloud)をDeck型へ復元
   * - スロットのcardIdを元にGraphQLからカード詳細を取得し、slot.cardへ補完
   * - slotのcharacterNameはdeckTypeに応じたマッピングから復元
   */
  static async compilePublishedDeck(publishedDeck: PublishedDeck): Promise<Deck> {
    const baseDeck: DeckForCloud = publishedDeck.deck;
    const song = await songCatalogService.getSongById(baseDeck.songId);
    const liveGp = await liveGrandPrixCatalogService.getById(baseDeck.liveGrandPrixId);
    const stageDetail = liveGp?.details?.find((d) => d.id === baseDeck.liveGrandPrixDetailId);
    const deckType = baseDeck.deckType ?? song?.deckType ?? DeckType.TERM_105;
    const slotMapping = getDeckSlotMapping(deckType);
    const mappingById = new Map<number, CharacterName | 'フレンド' | 'フリー'>();
    slotMapping.forEach((m) => mappingById.set(m.slotId, m.characterName));

    const cardIds = baseDeck.slots
      .map((slot) => slot.cardId)
      .filter((id): id is string => Boolean(id));
    const cards = await cardCatalogService.getCardsByIds(cardIds);
    const cardMap = new Map(cards.map((c) => [c.id, c] as const));

    const slots: DeckSlot[] = baseDeck.slots.map((slot) => {
      const characterName = mappingById.get(slot.slotId) ?? 'フリー';
      const card = slot.cardId ? cardMap.get(slot.cardId) ?? null : null;

      return {
        slotId: slot.slotId,
        characterName,
        cardId: slot.cardId,
        limitBreak: slot.limitBreak,
        card,
      };
    });

    const now = publishedDeck.publishedAt ?? new Date().toISOString();

    return {
      id: baseDeck.id,
      name: baseDeck.name,
      slots,
      aceSlotId: baseDeck.aceSlotId ?? null,
      deckType,
      songId: baseDeck.songId,
      songName: song?.songName,
      centerCharacter: song?.centerCharacter,
      participations: song?.participations,
      liveAnalyzerImageUrl: song?.liveAnalyzerImageUrl,
      liveGrandPrixId: baseDeck.liveGrandPrixId,
      liveGrandPrixDetailId: baseDeck.liveGrandPrixDetailId,
      liveGrandPrixEventName: liveGp?.eventName,
      liveGrandPrixStageName: stageDetail?.stageName,
      score: baseDeck.score,
      memo: baseDeck.memo,
      createdAt: now,
      updatedAt: now,
      isFriendSlotEnabled: true,
    };
  }

  /**
   * 空のデッキを作成
   */
  static createEmptyDeck(
    name: string = '新しいデッキ',
    deckType: DeckType = DeckType.TERM_105
  ): Deck {
    const mapping = getDeckSlotMapping(deckType);
    const slots: DeckSlot[] = mapping.map((m) => ({
      slotId: m.slotId,
      characterName: m.characterName,
      cardId: null,
    }));

    return {
      id: crypto.randomUUID(),
      name,
      slots,
      aceSlotId: null,
      deckType,
      isFriendSlotEnabled: true,
      memo: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * タブ配列からナンバリングされたデッキ名を生成
   */
  static generateDeckName(currentTabsCount: number): string {
    return `デッキ${currentTabsCount + 1}`;
  }
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
    return deck?.slots.some((slot) => slot.card !== null || slot.cardId !== null) ?? false;
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

  /**
   * デッキタイプ変更を検証
   * 
   * @param deck 現在のデッキ
   * @param newDeckType 新しいデッキタイプ
   * @returns 検証結果
   */
  static validateDeckTypeChange(
    deck: Deck | null,
    newDeckType: DeckType
  ): DeckTypeChangeValidation {
    // 同じデッキタイプの場合は確認不要
    if (deck?.deckType === newDeckType) {
      return {
        canChange: true,
        requiresConfirmation: false,
      };
    }

    // カードが編成されている場合は確認が必要
    if (this.hasCards(deck)) {
      return {
        canChange: true,
        requiresConfirmation: true,
        message: 'デッキタイプを変更すると、現在編成されているカードがすべてリセットされます。\n変更してもよろしいですか？',
      };
    }

    // カードがない場合は確認不要
    return {
      canChange: true,
      requiresConfirmation: false,
    };
  }

  /**
   * ライブグランプリステージ変更を検証
   * 
   * @param deck 現在のデッキ
   * @param newDeckType 新しいデッキタイプ（楽曲から取得）
   * @returns 検証結果
   */
  static validateStageChange(
    deck: Deck | null,
    newDeckType?: DeckType
  ): StageChangeValidation {
    // 新しいdeckTypeが存在し、現在のdeckTypeと異なる場合
    const deckTypeWillChange = Boolean(
      newDeckType && deck?.deckType && newDeckType !== deck.deckType
    );

    if (!deckTypeWillChange) {
      return {
        canChange: true,
        requiresConfirmation: false,
        deckTypeWillChange: false,
      };
    }

    // デッキにカードが編成されている場合は確認が必要
    if (this.hasCards(deck)) {
      return {
        canChange: true,
        requiresConfirmation: true,
        deckTypeWillChange: true,
        currentDeckType: deck?.deckType,
        newDeckType: newDeckType,
        message: `ステージを変更するとデッキタイプが「${deck?.deckType}」から「${newDeckType}」に変更されます。\n現在編成されているカードがすべてリセットされます。\n変更してもよろしいですか？`,
      };
    }

    // カードがない場合は確認不要
    return {
      canChange: true,
      requiresConfirmation: false,
      deckTypeWillChange: true,
      currentDeckType: deck?.deckType,
      newDeckType: newDeckType,
    };
  }

  /**
   * メイン枠の未編成スロットを取得
   * - フレンド枠が無効化されている場合は判定対象から除外
   */
  static getUnfilledMainSlots(deck: Deck | null): DeckSlotMapping[] {
    if (!deck) return [];

    const mapping = getDeckSlotMapping(deck.deckType);

    return mapping.filter((slot) => {
      if (slot.slotType !== 'main') return false;

      // フレンド枠が無効化されている場合はスキップ
      if (slot.characterName === 'フレンド' && deck.isFriendSlotEnabled === false) {
        return false;
      }

      const deckSlot = deck.slots.find((s) => s.slotId === slot.slotId);
      const hasCard = Boolean(deckSlot?.card || deckSlot?.cardId);

      return !hasCard;
    });
  }
}
