import { fetchPublished, fetchDraftIds, writeDraft } from '../lib/sanityWriter';
import { uploadImageFromUrl } from '../lib/firebaseStorage';
import { scrapeSongList, scrapeSongDetail, ScrapedSong } from '../scrapers/wikiSong';
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

// ---------- 型 ----------

interface PublishedSongSnapshot {
  _id: string;
  songName: string;
}

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
export async function scrapeSongsUseCase(
  prefetchedSongList?: ScrapedSong[]
): Promise<ScrapeSongsResult> {
  console.log('\n=== ScrapeSongsUseCase start ===');

  const scrapedList = prefetchedSongList ?? await scrapeSongList();

  const [publishedSongs, draftIds] = await Promise.all([
    fetchPublished<PublishedSongSnapshot>('song', '_id, songName'),
    fetchDraftIds('song'),
  ]);

  // 楽曲名でルックアップ（song-NNN ID の再利用のため）
  const publishedMap = new Map<string, PublishedSongSnapshot>(
    publishedSongs.map((s) => [s.songName, s])
  );
  const draftSet = new Set(draftIds);

  // 既存 song-NNN の最大番号を取得（新規楽曲の連番割り当て用）
  const allExistingIds = [
    ...publishedSongs.map((s) => s._id),
    ...draftIds,
  ];
  let maxSongNum = allExistingIds.reduce((max, id) => {
    const m = id.match(/^song-(\d+)$/);
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 0);

  console.log(
    `Sanity: ${publishedMap.size} published, ${draftSet.size} drafts`
  );

  const targets: Array<{ song: (typeof scrapedList)[number]; resolvedId: string }> = [];
  for (const song of scrapedList) {
    const published = publishedMap.get(song.songName);
    const resolvedId = published?._id ?? `song-${++maxSongNum}`;
    const hasDraft = draftSet.has(resolvedId);

    if (!published) {
      targets.push({ song, resolvedId });
    } else if (hasDraft) {
      targets.push({ song, resolvedId });
    }
  }

  console.log(
    `Targets: ${targets.length} / ${scrapedList.length} (skipped: ${scrapedList.length - targets.length})`
  );

  const written: string[] = [];

  for (const { song, resolvedId } of targets) {
    try {
      console.log(`  → ${song.songName} (${resolvedId})`);
      let jacketImageUrl: string | undefined;
      let liveAnalyzerImageUrl: string | undefined;

      if (song.songUrl) {
        const detail = await scrapeSongDetail(song.songUrl);

        if (detail.jacketImageUrl?.startsWith('http')) {
          jacketImageUrl = await uploadImageFromUrl(
            detail.jacketImageUrl,
            `songs/${resolvedId}/jacket.webp`
          );
        }
        if (detail.liveAnalyzerImageUrl?.startsWith('http')) {
          liveAnalyzerImageUrl = await uploadImageFromUrl(
            detail.liveAnalyzerImageUrl,
            `songs/${resolvedId}/live-analyzer.webp`
          );
        }
      }

      const participationsResolved = ParticipationResolver.resolve(
        song.category,
        song.singers
      );

      const doc = {
        _id: resolvedId,
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
