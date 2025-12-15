import { gql } from '@apollo/client';

export const GET_CARDS = gql`
  query GetCards($filter: CardFilterInput) {
    cards(filter: $filter) {
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
      releaseDate
      isLocked
      createdAt
      updatedAt
      detail {
        id
        cardId
        favoriteMode
        acquisitionMethod
        awakeBeforeStorageUrl
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
