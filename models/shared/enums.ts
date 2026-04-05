export enum Rarity {
  UR = 'UR',
  SR = 'SR',
  R = 'R',
  DR = 'DR',
  BR = 'BR',
  LR = 'LR',
}

export enum StyleType {
  CHEERLEADER = 'CHEERLEADER',
  TRICKSTER = 'TRICKSTER',
  PERFORMER = 'PERFORMER',
  MOODMAKER = 'MOODMAKER',
}

export enum LimitedType {
  PERMANENT = 'PERMANENT',
  LIMITED = 'LIMITED',
  SPRING_LIMITED = 'SPRING_LIMITED',
  SUMMER_LIMITED = 'SUMMER_LIMITED',
  AUTUMN_LIMITED = 'AUTUMN_LIMITED',
  WINTER_LIMITED = 'WINTER_LIMITED',
  BIRTHDAY_LIMITED = 'BIRTHDAY_LIMITED',
  LEG_LIMITED = 'LEG_LIMITED',
  SHUFFLE_LIMITED = 'SHUFFLE_LIMITED',
  BATTLE_LIMITED = 'BATTLE_LIMITED',
  BANGDREAM_LIMITED = 'BANGDREAM_LIMITED',
  PARTY_LIMITED = 'PARTY_LIMITED',
  ACTIVITY_LIMITED = 'ACTIVITY_LIMITED',
  GRADUATE_LIMITED = 'GRADUATE_LIMITED',
  LOGIN_BONUS = 'LOGIN_BONUS',
  REWARD = 'REWARD',
}

export enum ParentType {
  SPECIAL_APPEAL = 'SPECIAL_APPEAL',
  SKILL = 'SKILL',
  TRAIT = 'TRAIT',
}

export enum FavoriteMode {
  NONE = 'NONE',
  HAPPY = 'HAPPY',
  MELLOW = 'MELLOW',
  NEUTRAL = 'NEUTRAL',
}

export enum DeckType {
  TERM_102 = '102期',
  TERM_103 = '103期',
  TERM_104 = '104期',
  TERM_105 = '105期',
  TERM_105_BGP = '105期BGP',
  TERM_105_FT_KOZUE = '105期ft.梢',
  TERM_105_FT_TSUZURI = '105期ft.綴理',
  TERM_105_FT_MEGUMI = '105期ft.慈',
}

export enum YearTerm {
  TERM_102 = '102期',
  TERM_103 = '103期',
  TERM_104 = '104期',
  TERM_105 = '105期',
  TERM_106 = '106期',
}

export enum SongAttribute {
  SMILE = 'スマイル',
  PURE = 'ピュア',
  COOL = 'クール',
}

export enum UserRole {
  ANONYMOUS = 'anonymous',
  EMAIL = 'email',
}

export enum EntityIdPrefix {
  CARD = 'card',
  SONG = 'song',
  LIVE_GRAND_PRIX = 'liveGrandPrix',
  GRADE_CHALLENGE = 'gradeChallenge',
}

/**
 * スキル効果の種類
 * DB管理の値を正義とする branded string type
 */
export type SkillEffectType = string & { readonly _brand: 'SkillEffectType' };

/** 文字列リテラルを SkillEffectType に変換するヘルパー。静的定数での使用を一箇所に集約する */
export const asSkillEffectType = (value: string): SkillEffectType => value as SkillEffectType;

/**
 * 特性効果の種類
 * DB管理の値を正義とする branded string type
 */
export type TraitEffectType = string & { readonly _brand: 'TraitEffectType' };

export enum TraitConditionType {
  NONE = 'NONE',
  DRAW = 'DRAW',
  HEART_COLLECT = 'HEART_COLLECT',
  SHOT = 'SHOT',
  OVER_SECTION = 'OVER_SECTION',
  ACCUMULATE = 'ACCUMULATE',
}

/**
 * スキル検索対象の種類
 */
export enum SkillSearchTarget {
  SPECIAL_APPEAL = 'SPECIAL_APPEAL',
  SKILL = 'SKILL',
  TRAIT = 'TRAIT',
}
