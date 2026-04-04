/**
 * ScrapeSongsUseCase のテスト
 *
 * ・楽曲カテゴリ/属性が Sanity song スキーマの enum 値に正しくマッピングされること
 * ・participations が ParticipationResolver 経由で配列に変換されること
 * ・新規 / スキップ判定ロジックが正しく動作すること
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeckType, SongAttribute } from '@/models/shared/enums';

// --- モック ---
const mockFetchPublished = vi.fn();
const mockFetchDraftIds = vi.fn();
const mockWriteDraft = vi.fn();
const mockScrapeSongList = vi.fn();
const mockScrapeSongDetail = vi.fn();
const mockUploadImageFromUrl = vi.fn();

vi.mock('../../lib/sanityWriter', () => ({
  fetchPublished: mockFetchPublished,
  fetchDraftIds: mockFetchDraftIds,
  writeDraft: mockWriteDraft,
}));
vi.mock('../../scrapers/wikiSong', () => ({
  scrapeSongList: mockScrapeSongList,
  scrapeSongDetail: mockScrapeSongDetail,
}));
vi.mock('../../lib/firebaseStorage', () => ({
  uploadImageFromUrl: mockUploadImageFromUrl,
}));

// NOTE: 関数名 scrapesongsUseCase（s が小文字）
const { scrapesongsUseCase } = await import('../ScrapeSongsUseCase');

// ---------- フィクスチャ ----------

const SCRAPED_SONG = {
  songId: 'KohnoBlossom',
  songName: '光のコノハナ',
  songUrl: 'https://wikiwiki.jp/llll_wiki/KohnoBlossom',
  category: '105期',
  attribute: 'スマイル',
  centerCharacter: '日野下花帆',
  singers: 'Edel Note',
  participations: undefined as string | undefined,
};

const SCRAPED_DETAIL = {
  jacketImageUrl: 'https://example.com/jacket.webp',
  liveAnalyzerImageUrl: 'https://example.com/la.webp',
};

describe('scrapesongsUseCase()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchDraftIds.mockResolvedValue([]);
    mockScrapeSongDetail.mockResolvedValue(SCRAPED_DETAIL);
    mockUploadImageFromUrl.mockImplementation((url: string) => Promise.resolve(url));
    mockWriteDraft.mockResolvedValue(undefined);
  });

  describe('新規 / スキップ判定', () => {
    it('新規楽曲（Sanityに存在しない）は対象になる', async () => {
      mockScrapeSongList.mockResolvedValue([SCRAPED_SONG]);
      mockFetchPublished.mockResolvedValue([]);

      const result = await scrapesongsUseCase();
      expect(result.written).toContain(SCRAPED_SONG.songName);
    });

    it('公開済み楽曲はスキップされる', async () => {
      mockScrapeSongList.mockResolvedValue([SCRAPED_SONG]);
      mockFetchPublished.mockResolvedValue([{ _id: 'song-1', songName: SCRAPED_SONG.songName }]);

      const result = await scrapesongsUseCase();
      expect(result.skipped).toBe(1);
      expect(result.written).toHaveLength(0);
    });

    it('公開済みでもドラフト残存の場合は対象になる', async () => {
      mockScrapeSongList.mockResolvedValue([SCRAPED_SONG]);
      mockFetchPublished.mockResolvedValue([{ _id: 'song-1', songName: SCRAPED_SONG.songName }]);
      mockFetchDraftIds.mockResolvedValue(['song-1']);

      const result = await scrapesongsUseCase();
      expect(result.written).toContain(SCRAPED_SONG.songName);
    });

    it('新規楽曲の _id が song-NNN 形式の連番になる', async () => {
      mockScrapeSongList.mockResolvedValue([SCRAPED_SONG]);
      mockFetchPublished.mockResolvedValue([{ _id: 'song-50', songName: '別の楽曲' }]);

      await scrapesongsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc._id).toBe('song-51');
    });
  });

  describe('Sanity スキーマへのマッピング', () => {
    beforeEach(() => {
      mockScrapeSongList.mockResolvedValue([SCRAPED_SONG]);
      mockFetchPublished.mockResolvedValue([]);
    });

    it('_type が "song"', async () => {
      await scrapesongsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc._type).toBe('song');
    });

    it('_id が song-NNN 形式になる', async () => {
      await scrapesongsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc._id).toMatch(/^song-\d+$/);
    });

    it('attribute が SongAttribute.SMILE にマッピングされる', async () => {
      await scrapesongsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.attribute).toBe(SongAttribute.SMILE);
    });

    it('deckType が DeckType.TERM_105 にマッピングされる（105期）', async () => {
      await scrapesongsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.deckType).toBe(DeckType.TERM_105);
    });

    it('participations が配列に変換される', async () => {
      await scrapesongsUseCase();
      const [doc] = mockWriteDraft.mock.calls[0];
      expect(Array.isArray(doc.participations)).toBe(true);
    });
  });

  describe('属性マッピング（attribute）', () => {
    const ATTRIBUTE_CASES: Array<[string, SongAttribute]> = [
      ['スマイル', SongAttribute.SMILE],
      ['ピュア', SongAttribute.PURE],
      ['クール', SongAttribute.COOL],
    ];

    it.each(ATTRIBUTE_CASES)(
      '"%s" が %s にマッピングされる',
      async (japanese, expected) => {
        mockScrapeSongList.mockResolvedValue([{ ...SCRAPED_SONG, attribute: japanese }]);
        mockFetchPublished.mockResolvedValue([]);

        await scrapesongsUseCase();

        const [doc] = mockWriteDraft.mock.calls[0];
        expect(doc.attribute).toBe(expected);
      }
    );
  });

  describe('カテゴリマッピング（deckType）', () => {
    const DECK_TYPE_CASES: Array<[string, DeckType]> = [
      ['103期', DeckType.TERM_103],
      ['104期', DeckType.TERM_104],
      ['105期', DeckType.TERM_105],
      ['105期BGP', DeckType.TERM_105_BGP],
      ['105期ft.梢', DeckType.TERM_105_FT_KOZUE],
      ['105期ft.綴理', DeckType.TERM_105_FT_TSUZURI],
      ['105期ft.慈', DeckType.TERM_105_FT_MEGUMI],
    ];

    it.each(DECK_TYPE_CASES)(
      '"%s" が %s にマッピングされる',
      async (japanese, expected) => {
        mockScrapeSongList.mockResolvedValue([{ ...SCRAPED_SONG, category: japanese }]);
        mockFetchPublished.mockResolvedValue([]);

        await scrapesongsUseCase();

        const [doc] = mockWriteDraft.mock.calls[0];
        expect(doc.deckType).toBe(expected);
      }
    );
  });

  describe('participations の解決', () => {
    beforeEach(() => {
      mockFetchPublished.mockResolvedValue([]);
    });

    it('Edel Note (105期) の参加者が解決される（桂城泉+セラス）', async () => {
      mockScrapeSongList.mockResolvedValue([
        { ...SCRAPED_SONG, category: '105期', singers: 'Edel Note' },
      ]);

      await scrapesongsUseCase();

      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.participations).toEqual(
        expect.arrayContaining(['桂城泉', 'セラス'])
      );
    });

    it('スリーズブーケ (103期) の参加者が解決される（花帆+梢）', async () => {
      mockScrapeSongList.mockResolvedValue([
        { ...SCRAPED_SONG, songId: 'song-bouquet-103', category: '103期', singers: 'スリーズブーケ' },
      ]);

      await scrapesongsUseCase();

      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.participations).toEqual(
        expect.arrayContaining(['日野下花帆', '乙宗梢'])
      );
    });

    it('ソロ曲（centerCharacter のみ）の参加者が解決される', async () => {
      mockScrapeSongList.mockResolvedValue([
        { ...SCRAPED_SONG, category: '105期', singers: '日野下花帆' },
      ]);

      await scrapesongsUseCase();

      const [doc] = mockWriteDraft.mock.calls[0];
      expect(doc.participations).toContain('日野下花帆');
    });
  });

  describe('画像URL', () => {
    it('songUrl がある場合 scrapeSongDetail が呼ばれる', async () => {
      mockScrapeSongList.mockResolvedValue([SCRAPED_SONG]);
      mockFetchPublished.mockResolvedValue([]);

      await scrapesongsUseCase();

      expect(mockScrapeSongDetail).toHaveBeenCalledWith(SCRAPED_SONG.songUrl);
    });

    it('songUrl がない場合 scrapeSongDetail は呼ばれない', async () => {
      mockScrapeSongList.mockResolvedValue([{ ...SCRAPED_SONG, songUrl: undefined }]);
      mockFetchPublished.mockResolvedValue([]);

      await scrapesongsUseCase();

      expect(mockScrapeSongDetail).not.toHaveBeenCalled();
    });
  });
});
