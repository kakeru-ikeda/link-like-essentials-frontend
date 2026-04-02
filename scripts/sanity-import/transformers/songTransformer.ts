/**
 * GraphQL Song レスポンスの型定義。
 * GET_SONGS クエリが返すフィールドに対応する。
 * （フロントの Apollo 型には依存しない）
 */
export interface GraphQLSong {
  id: string;
  songName: string;
  songUrl?: string | null;
  /** GraphQL 上では "category" だが Sanity スキーマでは "deckType" にマップする */
  category: string;
  attribute: string;
  centerCharacter: string;
  singers: string;
  participations: string[];
  jacketImageUrl?: string | null;
  liveAnalyzerImageUrl?: string | null;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Sanity に投入する song ドキュメントの型。
 */
export interface SanitySong {
  _id: string;
  _type: 'song';
  songName: string;
  deckType: string;
  attribute: string;
  centerCharacter: string;
  singers: string;
  participations: string[];
  jacketImageUrl?: string;
  liveAnalyzerImageUrl?: string;
}

/**
 * GraphQL の Song レスポンスを Sanity ドキュメント形式に変換する。
 *
 * - `category` → `deckType` にリネーム
 * - `isLocked` は songs では無視し、全件 published として投入する
 * - `moodProgressions` / `songUrl` / `createdAt` / `updatedAt` は Sanity スキーマに存在しないため除外
 */
export function transformSong(song: GraphQLSong): SanitySong {
  const _id = `song-${song.id}`;

  const doc: SanitySong = {
    _id,
    _type: 'song',
    songName: song.songName,
    deckType: song.category,
    attribute: song.attribute,
    centerCharacter: song.centerCharacter,
    singers: song.singers,
    participations: song.participations,
  };

  if (song.jacketImageUrl) {
    doc.jacketImageUrl = song.jacketImageUrl;
  }
  if (song.liveAnalyzerImageUrl) {
    doc.liveAnalyzerImageUrl = song.liveAnalyzerImageUrl;
  }

  return doc;
}
