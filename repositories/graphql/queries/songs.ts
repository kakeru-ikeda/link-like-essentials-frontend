import { gql } from '@apollo/client';

/**
 * 楽曲フィールドのフラグメント
 */
const SONG_FIELDS = gql`
  fragment SongFields on Song {
    id
    songName
    songUrl
    category
    attribute
    centerCharacter
    singers
    jacketImageUrl
    liveAnalyzerImageUrl
    isLocked
    createdAt
    updatedAt
  }
`;

/**
 * 全楽曲取得クエリ（フィルター付き）
 */
export const GET_SONGS = gql`
  ${SONG_FIELDS}
  query GetSongs($filter: SongFilterInput) {
    songs(filter: $filter) {
      ...SongFields
    }
  }
`;

/**
 * 単一楽曲取得クエリ（IDで取得）
 */
export const GET_SONG_BY_ID = gql`
  ${SONG_FIELDS}
  query GetSongById($id: ID!) {
    song(id: $id) {
      ...SongFields
    }
  }
`;

/**
 * 単一楽曲取得クエリ（楽曲名で取得）
 */
export const GET_SONG_BY_NAME = gql`
  ${SONG_FIELDS}
  query GetSongByName($songName: String!) {
    songByName(songName: $songName) {
      ...SongFields
    }
  }
`;

/**
 * 楽曲統計情報取得クエリ
 */
export const GET_SONG_STATS = gql`
  query GetSongStats {
    songStats {
      totalSongs
      byCategory {
        category
        count
      }
      byAttribute {
        attribute
        count
      }
      byCenterCharacter {
        centerCharacter
        count
      }
    }
  }
`;
