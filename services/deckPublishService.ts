import { Deck, DeckForCloud, DeckSlotForCloud } from '@/models/Deck';
import { DeckPublicationRequest, PublishedDeck } from '@/models/PublishedDeck';
import { deckRepository } from '@/repositories/api/deckRepository';
import { nanoid } from 'nanoid';

/**
 * Deckをクラウド送信用の形式に変換
 */
function convertToDeckForCloud(deck: Deck): DeckForCloud {
  return {
    id: deck.id,
    name: deck.name,
    slots: deck.slots.map((slot): DeckSlotForCloud => ({
      slotId: slot.slotId,
      cardId: slot.cardId,
      ...(slot.limitBreak && { limitBreak: slot.limitBreak }),
    })),
    aceSlotId: deck.aceSlotId,
    deckType: deck.deckType,
    songId: deck.songId,
    liveGrandPrixId: deck.liveGrandPrixId,
    liveGrandPrixDetailId: deck.liveGrandPrixDetailId,
    score: deck.score,
    memo: deck.memo,
    createdAt: deck.createdAt,
    updatedAt: deck.updatedAt,
  };
}

/**
 * デッキ公開サービス
 * デッキ公開のビジネスロジックを担当
 */
export const deckPublishService = {
  /**
   * デッキを公開する
   * @param deck - 公開するデッキ
   * @param options - 公開オプション（コメント、ハッシュタグ、画像URL）
   * @returns 公開済みデッキ
   */
  async publishDeck(
    deck: Deck,
    options: {
      comment?: string;
      hashtags: string[];
      imageUrls?: string[];
    }
  ): Promise<PublishedDeck> {
    // 公開IDを生成（短くURL-safeな21文字のID）
    // 例: "V1StGXR8_Z5jdHi6B-myT"
    const publicationId = nanoid();

    // DeckPublicationRequestを構築
    const publication: DeckPublicationRequest = {
      id: publicationId,
      deck: convertToDeckForCloud(deck),
      comment: options.comment,
      hashtags: options.hashtags,
      imageUrls: options.imageUrls,
    };

    // Repositoryを通じて公開
    return await deckRepository.publishDeck(publication);
  },
};
