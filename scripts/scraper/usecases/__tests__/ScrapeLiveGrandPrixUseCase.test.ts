/**
 * ScrapeLiveGrandPrixUseCase のテスト
 *
 * ・yearTerm が Sanity liveGrandPrix スキーマの YearTerm enum 値に正しくマッピングされること
 * ・startDate/endDate が 'YYYY-MM-DD' 形式（Sanity date 型）に変換されること
 * ・songUrl が { _type: 'reference', _ref: songId } 形式に変換されること
 * ・Sanity公開済みデータと名前ベースでマッチングし、新規/スキップ判定が正しく動作すること
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { YearTerm } from '@/models/shared/enums';

// --- モック ---
const mockFetchPublished = vi.fn();
const mockFetchDrafts = vi.fn();
const mockWriteDraft = vi.fn();
const mockScrapeLiveGrandPrixList = vi.fn();
const mockScrapeLiveGrandPrixDetail = vi.fn();
const mockScrapeSongList = vi.fn();

vi.mock('../../lib/sanityWriter', () => ({
  fetchPublished: mockFetchPublished,
  fetchDrafts: mockFetchDrafts,
  writeDraft: mockWriteDraft,
}));
vi.mock('../../scrapers/wikiLiveGrandPrix', () => ({
  scrapeLiveGrandPrixList: mockScrapeLiveGrandPrixList,
  scrapeLiveGrandPrixDetail: mockScrapeLiveGrandPrixDetail,
}));
vi.mock('../../scrapers/wikiSong', () => ({
  scrapeSongList: mockScrapeSongList,
}));

const { scrapeLiveGrandPrixUseCase } = await import('../ScrapeLiveGrandPrixUseCase');

// ---------- フィクスチャ ----------

const STAGES = [
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
];

const SCRAPED_EVENT = {
  eventId: 'lgp-105-SpringLGP',
  eventName: '春の祭典LGP',
  yearTerm: '105期',
  startDate: '2025-04-10T00:00:00.000Z',
  endDate: '2025-04-14T00:00:00.000Z',
  eventUrl: 'https://wikiwiki.jp/llll_wiki/LGP-105-Spring',
  stages: undefined as typeof STAGES | undefined,
};

describe('scrapeLiveGrandPrixUseCase()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchDrafts.mockResolvedValue([]);
    mockWriteDraft.mockResolvedValue(undefined);
    mockScrapeLiveGrandPrixDetail.mockResolvedValue(STAGES);
    mockScrapeSongList.mockResolvedValue([]);
  });

  describe('新規 / スキップ判定', () => {
    it('新規イベントは対象になる', async () => {
      mockFetchPublished.mockResolvedValue([]);
      mockScrapeLiveGrandPrixList.mockResolvedValue([SCRAPED_EVENT]);

      const result = await scrapeLiveGrandPrixUseCase();
      expect(result.written).toContain(SCRAPED_EVENT.eventName);
    });

    it('公開済みイベントはスキップされる', async () => {
      mockFetchPublished.mockResolvedValue([
        { _id: 'liveGrandPrix-1', eventName: SCRAPED_EVENT.eventName, yearTerm: SCRAPED_EVENT.yearTerm },
      ]);
      mockScrapeLiveGrandPrixList.mockResolvedValue([SCRAPED_EVENT]);

      const result = await scrapeLiveGrandPrixUseCase();
      expect(result.skipped).toBe(1);
      expect(result.written).toHaveLength(0);
    });

    it('公開済みでもドラフト残存の場合は対象になる', async () => {
      mockFetchPublished.mockResolvedValue([
        { _id: 'liveGrandPrix-1', eventName: SCRAPED_EVENT.eventName, yearTerm: SCRAPED_EVENT.yearTerm },
      ]);
      mockFetchDrafts.mockResolvedValue([
        { _id: 'liveGrandPrix-1', eventName: SCRAPED_EVENT.eventName, yearTerm: SCRAPED_EVENT.yearTerm },
      ]);
      mockScrapeLiveGrandPrixList.mockResolvedValue([SCRAPED_EVENT]);

      const result = await scrapeLiveGrandPrixUseCase();
      expect(result.written).toContain(SCRAPED_EVENT.eventName);
    });

    it('ドラフトのみ存在（未公開）の場合は既存 _id を再利用する', async () => {
      mockFetchPublished.mockResolvedValue([]);
      mockFetchDrafts.mockResolvedValue([
        { _id: 'liveGrandPrix-99', eventName: SCRAPED_EVENT.eventName, yearTerm: SCRAPED_EVENT.yearTerm },
      ]);
      mockScrapeLiveGrandPrixList.mockResolvedValue([SCRAPED_EVENT]);

      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc._id).toBe('liveGrandPrix-99');
    });
  });

  describe('Sanity スキーマへのマッピング', () => {
    beforeEach(() => {
      mockFetchPublished.mockResolvedValue([]);
      mockScrapeLiveGrandPrixList.mockResolvedValue([SCRAPED_EVENT]);
    });

    it('_type が "liveGrandPrix"', async () => {
      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc._type).toBe('liveGrandPrix');
    });

    it('_id が "liveGrandPrix-NNN" 形式になる（新規）', async () => {
      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc._id).toBe('liveGrandPrix-1');
    });

    it('公開済みドラフトは既存 _id が再利用される', async () => {
      mockFetchPublished.mockResolvedValue([
        { _id: 'liveGrandPrix-42', eventName: SCRAPED_EVENT.eventName, yearTerm: SCRAPED_EVENT.yearTerm },
      ]);
      mockFetchDrafts.mockResolvedValue([
        { _id: 'liveGrandPrix-42', eventName: SCRAPED_EVENT.eventName, yearTerm: SCRAPED_EVENT.yearTerm },
      ]);
      mockScrapeLiveGrandPrixList.mockResolvedValue([SCRAPED_EVENT]);

      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc._id).toBe('liveGrandPrix-42');
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
      mockFetchPublished.mockImplementation((type: string) => {
        if (type === 'song') return Promise.resolve([{ _id: 'song-1', songName: 'KohnoBlossom' }]);
        return Promise.resolve([]);
      });
      mockScrapeSongList.mockResolvedValue([
        { songName: 'KohnoBlossom', songUrl: 'https://wikiwiki.jp/llll_wiki/KohnoBlossom' },
      ]);

      await scrapeLiveGrandPrixUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      const stageA = doc.details[0];
      expect(stageA.song).toEqual({
        _type: 'reference',
        _ref: 'song-1',
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
        mockFetchPublished.mockResolvedValue([]);
        mockScrapeLiveGrandPrixList.mockResolvedValue([
          { ...SCRAPED_EVENT, yearTerm },
        ]);

        await scrapeLiveGrandPrixUseCase();

        const [doc] = mockWriteDraft.mock.calls[0];
        expect(doc.yearTerm).toBe(expected);
      }
    );
  });

  describe('songUrl → songId 変換', () => {
    it('scrapeSongList と publishedSongs の組み合わせで song._ref が解決される', async () => {
      mockFetchPublished.mockImplementation((type: string) => {
        if (type === 'song') return Promise.resolve([{ _id: 'song-42', songName: 'テスト楽曲' }]);
        return Promise.resolve([]);
      });
      mockScrapeLiveGrandPrixList.mockResolvedValue([SCRAPED_EVENT]);
      mockScrapeSongList.mockResolvedValue([
        { songName: 'テスト楽曲', songUrl: 'https://wikiwiki.jp/llll_wiki/SubUnit-Song-Title' },
      ]);
      mockScrapeLiveGrandPrixDetail.mockResolvedValue([{
        ...STAGES[0],
        songUrl: 'https://wikiwiki.jp/llll_wiki/SubUnit-Song-Title',
      }]);

      await scrapeLiveGrandPrixUseCase();

      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.details[0].song).toEqual({ _type: 'reference', _ref: 'song-42' });
    });

    it('scrapeSongList に存在しない songUrl は undefined になる', async () => {
      mockFetchPublished.mockResolvedValue([]);
      mockScrapeLiveGrandPrixList.mockResolvedValue([SCRAPED_EVENT]);
      mockScrapeSongList.mockResolvedValue([]);
      mockScrapeLiveGrandPrixDetail.mockResolvedValue([{
        ...STAGES[0],
        songUrl: 'https://wikiwiki.jp/llll_wiki/Unknown-Song',
      }]);

      await scrapeLiveGrandPrixUseCase();

      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.details[0].song).toBeUndefined();
    });
  });
});
