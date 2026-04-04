import { fetchPublishedIds, fetchDraftIds, writeDraft } from '../lib/sanityWriter';
import { uploadImageFromUrl } from '../lib/firebaseStorage';
import { scrapeSongList, scrapeSongDetail } from '../scrapers/wikiSong';
import { DeckType, SongAttribute } from '@/models/shared/enums';
import { ParticipationResolver } from '../lib/participationResolver';

// ---------- マッパー ----------

const ATTRIBUTE_MAP: Record<string, SongAttribute> = {
  スマイル: SongAttribute.SMILE,
  ピュア: SongAttribute.PURE,
  クール: SongAttribute.COOL,
};

const DECK_TYPE_MAP: Record<string, DeckType> = {
  '103期': DeckType.TERM_103,
  '104期': DeckType.TERM_104,
  '105期': DeckType.TERM_105,
  '105期BGP': DeckType.TERM_105_BGP,
  '105期ft.梢': DeckType.TERM_105_FT_KOZUE,
  '105期ft.綴理': DeckType.TERM_105_FT_TSUZURI,
  '105期ft.慈': DeckType.TERM_105_FT_MEGUMI,
};

// ---------- メイン ----------

export interface ScrapeSongsResult {
  total: number;
  written: string[];
  skipped: number;
}

/**
 * 楽曲スクレイプユースケース
 *
 * 1. 楽曲一覧取得（1リクエスト）
 * 2. 新規 or ドラフト残存の楽曲のみ詳細スクレイプ
 * 3. ドラフトとして Sanity に書き込み
 */
export async function scrapesongsUseCase(): Promise<ScrapeSongsResult> {
  console.log('\n=== ScrapeSongsUseCase start ===');

  const scrapedList = await scrapeSongList();

  const [publishedIds, draftIds] = await Promise.all([
    fetchPublishedIds('song'),
    fetchDraftIds('song'),
  ]);

  const publishedSet = new Set(publishedIds);
  const draftSet = new Set(draftIds);

  console.log(
    `Sanity: ${publishedSet.size} published, ${draftSet.size} drafts`
  );

  const targets = scrapedList.filter(
    (s) => !publishedSet.has(s.songId) || draftSet.has(s.songId)
  );

  console.log(
    `Targets: ${targets.length} / ${scrapedList.length} (skipped: ${scrapedList.length - targets.length})`
  );

  const written: string[] = [];

  for (const song of targets) {
    try {
      console.log(`  → ${song.songName} (${song.songId})`);
      let jacketImageUrl: string | undefined;
      let liveAnalyzerImageUrl: string | undefined;

      if (song.songUrl) {
        const detail = await scrapeSongDetail(song.songUrl);

        if (detail.jacketImageUrl?.startsWith('http')) {
          jacketImageUrl = await uploadImageFromUrl(
            detail.jacketImageUrl,
            `songs/${song.songId}/jacket.webp`
          );
        }
        if (detail.liveAnalyzerImageUrl?.startsWith('http')) {
          liveAnalyzerImageUrl = await uploadImageFromUrl(
            detail.liveAnalyzerImageUrl,
            `songs/${song.songId}/live-analyzer.webp`
          );
        }
      }

      const participationsResolved = ParticipationResolver.resolve(
        song.category,
        song.singers
      );

      const doc = {
        _id: song.songId,
        _type: 'song',
        songName: song.songName,
        deckType: DECK_TYPE_MAP[song.category] ?? song.category,
        attribute: ATTRIBUTE_MAP[song.attribute] ?? song.attribute,
        centerCharacter: song.centerCharacter,
        singers: song.singers,
        participations: ParticipationResolver.toArray(participationsResolved),
        jacketImageUrl,
        liveAnalyzerImageUrl,
      };

      await writeDraft(doc);
      written.push(song.songName);
    } catch (err) {
      console.error(
        `  ✗ Failed: ${song.songName} - ${(err as Error).message}`
      );
    }
  }

  console.log(`=== ScrapeSongsUseCase done: ${written.length} written ===\n`);
  return {
    total: scrapedList.length,
    written,
    skipped: scrapedList.length - targets.length,
  };
}
