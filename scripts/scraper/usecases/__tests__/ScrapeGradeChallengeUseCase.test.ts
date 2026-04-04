/**
 * ScrapeGradeChallengeUseCase のテスト
 *
 * ・startDate/endDate が 'YYYY-MM-DD' 形式（Sanity date 型）に変換されること
 * ・songUrl が { _type: 'reference', _ref: songId } 形式に変換されること
 * ・新規 / スキップ判定が正しく動作すること
 * ・stages（details）がスキーマに合うよう整形されること
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- モック ---
const mockFetchPublishedIds = vi.fn();
const mockFetchDraftIds = vi.fn();
const mockWriteDraft = vi.fn();
const mockScrapeGradeChallengeAll = vi.fn();

vi.mock('../../lib/sanityWriter', () => ({
  fetchPublishedIds: mockFetchPublishedIds,
  fetchDraftIds: mockFetchDraftIds,
  writeDraft: mockWriteDraft,
}));
vi.mock('../../scrapers/wikiGradeChallenge', () => ({
  scrapeGradeChallengeAll: mockScrapeGradeChallengeAll,
}));

const { scrapeGradeChallengeUseCase } = await import('../ScrapeGradeChallengeUseCase');

// ---------- フィクスチャ ----------

const SCRAPED_GC = {
  challengeId: 'gc-2025-04',
  title: '2025年4月グレードチャレンジ',
  termName: '105期',
  startDate: '2025-04-01T00:00:00.000Z',
  endDate: '2025-04-07T00:00:00.000Z',
  detailUrl: 'https://wikiwiki.jp/llll_wiki/GC-2025-04',
  stages: [
    {
      stageName: 'A',
      specialEffect: '全体スコアアップ',
      songUrl: 'https://wikiwiki.jp/llll_wiki/KohnoBlossom',
      sectionEffects: [
        { sectionName: 'セクション1', effect: 'スマイルアップ', sectionOrder: 1 },
        { sectionName: 'セクション2', effect: 'ピュアアップ', sectionOrder: 2 },
        { sectionName: 'フィーバー', effect: 'スコアアップ', sectionOrder: 3 },
      ],
    },
    {
      stageName: 'B',
      specialEffect: 'クールブースト',
      songUrl: undefined,
      sectionEffects: [
        { sectionName: 'セクション1', effect: 'クールアップ', sectionOrder: 1 },
      ],
    },
  ],
};

describe('scrapeGradeChallengeUseCase()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchDraftIds.mockResolvedValue([]);
    mockWriteDraft.mockResolvedValue(undefined);
  });

  describe('新規 / スキップ判定', () => {
    it('新規 GC は対象になる', async () => {
      mockFetchPublishedIds.mockResolvedValue([]);
      mockScrapeGradeChallengeAll.mockResolvedValue([SCRAPED_GC]);

      const result = await scrapeGradeChallengeUseCase();
      expect(result.written).toContain(SCRAPED_GC.title);
    });

    it('公開済み GC はスキップされる', async () => {
      mockFetchPublishedIds.mockResolvedValue([SCRAPED_GC.challengeId]);
      mockScrapeGradeChallengeAll.mockResolvedValue([SCRAPED_GC]);

      const result = await scrapeGradeChallengeUseCase();
      expect(result.skipped).toBe(1);
      expect(result.written).toHaveLength(0);
    });

    it('公開済みでもドラフト残存の場合は対象になる', async () => {
      mockFetchPublishedIds.mockResolvedValue([SCRAPED_GC.challengeId]);
      mockFetchDraftIds.mockResolvedValue([SCRAPED_GC.challengeId]);
      mockScrapeGradeChallengeAll.mockResolvedValue([SCRAPED_GC]);

      const result = await scrapeGradeChallengeUseCase();
      expect(result.written).toContain(SCRAPED_GC.title);
    });
  });

  describe('Sanity スキーマへのマッピング', () => {
    beforeEach(() => {
      mockFetchPublishedIds.mockResolvedValue([]);
      mockScrapeGradeChallengeAll.mockResolvedValue([SCRAPED_GC]);
    });

    it('_type が "gradeChallenge"', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc._type).toBe('gradeChallenge');
    });

    it('_id が challengeId と一致する', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc._id).toBe(SCRAPED_GC.challengeId);
    });

    it('title が正しく保存される', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.title).toBe(SCRAPED_GC.title);
    });

    it('termName が正しく保存される', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.termName).toBe(SCRAPED_GC.termName);
    });

    it('startDate が YYYY-MM-DD 形式に変換される', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.startDate).toBe('2025-04-01');
    });

    it('endDate が YYYY-MM-DD 形式に変換される', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.endDate).toBe('2025-04-07');
    });

    it('detailUrl が保存される', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.detailUrl).toBe(SCRAPED_GC.detailUrl);
    });

    it('details が配列で返る', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(Array.isArray(doc.details)).toBe(true);
      expect(doc.details).toHaveLength(2);
    });

    it('ステージ A の stageName が正しく保存される', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.details[0].stageName).toBe('A');
    });

    it('ステージ A の specialEffect が正しく保存される', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.details[0].specialEffect).toBe('全体スコアアップ');
    });

    it('ステージ A の song が reference 形式に変換される', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.details[0].song).toEqual({
        _type: 'reference',
        _ref: 'KohnoBlossom',
      });
    });

    it('songUrl が undefined のステージは song が undefined', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.details[1].song).toBeUndefined();
    });

    it('ステージ A の sectionEffects が 3 件', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.details[0].sectionEffects).toHaveLength(3);
    });

    it('sectionEffects の sectionOrder が保持される', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      const orders = doc.details[0].sectionEffects.map(
        (se: { sectionOrder: number }) => se.sectionOrder
      );
      expect(orders).toEqual([1, 2, 3]);
    });

    it('フィーバーが sectionEffects に含まれる', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      const fever = doc.details[0].sectionEffects.find(
        (se: { sectionName: string }) => se.sectionName.includes('フィーバー')
      );
      expect(fever).toBeDefined();
      expect(fever.effect).toBe('スコアアップ');
    });

    it('各 detail オブジェクトに _type: "object" が付く', async () => {
      await scrapeGradeChallengeUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.details[0]._type).toBe('object');
    });
  });

  describe('stages が undefined の場合', () => {
    it('stages が undefined でも details が空配列になる', async () => {
      mockFetchPublishedIds.mockResolvedValue([]);
      mockScrapeGradeChallengeAll.mockResolvedValue([
        { ...SCRAPED_GC, stages: undefined },
      ]);

      await scrapeGradeChallengeUseCase();

      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.details).toEqual([]);
    });
  });

  describe('songUrl → songId 変換', () => {
    it('wiki URL パスが songId に変換される', async () => {
      mockFetchPublishedIds.mockResolvedValue([]);
      const gcWithLongUrl = {
        ...SCRAPED_GC,
        stages: [{
          ...SCRAPED_GC.stages[0],
          songUrl: 'https://wikiwiki.jp/llll_wiki/Edel-BrilliantGreen',
        }],
      };
      mockScrapeGradeChallengeAll.mockResolvedValue([gcWithLongUrl]);

      await scrapeGradeChallengeUseCase();

      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.details[0].song._ref).toBe('Edel-BrilliantGreen');
    });
  });
});
