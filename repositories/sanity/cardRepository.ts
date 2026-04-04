import { sanityFetch } from '@/repositories/sanity/client';
import type { SanityCard } from '@/types/sanity/cards';
import type {
  Card,
  CardDetail,
  Accessory,
  Stats,
  Skill,
  Trait,
  SidePlacementRule,
} from '@/models/card/Card';
import {
  Rarity,
  StyleType,
  LimitedType,
  FavoriteMode,
} from '@/models/shared/enums';

/** カード一覧フィールド（ページネーション用）*/
const CARD_FIELDS = `
  _id,
  _createdAt,
  _updatedAt,
  cardName,
  characterName,
  rarity,
  styleType,
  limited,
  releaseDate,
  favoriteMode,
  acquisitionMethod,
  awakeBeforeImage,
  awakeAfterImage,
  stats { smile, pure, cool, mental },
  specialAppeal { name, ap, effect },
  skill { name, ap, effect },
  trait { name, effect },
  tokens[] {
    _key,
    parentType,
    name,
    ap,
    effect,
    traitName,
    traitEffect
  },
  sidePlacementRules[] {
    _key,
    characters,
    deckTypes
  }
`;

/** SanityCard ドキュメントを Card モデルに変換する */
function mapSanityCardToCard(doc: SanityCard): Card {
  const accessories: Accessory[] = (doc.tokens ?? []).map((acc) => ({
    id: acc._key,
    cardId: 0,
    parentType: acc.parentType ?? '',
    name: acc.name ?? '',
    ap: acc.ap,
    effect: acc.effect,
    traitName: acc.traitName,
    traitEffect: acc.traitEffect,
  }));

  const stats: Stats = {
    smile: doc.stats?.smile ?? 0,
    pure: doc.stats?.pure ?? 0,
    cool: doc.stats?.cool ?? 0,
    mental: doc.stats?.mental ?? 0,
  };

  const toSkill = (
    s?: { name?: string; ap?: string; effect?: string } | null
  ): Skill | undefined => {
    if (!s) return undefined;
    return { name: s.name ?? '', ap: s.ap, effect: s.effect };
  };

  const toTrait = (
    t?: { name?: string; effect?: string } | null
  ): Trait | undefined => {
    if (!t) return undefined;
    return { name: t.name ?? '', effect: t.effect };
  };

  const detail: CardDetail | undefined =
    doc.favoriteMode !== undefined ||
    doc.acquisitionMethod !== undefined ||
    doc.awakeBeforeImage !== undefined ||
    doc.awakeAfterImage !== undefined ||
    doc.stats !== undefined ||
    doc.specialAppeal !== undefined ||
    doc.skill !== undefined ||
    doc.trait !== undefined
      ? {
          favoriteMode: doc.favoriteMode ?? '',
          acquisitionMethod: doc.acquisitionMethod ?? '',
          awakeBeforeImage: doc.awakeBeforeImage,
          awakeAfterImage: doc.awakeAfterImage,
          stats,
          specialAppeal: toSkill(doc.specialAppeal),
          skill: toSkill(doc.skill),
          trait: toTrait(doc.trait),
          accessories,
        }
      : undefined;

  const sidePlacementRules: SidePlacementRule[] = (
    doc.sidePlacementRules ?? []
  ).map((item) => ({
    characters: item.characters ?? [],
    deckTypes: item.deckTypes,
  }));

  return {
    id: doc._id,
    cardName: doc.cardName ?? '',
    characterName: (doc.characterName ?? []).join('＆'),
    rarity: (doc.rarity as Rarity) ?? Rarity.R,
    styleType: (doc.styleType as StyleType) ?? StyleType.CHEERLEADER,
    limited: (doc.limited as LimitedType) ?? LimitedType.PERMANENT,
    cardUrl: '',
    releaseDate: doc.releaseDate ?? '',
    isLocked: false,
    createdAt: doc._createdAt,
    updatedAt: doc._updatedAt,
    detail,
    accessories,
    sidePlacementRules,
  };
}

/**
 * カード一覧を全件取得する
 */
export async function fetchCards(): Promise<Card[]> {
  const query = `*[_type == "card"] | order(_id asc) {
    ${CARD_FIELDS}
  }`;

  const docs = await sanityFetch<SanityCard[]>(query);
  return docs.map(mapSanityCardToCard);
}

/**
 * _id でカード1件を取得する
 */
export async function fetchCardById(id: string): Promise<Card | null> {
  const query = `*[_type == "card" && _id == $id][0] { ${CARD_FIELDS} }`;
  const doc = await sanityFetch<SanityCard | null>(query, { id });
  return doc ? mapSanityCardToCard(doc) : null;
}

/**
 * 複数の _id でカードをバッチ取得する
 */
export async function fetchCardsByIds(ids: string[]): Promise<Card[]> {
  if (ids.length === 0) return [];
  const query = `*[_type == "card" && _id in $ids] { ${CARD_FIELDS} }`;
  const docs = await sanityFetch<SanityCard[]>(query, { ids });
  return docs.map(mapSanityCardToCard);
}
