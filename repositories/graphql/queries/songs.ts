import { gql } from '@apollo/client';

/**
 * 全楽曲取得クエリ（フィルター付き）
 */
export const GET_SONGS = gql`
  query GetSongs($filter: SongFilterInput) {
    songs(filter: $filter) {
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
      moodProgressions {
        id
        section
        progression
        sectionOrder
        isLocked
        createdAt
        updatedAt
      }
    }
  }
`;

/**
 * 単一楽曲取得クエリ（IDで取得）
 */
export const GET_SONG_BY_ID = gql`
  query GetSongById($id: ID!) {
    song(id: $id) {
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
      moodProgressions {
        id
        section
        progression
        sectionOrder
        isLocked
        createdAt
        updatedAt
      }
    }
  }
`;

/**
 * 単一楽曲取得クエリ（楽曲名で取得）
 */
export const GET_SONG_BY_NAME = gql`
  query GetSongByName($songName: String!) {
    songByName(songName: $songName) {
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
      moodProgressions {
        id
        section
        progression
        sectionOrder
        isLocked
        createdAt
        updatedAt
      }
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
