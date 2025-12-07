import { useQuery } from '@apollo/client';
import {
  GET_SONGS,
  GET_SONG_BY_ID,
  GET_SONG_BY_NAME,
  GET_SONG_STATS,
} from '@/repositories/graphql/queries/songs';
import { Song, SongStats } from '@/models/Song';
import { SongFilter } from '@/models/Filter';

interface SongsQueryData {
  songs: Song[];
}

interface SongQueryData {
  song: Song;
}

interface SongByNameQueryData {
  songByName: Song;
}

interface SongStatsQueryData {
  songStats: SongStats;
}

/**
 * 楽曲一覧を取得するフック
 * 
 * @param filter 楽曲フィルター（省略時は全件取得）
 * @param skip クエリをスキップするかどうか
 * @returns 楽曲配列、ローディング状態、エラーメッセージ
 */
export const useSongs = (filter?: SongFilter, skip?: boolean): { songs: Song[]; loading: boolean; error: string | undefined } => {
  const { data, loading, error } = useQuery<
    SongsQueryData,
    { filter?: SongFilter }
  >(GET_SONGS, {
    variables: filter ? { filter } : undefined,
    skip,
  });

  return {
    songs: data?.songs ?? [],
    loading,
    error: error?.message,
  };
};

/**
 * 楽曲詳細を取得するフック（IDで取得）
 * 
 * @param id 楽曲ID
 * @returns 楽曲詳細、ローディング状態、エラーメッセージ
 */
export const useSongById = (id: string): { song: Song | undefined; loading: boolean; error: string | undefined } => {
  const { data, loading, error } = useQuery<
    SongQueryData,
    { id: string }
  >(GET_SONG_BY_ID, {
    variables: { id },
    skip: !id,
  });

  return {
    song: data?.song,
    loading,
    error: error?.message,
  };
};

/**
 * 楽曲詳細を取得するフック（楽曲名で取得）
 * 
 * @param songName 楽曲名
 * @returns 楽曲詳細、ローディング状態、エラーメッセージ
 */
export const useSongByName = (songName: string): { song: Song | undefined; loading: boolean; error: string | undefined } => {
  const { data, loading, error } = useQuery<
    SongByNameQueryData,
    { songName: string }
  >(GET_SONG_BY_NAME, {
    variables: { songName },
    skip: !songName,
  });

  return {
    song: data?.songByName,
    loading,
    error: error?.message,
  };
};

/**
 * 楽曲統計情報を取得するフック
 * 
 * @returns 楽曲統計、ローディング状態、エラーメッセージ
 */
export const useSongStats = (): { stats: SongStats | undefined; loading: boolean; error: string | undefined } => {
  const { data, loading, error } = useQuery<SongStatsQueryData>(GET_SONG_STATS);

  return {
    stats: data?.songStats,
    loading,
    error: error?.message,
  };
};
