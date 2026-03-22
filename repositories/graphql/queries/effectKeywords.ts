import { gql } from '@apollo/client';

export const GET_SKILL_EFFECT_KEYWORDS = gql`
  query GetSkillEffectKeywords {
    skillEffectKeywords {
      effectType
      description
      keywords
    }
  }
`;

export const GET_TRAIT_EFFECT_KEYWORDS = gql`
  query GetTraitEffectKeywords {
    traitEffectKeywords {
      effectType
      description
      keywords
    }
  }
`;
