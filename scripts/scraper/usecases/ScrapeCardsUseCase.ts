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

interface PublishedCardSnapshot {
  _id: string;
  cardUrl?: string;
  cardName: string;
  rarity?: string;
  limited?: string;
  styleType?: string;
  releaseDate?: string;
}

/**
 * スクレイプされたカードと公開済みスナップショットの差分を検出
 */
function hasDiff(
  scraped: ScrapedCard,
  published: PublishedCardSnapshot
): boolean {
  const mappedRarity = RARITY_MAP[scraped.rarity] ?? scraped.rarity;
  const mappedLimited = LIMITED_MAP[scraped.limited] ?? scraped.limited;
  const mappedStyle = STYLE_TYPE_MAP[scraped.styleType] ?? scraped.styleType;

  return (
    scraped.cardName !== published.cardName ||
    mappedRarity !== published.rarity ||
    mappedLimited !== published.limited ||
    mappedStyle !== published.styleType ||
    (scraped.releaseDate !== undefined &&
      scraped.releaseDate !== published.releaseDate)
  );
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
      '_id, cardUrl, cardName, rarity, limited, styleType, releaseDate'
    ),
    fetchDraftIds('card'),
  ]);

  // cardUrl をキーにした照合（IDは card-527 のような連番形式のため）
  const publishedByUrl = new Map<string, PublishedCardSnapshot>(
    publishedCards.filter((c) => c.cardUrl).map((c) => [c.cardUrl!, c])
  );
  const draftSet = new Set(draftIds);

  console.log(
    `Sanity: ${publishedByUrl.size} published, ${draftSet.size} drafts`
  );

  // 3. 対象絞り込み: 新規 or 一覧レベル差分 or ドラフト残存
  const targets: ScrapedCard[] = [];
  for (const card of scrapedList) {
    const published = publishedByUrl.get(card.cardUrl);
    const resolvedId = published?._id ?? card.cardId;
    const hasDraft = draftSet.has(resolvedId);

    if (!published) {
      // 新規カード
      targets.push(card);
    } else if (hasDiff(card, published)) {
      // 一覧情報に変化あり
      targets.push(card);
    } else if (hasDraft) {
      // 既存ドラフトが残っている（管理者未Publish）
      targets.push(card);
    }
  }

  console.log(
    `Targets: ${targets.length} / ${scrapedList.length} (skipped: ${scrapedList.length - targets.length})`
  );

  const written: string[] = [];

  // 4. 詳細スクレイプ & ドラフト書き込み
  for (const card of targets) {
    try {
      const published = publishedByUrl.get(card.cardUrl);
      // 既存ドキュメントがある場合はその _id を使用（card-527 形式を保持）
      const docId = published?._id ?? card.cardId;
      console.log(`  → ${card.cardName} (${docId})`);
      const detail = await scrapeCardDetail(card.cardUrl);

      // 画像アップロード
      let awakeBeforeUrl = detail.awakeBeforeUrl;
      let awakeAfterUrl = detail.awakeAfterUrl;

      if (awakeBeforeUrl?.startsWith('http')) {
        awakeBeforeUrl = await uploadImageFromUrl(
          awakeBeforeUrl,
          `cards/${docId}/awake-before.webp`
        );
      }
      if (awakeAfterUrl?.startsWith('http') && awakeAfterUrl !== awakeBeforeUrl) {
        awakeAfterUrl = await uploadImageFromUrl(
          awakeAfterUrl,
          `cards/${docId}/awake-after.webp`
        );
      } else if (awakeAfterUrl === detail.awakeBeforeUrl && awakeBeforeUrl) {
        awakeAfterUrl = awakeBeforeUrl;
      }

      // Sanity ドキュメント構築
      const doc: Record<string, unknown> = {
        _id: docId,
        _type: 'card',
        cardName: card.cardName,
        characterName: [card.characterName],
        rarity: RARITY_MAP[card.rarity] ?? card.rarity,
        limited: LIMITED_MAP[card.limited] ?? card.limited,
        styleType: STYLE_TYPE_MAP[card.styleType] ?? card.styleType,
        releaseDate: card.releaseDate,
        cardUrl: card.cardUrl,
        favoriteMode: FAVORITE_MODE_MAP[detail.favoriteMode ?? ''] ?? FavoriteMode.NONE,
        acquisitionMethod: detail.acquisitionMethod,
        awakeBeforeUrl,
        awakeAfterUrl,
        detail: {
          stats: {
            smile: parseInt(detail.stats.smile) || 0,
            pure: parseInt(detail.stats.pure) || 0,
            cool: parseInt(detail.stats.cool) || 0,
            mental: parseInt(detail.stats.mental) || 0,
          },
          specialAppeal: {
            name: detail.specialAppeal.name,
            ap: parseInt(detail.specialAppeal.ap) || 0,
            effect: detail.specialAppeal.effect,
          },
          skill: {
            name: detail.skill.name,
            ap: parseInt(detail.skill.ap) || 0,
            effect: detail.skill.effect,
          },
          trait: {
            name: detail.trait.name,
            effect: detail.trait.effect,
          },
        },
        accessories: detail.accessories.map((acc) => ({
          parentType: PARENT_TYPE_MAP[acc.parentType] ?? acc.parentType,
          name: acc.name,
          ap: parseInt(acc.ap) || 0,
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
