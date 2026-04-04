/**
 * ScrapeCardsUseCase のテスト
 *
 * ・スクレイプ結果が Sanity card スキーマの enum 値に正しくマッピングされること
 * ・差分検出ロジック（新規・変更・ドラフト残存・スキップ）が正しく動作すること
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Rarity, StyleType, LimitedType, FavoriteMode, ParentType } from '@/models/shared/enums';

// --- モック ---
const mockFetchPublished = vi.fn();
const mockFetchDraftIds = vi.fn();
const mockWriteDraft = vi.fn();
const mockScrapeCardList = vi.fn();
const mockScrapeCardDetail = vi.fn();
const mockUploadImageFromUrl = vi.fn();

vi.mock('../../lib/sanityWriter', () => ({
  fetchPublished: mockFetchPublished,
  fetchDraftIds: mockFetchDraftIds,
  writeDraft: mockWriteDraft,
}));
vi.mock('../../scrapers/wikiCard', () => ({
  scrapeCardList: mockScrapeCardList,
}));
vi.mock('../../scrapers/wikiCardDetail', () => ({
  scrapeCardDetail: mockScrapeCardDetail,
}));
vi.mock('../../lib/firebaseStorage', () => ({
  uploadImageFromUrl: mockUploadImageFromUrl,
}));

const { scrapeCardsUseCase } = await import('../ScrapeCardsUseCase');

// ---------- フィクスチャ ----------

const SCRAPED_CARD = {
  cardId: 'card-hoshizora-UR01',
  cardName: 'テストカード',
  characterName: '日野下花帆',
  rarity: 'UR',
  limited: '恒常',
  styleType: 'チアリーダー',
  releaseDate: '2024-04-01',
  cardUrl: 'https://wikiwiki.jp/llll_wiki/card-hoshizora-UR01',
};

const SCRAPED_DETAIL = {
  favoriteMode: 'ハッピー',
  acquisitionMethod: 'スカウト',
  awakeBeforeUrl: 'https://example.com/before.webp',
  awakeAfterUrl: 'https://example.com/after.webp',
  stats: { smile: '5000', pure: '4000', cool: '3000', mental: '2500' },
  specialAppeal: { name: 'テストSA', ap: '10', effect: '全体スコアアップ' },
  skill: { name: 'テストスキル', ap: '6', effect: 'スマイルアップ' },
  trait: { name: 'テスト特性', effect: '特性効果' },
  accessories: [] as { parentType: 'special_appeal' | 'skill' | 'trait'; name: string; ap: string; effect: string; traitName: string; traitEffect: string }[],
};

describe('scrapeCardsUseCase()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchDraftIds.mockResolvedValue([]);
    mockScrapeCardDetail.mockResolvedValue(SCRAPED_DETAIL);
    mockUploadImageFromUrl.mockImplementation((url: string) => Promise.resolve(url));
    mockWriteDraft.mockResolvedValue(undefined);
  });

  describe('差分検出ロジック', () => {
    it('新規カード（Sanityに存在しない）は対象になる', async () => {
      mockScrapeCardList.mockResolvedValue([SCRAPED_CARD]);
      mockFetchPublished.mockResolvedValue([]); // 公開済みなし

      const result = await scrapeCardsUseCase();
      expect(result.written).toContain(SCRAPED_CARD.cardName);
    });

    it('公開済みと一致するカードはスキップされる', async () => {
      mockScrapeCardList.mockResolvedValue([SCRAPED_CARD]);
      mockFetchPublished.mockResolvedValue([{
        _id: SCRAPED_CARD.cardId,
        cardName: SCRAPED_CARD.cardName,
        rarity: Rarity.UR,     // マッピング済み値と一致
        limited: LimitedType.PERMANENT,
        styleType: StyleType.CHEERLEADER,
        releaseDate: SCRAPED_CARD.releaseDate,
      }]);

      const result = await scrapeCardsUseCase();
      expect(result.skipped).toBe(1);
      expect(result.written).toHaveLength(0);
    });

    it('公開済みでもドラフト残存の場合は対象になる', async () => {
      mockScrapeCardList.mockResolvedValue([SCRAPED_CARD]);
      mockFetchPublished.mockResolvedValue([{
        _id: SCRAPED_CARD.cardId,
        cardName: SCRAPED_CARD.cardName,
        rarity: Rarity.UR,
        limited: LimitedType.PERMANENT,
        styleType: StyleType.CHEERLEADER,
        releaseDate: SCRAPED_CARD.releaseDate,
      }]);
      mockFetchDraftIds.mockResolvedValue([SCRAPED_CARD.cardId]);

      const result = await scrapeCardsUseCase();
      expect(result.written).toContain(SCRAPED_CARD.cardName);
    });

    it('cardName が変わったカードは対象になる', async () => {
      mockScrapeCardList.mockResolvedValue([SCRAPED_CARD]);
      mockFetchPublished.mockResolvedValue([{
        _id: SCRAPED_CARD.cardId,
        cardName: '旧カード名', // 差分あり
        rarity: Rarity.UR,
        limited: LimitedType.PERMANENT,
        styleType: StyleType.CHEERLEADER,
        releaseDate: SCRAPED_CARD.releaseDate,
      }]);

      const result = await scrapeCardsUseCase();
      expect(result.written).toContain(SCRAPED_CARD.cardName);
    });
  });

  describe('Sanity スキーマへのマッピング', () => {
    beforeEach(() => {
      mockScrapeCardList.mockResolvedValue([SCRAPED_CARD]);
      mockFetchPublished.mockResolvedValue([]);
    });

    it('rarity が Rarity enum 値にマッピングされる（UR）', async () => {
      await scrapeCardsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.rarity).toBe(Rarity.UR);
    });

    it('limited が LimitedType enum 値にマッピングされる（恒常→PERMANENT）', async () => {
      await scrapeCardsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.limited).toBe(LimitedType.PERMANENT);
    });

    it('styleType が StyleType enum 値にマッピングされる（チアリーダー→CHEERLEADER）', async () => {
      await scrapeCardsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.styleType).toBe(StyleType.CHEERLEADER);
    });

    it('favoriteMode が FavoriteMode enum 値にマッピングされる（ハッピー→HAPPY）', async () => {
      await scrapeCardsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.favoriteMode).toBe(FavoriteMode.HAPPY);
    });

    it('stats の各値が number に変換される', async () => {
      await scrapeCardsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.detail.stats.smile).toBe(5000);
      expect(doc.detail.stats.pure).toBe(4000);
      expect(doc.detail.stats.cool).toBe(3000);
      expect(doc.detail.stats.mental).toBe(2500);
    });

    it('specialAppeal.ap が number に変換される', async () => {
      await scrapeCardsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.detail.specialAppeal.ap).toBe(10);
    });

    it('skill.ap が number に変換される', async () => {
      await scrapeCardsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.detail.skill.ap).toBe(6);
    });

    it('characterName が配列で渡される', async () => {
      await scrapeCardsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(Array.isArray(doc.characterName)).toBe(true);
      expect(doc.characterName).toContain('日野下花帆');
    });

    it('_type が "card"', async () => {
      await scrapeCardsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc._type).toBe('card');
    });

    it('_id が cardId と一致する', async () => {
      await scrapeCardsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc._id).toBe(SCRAPED_CARD.cardId);
    });
  });

  describe('accessories のマッピング', () => {
    beforeEach(() => {
      const cardWithAccessory = { ...SCRAPED_CARD };
      const detailWithAccessory = {
        ...SCRAPED_DETAIL,
        accessories: [{
          parentType: 'special_appeal' as const,
          name: 'テストアクセサリ',
          ap: '5',
          effect: 'アクセサリ効果',
          traitName: 'アクセ特性',
          traitEffect: 'アクセ特性効果',
        }],
      };
      mockScrapeCardList.mockResolvedValue([cardWithAccessory]);
      mockFetchPublished.mockResolvedValue([]);
      mockScrapeCardDetail.mockResolvedValue(detailWithAccessory);
    });

    it('parentType が ParentType enum 値にマッピングされる', async () => {
      await scrapeCardsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.accessories[0].parentType).toBe(ParentType.SPECIAL_APPEAL);
    });

    it('accessories.ap が number に変換される', async () => {
      await scrapeCardsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.accessories[0].ap).toBe(5);
    });
  });

  describe('限定種別マッピング', () => {
    const LIMITED_MAP_CASES: Array<[string, LimitedType]> = [
      ['限定', LimitedType.LIMITED],
      ['誕限定', LimitedType.BIRTHDAY_LIMITED],
      ['春限定', LimitedType.SPRING_LIMITED],
      ['夏限定', LimitedType.SUMMER_LIMITED],
      ['秋限定', LimitedType.AUTUMN_LIMITED],
      ['冬限定', LimitedType.WINTER_LIMITED],
      ['LEG限定', LimitedType.LEG_LIMITED],
      ['ログボ', LimitedType.LOGIN_BONUS],
      ['報酬', LimitedType.REWARD],
    ];

    it.each(LIMITED_MAP_CASES)(
      '"%s" が %s にマッピングされる',
      async (japanese, expected) => {
        const card = { ...SCRAPED_CARD, limited: japanese };
        mockScrapeCardList.mockResolvedValue([card]);
        mockFetchPublished.mockResolvedValue([]);

        await scrapeCardsUseCase();

        const [doc] = mockWriteDraft.mock.calls[0];
        expect(doc.limited).toBe(expected);
      }
    );
  });

  describe('スタイルタイプマッピング', () => {
    const STYLE_MAP_CASES: Array<[string, StyleType]> = [
      ['チアリーダー', StyleType.CHEERLEADER],
      ['トリックスター', StyleType.TRICKSTER],
      ['パフォーマー', StyleType.PERFORMER],
      ['ムードメーカー', StyleType.MOODMAKER],
    ];

    it.each(STYLE_MAP_CASES)(
      '"%s" が %s にマッピングされる',
      async (japanese, expected) => {
        const card = { ...SCRAPED_CARD, styleType: japanese };
        mockScrapeCardList.mockResolvedValue([card]);
        mockFetchPublished.mockResolvedValue([]);

        await scrapeCardsUseCase();

        const [doc] = mockWriteDraft.mock.calls[0];
        expect(doc.styleType).toBe(expected);
      }
    );
  });
});
