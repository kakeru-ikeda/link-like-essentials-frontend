/**
 * ScrapeLiveGrandPrixUseCase のテスト
 *
 * ・yearTerm が Sanity liveGrandPrix スキーマの YearTerm enum 値に正しくマッピングされること
 * ・startDate/endDate が 'YYYY-MM-DD' 形式（Sanity date 型）に変換されること
 * ・songUrl が { _type: 'reference', _ref: songId } 形式に変換されること
 * ・新規 / スキップ判定が正しく動作すること
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { YearTerm } from '@/models/shared/enums';

// --- モック ---
const mockFetchPublishedIds = vi.fn();
const mockFetchDraftIds = vi.fn();
const mockWriteDraft = vi.fn();
const mockScrapeLiveGrandPrixAll = vi.fn();

vi.mock('../../lib/sanityWriter', () => ({
  fetchPublishedIds: mockFetchPublishedIds,
  fetchDraftIds: mockFetchDraftIds,
  writeDraft: mockWriteDraft,
}));
vi.mock('../../scrapers/wikiLiveGrandPrix', () => ({
  scrapeLiveGrandPrixAll: mockScrapeLiveGrandPrixAll,
}));

const { scrapeLiveGrandPrixUseCase } = await import('../ScrapeLiveGrandPrixUseCase');

// ---------- フィクスチャ ----------

const SCRAPED_EVENT = {
  eventId: 'lgp-105-SpringLGP',
  eventName: '春の祭典LGP',
  yearTerm: '105期',
  startDate: '2025-04-10T00:00:00.000Z',
  endDate: '2025-04-14T00:00:00.000Z',
  eventUrl: 'https://wikiwiki.jp/llll_wiki/LGP-105-Spring',
  stages: [
    {
      stageName: 'A',
      specialEffect: 'スコアアップ(全体)',
      songUrl: 'https://wikiwiki.jp/llll_wiki/KohnoBlossom',
      sectionEffects: [
        { sectionName: 'セクション1', effect: 'スマイルアップ', sectionOrder: 1 },
        { sectionName: 'フィーバー', effect: 'スコアアップ', sectionOrder: 2 },
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

describe('scrapeLiveGrandPrixUseCase()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchDraftIds.mockResolvedValue([]);
    mockWriteDraft.mockResolvedValue(undefined);
  });

  describe('新規 / スキップ判定', () => {
    it('新規イベントは対象になる', async () => {
      mockFetchPublishedIds.mockResolvedValue([]);
      mockScrapeLiveGrandPrixAll.mockResolvedValue([SCRAPED_EVENT]);

      const result = await scrapeLiveGrandPrixUseCase();
      expect(result.written).toContain(SCRAPED_EVENT.eventName);
    });

    it('公開済みイベントはスキップされる', async () => {
      mockFetchPublishedIds.mockResolvedValue([SCRAPED_EVENT.eventId]);
      mockScrapeLiveGrandPrixAll.mockResolvedValue([SCRAPED_EVENT]);

      const result = await scrapeLiveGrandPrixUseCase();
      expect(result.skipped).toBe(1);
      expect(result.written).toHaveLength(0);
    });

    it('公開済みでもドラフト残存の場合は対象になる', async () => {
      mockFetchPublishedIds.mockResolvedValue([SCRAPED_EVENT.eventId]);
      mockFetchDraftIds.mockResolvedValue([SCRAPED_EVENT.eventId]);
      mockScrapeLiveGrandPrixAll.mockResolvedValue([SCRAPED_EVENT]);

      const result = await scrapeLiveGrandPrixUseCase();
      expect(result.written).toContain(SCRAPED_EVENT.eventName);
    });
  });

  describe('Sanity スキーマへのマッピング', () => {
    beforeEach(() => {
      mockFetchPublishedIds.mockResolvedValue([]);
      mockScrapeLiveGrandPrixAll.mockResolvedValue([SCRAPED_EVENT]);
    });

    it('_type が "liveGrandPrix"', async () => {
      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc._type).toBe('liveGrandPrix');
    });

    it('_id が eventId と一致する', async () => {
      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc._id).toBe(SCRAPED_EVENT.eventId);
    });

    it('yearTerm が YearTerm.TERM_105 にマッピングされる', async () => {
      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.yearTerm).toBe(YearTerm.TERM_105);
    });

    it('startDate が YYYY-MM-DD 形式に変換される', async () => {
      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.startDate).toBe('2025-04-10');
    });

    it('endDate が YYYY-MM-DD 形式に変換される', async () => {
      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.endDate).toBe('2025-04-14');
    });

    it('details が配列で返る', async () => {
      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(Array.isArray(doc.details)).toBe(true);
      expect(doc.details).toHaveLength(2);
    });

    it('ステージ A の specialEffect が正しく保存される', async () => {
      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      const stageA = doc.details[0];
      expect(stageA.specialEffect).toBe('スコアアップ(全体)');
    });

    it('ステージ A の song が reference 形式に変換される', async () => {
      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      const stageA = doc.details[0];
      expect(stageA.song).toEqual({
        _type: 'reference',
        _ref: 'KohnoBlossom',
      });
    });

    it('songUrl が undefined のステージは song が undefined', async () => {
      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      const stageB = doc.details[1];
      expect(stageB.song).toBeUndefined();
    });

    it('sectionEffects が正しく保存される', async () => {
      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      const stageA = doc.details[0];
      expect(stageA.sectionEffects).toHaveLength(2);
      expect(stageA.sectionEffects[0].sectionOrder).toBe(1);
    });
  });

  describe('yearTerm マッピング（全期）', () => {
    const YEAR_TERM_CASES: Array<[string, YearTerm]> = [
      ['103期', YearTerm.TERM_103],
      ['104期', YearTerm.TERM_104],
      ['105期', YearTerm.TERM_105],
    ];

    it.each(YEAR_TERM_CASES)(
      '"%s" が %s にマッピングされる',
      async (yearTerm, expected) => {
        mockFetchPublishedIds.mockResolvedValue([]);
        mockScrapeLiveGrandPrixAll.mockResolvedValue([
          { ...SCRAPED_EVENT, eventId: `lgp-test-${yearTerm}`, yearTerm },
        ]);

        await scrapeLiveGrandPrixUseCase();

        const [doc] = mockWriteDraft.mock.calls[0];
        expect(doc.yearTerm).toBe(expected);
      }
    );
  });

  describe('songUrl → songId 変換', () => {
    it('wiki URL パスが songId に変換される', async () => {
      mockFetchPublishedIds.mockResolvedValue([]);
      const eventWith105BGPSong = {
        ...SCRAPED_EVENT,
        stages: [{
          ...SCRAPED_EVENT.stages[0],
          songUrl: 'https://wikiwiki.jp/llll_wiki/SubUnit-Song-Title',
        }],
      };
      mockScrapeLiveGrandPrixAll.mockResolvedValue([eventWith105BGPSong]);

      await scrapeLiveGrandPrixUseCase();

      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.details[0].song._ref).toBe('SubUnit-Song-Title');
    });

    it('スラッシュを含むURLも正しく songId に変換される', async () => {
      mockFetchPublishedIds.mockResolvedValue([]);
      const eventWithSlashUrl = {
        ...SCRAPED_EVENT,
        stages: [{
          ...SCRAPED_EVENT.stages[0],
          songUrl: 'https://wikiwiki.jp/llll_wiki/Song/Detail',
        }],
      };
      mockScrapeLiveGrandPrixAll.mockResolvedValue([eventWithSlashUrl]);

      await scrapeLiveGrandPrixUseCase();

      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.details[0].song._ref).toBe('Song-Detail');
    });
  });
});
