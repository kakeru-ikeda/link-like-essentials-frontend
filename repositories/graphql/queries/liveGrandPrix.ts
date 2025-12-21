import { gql } from '@apollo/client';

/**
 * ライブグランプリフィールドのフラグメント
 */
const LIVE_GRAND_PRIX_SECTION_EFFECT_FIELDS = gql`
  fragment LiveGrandPrixSectionEffectFields on LiveGrandPrixSectionEffect {
    id
    sectionName
    effect
    sectionOrder
    isLocked
  }
`;

const LIVE_GRAND_PRIX_DETAIL_FIELDS = gql`
  fragment LiveGrandPrixDetailFields on LiveGrandPrixDetail {
    id
    stageName
    specialEffect
    songId
    isLocked
    createdAt
    updatedAt
  }
`;

const LIVE_GRAND_PRIX_FIELDS = gql`
  fragment LiveGrandPrixFields on LiveGrandPrix {
    id
    eventName
    yearTerm
    startDate
    endDate
    eventUrl
    isLocked
    createdAt
    updatedAt
  }
`;

/**
 * 全ライブグランプリ取得クエリ（フィルター付き）
 */
export const GET_LIVE_GRAND_PRIX = gql`
  ${LIVE_GRAND_PRIX_FIELDS}
  ${LIVE_GRAND_PRIX_DETAIL_FIELDS}
  ${LIVE_GRAND_PRIX_SECTION_EFFECT_FIELDS}
  query GetLiveGrandPrix($filter: LiveGrandPrixFilterInput) {
    liveGrandPrix(filter: $filter) {
      ...LiveGrandPrixFields
      details {
        ...LiveGrandPrixDetailFields
        song {
          id
          songName
          category
          attribute
          centerCharacter
          singers
          jacketImageUrl
        }
        sectionEffects {
          ...LiveGrandPrixSectionEffectFields
        }
      }
    }
  }
`;

/**
 * 単一ライブグランプリ取得クエリ（IDで取得）
 */
export const GET_LIVE_GRAND_PRIX_BY_ID = gql`
  ${LIVE_GRAND_PRIX_FIELDS}
  ${LIVE_GRAND_PRIX_DETAIL_FIELDS}
  ${LIVE_GRAND_PRIX_SECTION_EFFECT_FIELDS}
  query GetLiveGrandPrixById($id: ID!) {
    liveGrandPrixById(id: $id) {
      ...LiveGrandPrixFields
      details {
        ...LiveGrandPrixDetailFields
        song {
          id
          songName
          category
          attribute
          centerCharacter
          singers
          participations
          jacketImageUrl
          liveAnalyzerImageUrl
          moodProgressions {
            section
            progression
            sectionOrder
          }
        }
        sectionEffects {
          ...LiveGrandPrixSectionEffectFields
        }
      }
    }
  }
`;

/**
 * 単一ライブグランプリ取得クエリ（イベント名で取得）
 */
export const GET_LIVE_GRAND_PRIX_BY_EVENT_NAME = gql`
  ${LIVE_GRAND_PRIX_FIELDS}
  ${LIVE_GRAND_PRIX_DETAIL_FIELDS}
  ${LIVE_GRAND_PRIX_SECTION_EFFECT_FIELDS}
  query GetLiveGrandPrixByEventName($eventName: String!) {
    liveGrandPrixByEventName(eventName: $eventName) {
      ...LiveGrandPrixFields
      details {
        ...LiveGrandPrixDetailFields
        song {
          id
          songName
          category
          attribute
        }
        sectionEffects {
          ...LiveGrandPrixSectionEffectFields
        }
      }
    }
  }
`;

/**
 * ライブグランプリ統計取得クエリ
 */
export const GET_LIVE_GRAND_PRIX_STATS = gql`
  query GetLiveGrandPrixStats {
    liveGrandPrixStats {
      totalEvents
      byYearTerm {
        yearTerm
        count
      }
    }
  }
`;
