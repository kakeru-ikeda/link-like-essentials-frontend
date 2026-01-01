import { apolloClient } from '@/repositories/graphql/client';
import { GET_SONG_BY_ID } from '@/repositories/graphql/queries/songs';
import { Song } from '@/models/Song';

interface GetSongResponse {
  song: Song;
}

/**
 * 楽曲カタログ取得用サービス
 */
export const songCatalogService = {
  async getSongById(id: string | undefined | null): Promise<Song | null> {
    if (!id) return null;
    const { data } = await apolloClient.query<GetSongResponse>({
      query: GET_SONG_BY_ID,
      variables: { id },
      fetchPolicy: 'cache-first',
    });
    return data.song ?? null;
  },
};
