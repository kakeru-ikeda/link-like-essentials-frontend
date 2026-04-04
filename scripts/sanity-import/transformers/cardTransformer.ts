/**
 * GraphQL Card レスポンスの型定義。
 * カスタムインポートクエリが返すフィールドに対応する。
 */

export interface GraphQLStats {
  smile: number;
  pure: number;
  cool: number;
  mental: number;
}

export interface GraphQLSkill {
  name: string;
  ap?: string | null;
  effect?: string | null;
}

export interface GraphQLTrait {
  name: string;
  effect?: string | null;
}

export interface GraphQLAccessory {
  parentType: string;
  name: string;
  ap?: string | null;
  effect?: string | null;
  traitName?: string | null;
  traitEffect?: string | null;
}

export interface GraphQLCardDetail {
  favoriteMode?: string | null;
  acquisitionMethod?: string | null;
  awakeBeforeStorageUrl?: string | null;
  awakeAfterStorageUrl?: string | null;
  stats?: GraphQLStats | null;
  specialAppeal?: GraphQLSkill | null;
  skill?: GraphQLSkill | null;
  trait?: GraphQLTrait | null;
  accessories: GraphQLAccessory[];
}

export interface GraphQLCard {
  id: string;
  cardName: string;
  /** GraphQL では単一文字列。Sanity スキーマでは array のため変換が必要 */
  characterName: string;
  rarity: string;
  styleType?: string | null;
  limited?: string | null;
  releaseDate?: string | null;
  isLocked: boolean;
  detail?: GraphQLCardDetail | null;
}

/**
 * Sanity に投入する card ドキュメントの型。
 * スキーマ定義（repositories/sanity/schemas/card.ts）に準拠。
 */
export interface SanityToken {
  _key: string;
  parentType: string;
  name: string;
  ap?: string;
  effect?: string;
  traitName?: string;
  traitEffect?: string;
}

export interface SanityCard {
  _id: string;
  _type: 'card';
  cardName: string;
  characterName: string[];
  rarity?: string;
  styleType?: string;
  limited?: string;
  releaseDate?: string;
  favoriteMode?: string;
  acquisitionMethod?: string;
  awakeBeforeImage?: string;
  awakeAfterImage?: string;
  stats?: GraphQLStats;
  specialAppeal?: GraphQLSkill;
  skill?: GraphQLSkill;
  trait?: GraphQLTrait;
  tokens: SanityToken[];
}

/**
 * GraphQL の Card レスポンスを Sanity ドキュメント形式に変換する。
 *
 * - `characterName` (string) → `[characterName]` (array) に変換
 * - `detail.*` フィールドをカードドキュメント直下に inline 展開
 * - `accessories` → `tokens` にリネーム（`id` / `cardId` は除外）
 * - `cardUrl` / `isLocked` / `createdAt` / `updatedAt` は Sanity スキーマに存在しないため除外
 * - `isLocked` は無視して全件 published として投入
 * - `sidePlacementRules` は GraphQL に存在しないためスキップ
 */
export function transformCard(card: GraphQLCard): SanityCard {
  const doc: SanityCard = {
    _id: `card-${card.id}`,
    _type: 'card',
    cardName: card.cardName,
    characterName: card.characterName
      .split('＆')
      .map((s) => s.trim())
      .filter(Boolean),
    tokens: [],
  };

  if (card.rarity) doc.rarity = card.rarity;
  if (card.styleType) doc.styleType = card.styleType;
  if (card.limited) doc.limited = card.limited;
  if (card.releaseDate) doc.releaseDate = card.releaseDate.slice(0, 10);

  const detail = card.detail;
  if (detail) {
    if (detail.favoriteMode) doc.favoriteMode = detail.favoriteMode;
    if (detail.acquisitionMethod) doc.acquisitionMethod = detail.acquisitionMethod;
    if (detail.awakeBeforeStorageUrl) doc.awakeBeforeImage = detail.awakeBeforeStorageUrl;
    if (detail.awakeAfterStorageUrl) doc.awakeAfterImage = detail.awakeAfterStorageUrl;
    if (detail.stats) doc.stats = detail.stats;
    if (detail.specialAppeal) doc.specialAppeal = detail.specialAppeal;
    if (detail.skill) doc.skill = detail.skill;
    if (detail.trait) doc.trait = detail.trait;

    if (detail.accessories && detail.accessories.length > 0) {
      doc.tokens = detail.accessories.map((acc, i) => {
        const token: SanityToken = {
          _key: `token-${card.id}-${i}`,
          parentType: acc.parentType,
          name: acc.name,
        };
        if (acc.ap) token.ap = acc.ap;
        if (acc.effect) token.effect = acc.effect;
        if (acc.traitName) token.traitName = acc.traitName;
        if (acc.traitEffect) token.traitEffect = acc.traitEffect;
        return token;
      });
    }
  }

  return doc;
}
