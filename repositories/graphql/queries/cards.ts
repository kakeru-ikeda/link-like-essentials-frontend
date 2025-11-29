import { gql } from '@apollo/client';

export const GET_CARDS = gql`
  query GetCards($first: Int, $after: String, $filter: CardFilterInput) {
    cards(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          cardName
          characterName
          rarity
          styleType
          limited
          cardUrl
          isLocked
          createdAt
          updatedAt
          detail {
            id
            cardId
            awakeAfterStorageUrl
            favoriteMode
            specialAppeal {
              name
              ap
              effect
            }
            skill {
              name
              ap
              effect
            }
            trait {
              name
              effect
            }
            accessories {
              id
              cardId
              parentType
              name
              ap
              effect
              traitName
              traitEffect
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_CARD_DETAIL = gql`
  query GetCardDetail($id: ID!) {
    card(id: $id) {
      id
      cardName
      characterName
      rarity
      styleType
      limited
      cardUrl
      isLocked
      createdAt
      updatedAt
      detail {
        id
        cardId
        favoriteMode
        acquisitionMethod
        awakeAfterStorageUrl
        stats {
          smile
          pure
          cool
          mental
        }
        specialAppeal {
          name
          ap
          effect
        }
        skill {
          name
          ap
          effect
        }
        trait {
          name
          effect
        }
        accessories {
          id
          cardId
          parentType
          name
          ap
          effect
          traitName
          traitEffect
        }
      }
      accessories {
        id
        cardId
        parentType
        name
        ap
        effect
        traitName
        traitEffect
      }
    }
  }
`;
