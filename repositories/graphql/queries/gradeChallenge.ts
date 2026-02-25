import { gql } from '@apollo/client';

/**
 * グレードチャレンジフィールドのフラグメント
 */
const GRADE_CHALLENGE_SECTION_EFFECT_FIELDS = gql`
  fragment GradeChallengeSectionEffectFields on GradeChallengeSectionEffect {
    id
    sectionName
    effect
    sectionOrder
    isLocked
  }
`;

const GRADE_CHALLENGE_DETAIL_FIELDS = gql`
  fragment GradeChallengeDetailFields on GradeChallengeDetail {
    id
    stageName
    specialEffect
    songId
    isLocked
    createdAt
    updatedAt
  }
`;

const GRADE_CHALLENGE_FIELDS = gql`
  fragment GradeChallengeFields on GradeChallenge {
    id
    title
    termName
    startDate
    endDate
    detailUrl
    isLocked
    createdAt
    updatedAt
  }
`;

/**
 * 全グレードチャレンジ取得クエリ（フィルター付き）
 */
export const GET_GRADE_CHALLENGES = gql`
  ${GRADE_CHALLENGE_FIELDS}
  ${GRADE_CHALLENGE_DETAIL_FIELDS}
  ${GRADE_CHALLENGE_SECTION_EFFECT_FIELDS}
  query GetGradeChallenges($filter: GradeChallengeFilterInput) {
    gradeChallenges(filter: $filter) {
      ...GradeChallengeFields
      details {
        ...GradeChallengeDetailFields
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
          ...GradeChallengeSectionEffectFields
        }
      }
    }
  }
`;

/**
 * 単一グレードチャレンジ取得クエリ（IDで取得）
 */
export const GET_GRADE_CHALLENGE_BY_ID = gql`
  ${GRADE_CHALLENGE_FIELDS}
  ${GRADE_CHALLENGE_DETAIL_FIELDS}
  ${GRADE_CHALLENGE_SECTION_EFFECT_FIELDS}
  query GetGradeChallengeById($id: ID!) {
    gradeChallengeById(id: $id) {
      ...GradeChallengeFields
      details {
        ...GradeChallengeDetailFields
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
          ...GradeChallengeSectionEffectFields
        }
      }
    }
  }
`;

/**
 * 単一グレードチャレンジ取得クエリ（タイトルで取得）
 */
export const GET_GRADE_CHALLENGE_BY_TITLE = gql`
  ${GRADE_CHALLENGE_FIELDS}
  ${GRADE_CHALLENGE_DETAIL_FIELDS}
  ${GRADE_CHALLENGE_SECTION_EFFECT_FIELDS}
  query GetGradeChallengeByTitle($title: String!) {
    gradeChallengeByTitle(title: $title) {
      ...GradeChallengeFields
      details {
        ...GradeChallengeDetailFields
        song {
          id
          songName
          category
          attribute
        }
        sectionEffects {
          ...GradeChallengeSectionEffectFields
        }
      }
    }
  }
`;

/**
 * 開催中グレードチャレンジ取得クエリ
 */
export const GET_ONGOING_GRADE_CHALLENGES = gql`
  ${GRADE_CHALLENGE_FIELDS}
  ${GRADE_CHALLENGE_DETAIL_FIELDS}
  ${GRADE_CHALLENGE_SECTION_EFFECT_FIELDS}
  query GetOngoingGradeChallenges {
    ongoingGradeChallenges {
      ...GradeChallengeFields
      details {
        ...GradeChallengeDetailFields
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
          ...GradeChallengeSectionEffectFields
        }
      }
    }
  }
`;

/**
 * グレードチャレンジ統計取得クエリ
 */
export const GET_GRADE_CHALLENGE_STATS = gql`
  query GetGradeChallengeStats {
    gradeChallengeStats {
      totalEvents
      byTermName {
        termName
        count
      }
    }
  }
`;
