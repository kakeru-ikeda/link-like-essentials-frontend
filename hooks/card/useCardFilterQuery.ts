'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFilter, UseFilterReturn } from '@/hooks/ui/useFilter';
import type { CardFilter } from '@/models/shared/Filter';
import { FilterMode } from '@/models/shared/Filter';
import {
  FavoriteMode,
  LimitedType,
  Rarity,
  SkillEffectType,
  SkillSearchTarget,
  StyleType,
  TraitEffectType,
} from '@/models/shared/enums';
import { CHARACTERS } from '@/config/characters';
import {
  buildQueryString,
  parseQueryParams,
  QuerySchema,
} from '@/utils/queryParams';

type CardFilterQueryParams = {
  keyword?: string;
  rarities?: Rarity[];
  styleTypes?: StyleType[];
  limitedTypes?: LimitedType[];
  favoriteModes?: FavoriteMode[];
  characterNames?: string[];
  skillEffects?: SkillEffectType[];
  traitEffects?: TraitEffectType[];
  skillSearchTargets?: SkillSearchTarget[];
  filterMode?: FilterMode;
  hasTokens?: boolean;
};

const parseStringList = (value: string | null): string[] | undefined => {
  if (!value) return undefined;
  const list = value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  const unique = Array.from(new Set(list));
  return unique.length > 0 ? unique : undefined;
};

const parseEnumList = <T extends string>(
  value: string | null,
  options: readonly T[]
): T[] | undefined => {
  const list = parseStringList(value);
  if (!list) return undefined;
  const optionSet = new Set(options);
  const filtered = list.filter((item) => optionSet.has(item as T)) as T[];
  return filtered.length > 0 ? filtered : undefined;
};

const parseBoolean = (value: string | null): boolean | undefined => {
  if (value === null) return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === '1' || normalized === 'true') return true;
  if (normalized === '0' || normalized === 'false') return false;
  return undefined;
};

const serializeList = <T extends string>(value?: T[]): string | null => {
  if (!value || value.length === 0) return null;
  const normalized = Array.from(new Set(value))
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .sort();
  return normalized.length > 0 ? normalized.join(',') : null;
};

const cardFilterQuerySchema: QuerySchema<CardFilterQueryParams> = {
  keyword: {
    defaultValue: undefined,
    parse: (value) => {
      if (value === null) return undefined;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    serialize: (value) => (value?.trim() ? value.trim() : null),
  },
  rarities: {
    defaultValue: undefined,
    parse: (value) => parseEnumList(value, Object.values(Rarity)),
    serialize: (value) => serializeList(value),
  },
  styleTypes: {
    defaultValue: undefined,
    parse: (value) => parseEnumList(value, Object.values(StyleType)),
    serialize: (value) => serializeList(value),
  },
  limitedTypes: {
    defaultValue: undefined,
    parse: (value) => parseEnumList(value, Object.values(LimitedType)),
    serialize: (value) => serializeList(value),
  },
  favoriteModes: {
    defaultValue: undefined,
    parse: (value) => parseEnumList(value, Object.values(FavoriteMode)),
    serialize: (value) => serializeList(value),
  },
  characterNames: {
    defaultValue: undefined,
    parse: (value) => parseEnumList(value, CHARACTERS),
    serialize: (value) => serializeList(value),
  },
  skillEffects: {
    defaultValue: undefined,
    parse: (value) => parseEnumList(value, Object.values(SkillEffectType)),
    serialize: (value) => serializeList(value),
  },
  traitEffects: {
    defaultValue: undefined,
    parse: (value) => parseEnumList(value, Object.values(TraitEffectType)),
    serialize: (value) => serializeList(value),
  },
  skillSearchTargets: {
    defaultValue: undefined,
    parse: (value) => parseEnumList(value, Object.values(SkillSearchTarget)),
    serialize: (value) => serializeList(value),
  },
  filterMode: {
    defaultValue: undefined,
    parse: (value) => {
      if (value === FilterMode.OR || value === FilterMode.AND) return value;
      return undefined;
    },
    serialize: (value) => value ?? null,
  },
  hasTokens: {
    defaultValue: undefined,
    parse: (value) => parseBoolean(value),
    serialize: (value) => {
      if (value === undefined) return null;
      return value ? '1' : '0';
    },
  },
};

const normalizeFilter = (filter: CardFilter): CardFilter => {
  const normalized: CardFilter = {};

  if (filter.keyword?.trim()) normalized.keyword = filter.keyword.trim();
  if (filter.rarities?.length)
    normalized.rarities = [...new Set(filter.rarities)].sort();
  if (filter.styleTypes?.length)
    normalized.styleTypes = [...new Set(filter.styleTypes)].sort();
  if (filter.limitedTypes?.length)
    normalized.limitedTypes = [...new Set(filter.limitedTypes)].sort();
  if (filter.favoriteModes?.length)
    normalized.favoriteModes = [...new Set(filter.favoriteModes)].sort();
  if (filter.characterNames?.length)
    normalized.characterNames = [...new Set(filter.characterNames)].sort();
  if (filter.skillEffects?.length)
    normalized.skillEffects = [...new Set(filter.skillEffects)].sort();
  if (filter.traitEffects?.length)
    normalized.traitEffects = [...new Set(filter.traitEffects)].sort();
  if (filter.skillSearchTargets?.length)
    normalized.skillSearchTargets = [
      ...new Set(filter.skillSearchTargets),
    ].sort();
  if (filter.filterMode) normalized.filterMode = filter.filterMode;
  if (filter.hasTokens !== undefined) normalized.hasTokens = filter.hasTokens;

  return normalized;
};

const toQueryParams = (filter: CardFilter): CardFilterQueryParams => ({
  keyword: filter.keyword,
  rarities: filter.rarities,
  styleTypes: filter.styleTypes,
  limitedTypes: filter.limitedTypes,
  favoriteModes: filter.favoriteModes,
  characterNames: filter.characterNames,
  skillEffects: filter.skillEffects,
  traitEffects: filter.traitEffects,
  skillSearchTargets: filter.skillSearchTargets,
  filterMode: filter.filterMode,
  hasTokens: filter.hasTokens,
});

export const useCardFilterQuery = (): UseFilterReturn => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    filter,
    updateFilter,
    setFilter,
    resetFilter,
    clearFilterKey,
    countActiveFilters,
  } = useFilter();

  // 初回マウント時かどうかを判定
  const isMountedRef = useRef(false);

  const queryFilter = useMemo(() => {
    const parsed = parseQueryParams(searchParams, cardFilterQuerySchema);
    return normalizeFilter(parsed);
  }, [searchParams]);

  // URLクエリからフィルタを復元（初回マウント時のみ）
  useEffect(() => {
    if (!isMountedRef.current) {
      setFilter(queryFilter);
      isMountedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // フィルタからURLクエリを更新（初回マウント後のみ）
  useEffect(() => {
    // 初回マウント時はスキップ
    if (!isMountedRef.current) return;

    const normalized = normalizeFilter(filter);
    const nextQuery = buildQueryString(
      toQueryParams(normalized),
      cardFilterQuerySchema
    );

    const currentQuery = searchParams.toString();

    // 同じならスキップ
    if (nextQuery === currentQuery) return;

    router.replace(nextQuery ? `?${nextQuery}` : '?', { scroll: false });
  }, [filter, router, searchParams]);

  return {
    filter,
    updateFilter,
    setFilter,
    resetFilter,
    clearFilterKey,
    countActiveFilters,
  };
};
