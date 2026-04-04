import {
  fetchDraftIds,
  fetchPublished,
  writeDraft,
} from '../lib/sanityWriter';
import { uploadImageFromUrl } from '../lib/firebaseStorage';
import { scrapeCardList, ScrapedCard } from '../scrapers/wikiCard';
import { scrapeCardDetail } from '../scrapers/wikiCardDetail';
import {
  Rarity,
  StyleType,
  LimitedType,
  FavoriteMode,
  ParentType,
} from '@/models/shared/enums';
import { CHARACTER_NAME_MAP } from '@/config/characters';

// ---------- マッパー ----------

const RARITY_MAP: Record<string, Rarity> = {
  UR: Rarity.UR,
  SR: Rarity.SR,
  R: Rarity.R,
  DR: Rarity.DR,
  BR: Rarity.BR,
  LR: Rarity.LR,
};

const STYLE_TYPE_MAP: Record<string, StyleType> = {
  チアリーダー: StyleType.CHEERLEADER,
  トリックスター: StyleType.TRICKSTER,
  パフォーマー: StyleType.PERFORMER,
  ムードメーカー: StyleType.MOODMAKER,
};

const LIMITED_MAP: Record<string, LimitedType> = {
  恒常: LimitedType.PERMANENT,
  限定: LimitedType.LIMITED,
  誕限定: LimitedType.BIRTHDAY_LIMITED,
  春限定: LimitedType.SPRING_LIMITED,
  夏限定: LimitedType.SUMMER_LIMITED,
  秋限定: LimitedType.AUTUMN_LIMITED,
  冬限定: LimitedType.WINTER_LIMITED,
  LEG限定: LimitedType.LEG_LIMITED,
  混限定: LimitedType.SHUFFLE_LIMITED,
  撃限定: LimitedType.BATTLE_LIMITED,
  バンドリ限定: LimitedType.BANGDREAM_LIMITED,
  宴限定: LimitedType.PARTY_LIMITED,
  活限定: LimitedType.ACTIVITY_LIMITED,
  卒限定: LimitedType.GRADUATE_LIMITED,
  ログボ: LimitedType.LOGIN_BONUS,
  報酬: LimitedType.REWARD,
};

const FAVORITE_MODE_MAP: Record<string, FavoriteMode> = {
  ハッピー: FavoriteMode.HAPPY,
  メロウ: FavoriteMode.MELLOW,
  ニュートラル: FavoriteMode.NEUTRAL,
  なし: FavoriteMode.NONE,
};

const PARENT_TYPE_MAP: Record<string, ParentType> = {
  special_appeal: ParentType.SPECIAL_APPEAL,
  skill: ParentType.SKILL,
  trait: ParentType.TRAIT,
};

// ---------- ヘルパー ----------

/**
 * キャラクター名文字列を正規化して配列に変換
 * 例: "花帆＆さやか＆瑠璃乃" → ["日野下花帆", "村野さやか", "大沢瑠璃乃"]
 */
function parseCharacterNames(raw: string): string[] {
  return raw
    .split(/[&＆]/)  
    .map((name) => {
      const trimmed = name.trim();
      return CHARACTER_NAME_MAP[trimmed] ?? trimmed;
    })
    .filter(Boolean);
}

interface PublishedCardSnapshot {
  _id: string;
  cardName: string;
  characterName?: string[];
}

/** 既存 Sanity ドキュメントとの照合キー（cardName + 最初のキャラクター名） */
function nameKey(cardName: string, characterName: string): string {
  return `${cardName}:${characterName}`;
}

// ---------- メイン ----------

export interface ScrapeCardsResult {
  total: number;
  written: string[];
  skipped: number;
}

/**
 * カードスクレイプユースケース
 *
 * 1. カード一覧取得（1リクエスト）
 * 2. Sanity 公開済み + ドラフト状況を取得
 * 3. 差分 or ドラフト残存のカードのみ詳細スクレイプ
 * 4. ドラフトとして Sanity に書き込み
 */
export async function scrapeCardsUseCase(): Promise<ScrapeCardsResult> {
  console.log('\n=== ScrapeCardsUseCase start ===');

  // 1. 一覧スクレイプ
  const scrapedList = await scrapeCardList();

  // 2. Sanity 現状取得
  const [publishedCards, draftIds] = await Promise.all([
    fetchPublished<PublishedCardSnapshot>(
      'card',
      '_id, cardName, characterName'
    ),
    fetchDraftIds('card'),
  ]);

  // 既存カードを「カード名:キャラ名」でルックアップ（card-NNN ID の再利用のため）
  const publishedMap = new Map<string, PublishedCardSnapshot>(
    publishedCards.map((c) => [nameKey(c.cardName, c.characterName?.[0] ?? ''), c])
  );
  const draftSet = new Set(draftIds);

  // 既存 card-NNN の最大番号を取得（新規カードの連番割り当て用）
  // published と draft の両方を考慮してズレを防ぐ
  const allExistingIds = [
    ...publishedCards.map((c) => c._id),
    ...draftIds,
  ];
  let maxCardNum = allExistingIds.reduce((max, id) => {
    const m = id.match(/^card-(\d+)$/);
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 0);

  console.log(
    `Sanity: ${publishedMap.size} published, ${draftSet.size} drafts`
  );

  // 3. 対象絞り込み: 新規 or ドラフト残存
  const targets: { card: ScrapedCard; resolvedId: string; characterNames: string[] }[] = [];
  for (const card of scrapedList) {
    const characterNames = parseCharacterNames(card.characterName);
    const key = nameKey(card.cardName, characterNames[0] ?? card.characterName);
    const published = publishedMap.get(key);
    // 既存カードは card-NNN を再利用。新規は card-(maxNum+1) 以降の連番を割り当て
    const resolvedId = published?._id ?? `card-${++maxCardNum}`;
    const hasDraft = draftSet.has(resolvedId);

    if (!published) {
      // 新規カード
      targets.push({ card, resolvedId, characterNames });
    } else if (hasDraft) {
      // 既存ドラフトが残っている（管理者未Publish）
      targets.push({ card, resolvedId, characterNames });
    }
  }

  console.log(
    `Targets: ${targets.length} / ${scrapedList.length} (skipped: ${scrapedList.length - targets.length})`
  );

  const written: string[] = [];

  // 4. 詳細スクレイプ & ドラフト書き込み
  for (const { card, resolvedId, characterNames } of targets) {
    try {
      console.log(`  → ${card.cardName} (${resolvedId})`);
      const detail = await scrapeCardDetail(card.cardUrl);

      // 画像アップロード
      const originalBeforeUrl = detail.awakeBeforeUrl;
      let awakeBeforeUrl = detail.awakeBeforeUrl;
      let awakeAfterUrl = detail.awakeAfterUrl;

      if (awakeBeforeUrl?.startsWith('http')) {
        awakeBeforeUrl = await uploadImageFromUrl(
          awakeBeforeUrl,
          `cards/${resolvedId}/awake-before.webp`
        );
      }
      // 覚醒前後が同一 wiki URL（DR/BR/LR 等）の場合はアップロード済み URL を再利用
      if (awakeAfterUrl?.startsWith('http') && awakeAfterUrl !== originalBeforeUrl) {
        awakeAfterUrl = await uploadImageFromUrl(
          awakeAfterUrl,
          `cards/${resolvedId}/awake-after.webp`
        );
      } else if (awakeAfterUrl === originalBeforeUrl && awakeBeforeUrl) {
        awakeAfterUrl = awakeBeforeUrl;
      }

      // Sanity ドキュメント構築
      const doc: Record<string, unknown> = {
        _id: resolvedId,
        _type: 'card',
        cardName: card.cardName,
        characterName: characterNames,
        rarity: RARITY_MAP[card.rarity] ?? card.rarity,
        limited: LIMITED_MAP[card.limited] ?? card.limited,
        styleType: STYLE_TYPE_MAP[card.styleType] ?? card.styleType,
        releaseDate: card.releaseDate,
        favoriteMode: FAVORITE_MODE_MAP[detail.favoriteMode ?? ''] ?? FavoriteMode.NONE,
        acquisitionMethod: detail.acquisitionMethod,
        awakeBeforeImage: awakeBeforeUrl,
        awakeAfterImage: awakeAfterUrl,
        stats: {
          smile: parseInt(detail.stats.smile) || 0,
          pure: parseInt(detail.stats.pure) || 0,
          cool: parseInt(detail.stats.cool) || 0,
          mental: parseInt(detail.stats.mental) || 0,
        },
        specialAppeal: {
          name: detail.specialAppeal.name,
          ap: detail.specialAppeal.ap,
          effect: detail.specialAppeal.effect,
        },
        skill: {
          name: detail.skill.name,
          ap: detail.skill.ap,
          effect: detail.skill.effect,
        },
        trait: {
          name: detail.trait.name,
          effect: detail.trait.effect,
        },
        tokens: detail.accessories.map((acc, i) => ({
          _key: `token-${i}`,
          parentType: PARENT_TYPE_MAP[acc.parentType] ?? acc.parentType,
          name: acc.name,
          ap: acc.ap,
          effect: acc.effect,
          traitName: acc.traitName,
          traitEffect: acc.traitEffect,
        })),
      };

      await writeDraft(doc as Parameters<typeof writeDraft>[0]);
      written.push(card.cardName);
    } catch (err) {
      console.error(
        `  ✗ Failed: ${card.cardName} - ${(err as Error).message}`
      );
    }
  }

  console.log(`=== ScrapeCardsUseCase done: ${written.length} written ===\n`);
  return {
    total: scrapedList.length,
    written,
    skipped: scrapedList.length - targets.length,
  };
}
