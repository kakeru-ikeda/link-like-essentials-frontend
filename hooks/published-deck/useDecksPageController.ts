import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GetDecksParams } from '@/models/domain/DeckQueryParams';
import { usePublishedDecks } from '@/hooks/published-deck/usePublishedDecks';
import {
  buildQueryString,
  parseQueryParams,
  QuerySchema,
} from '@/utils/queryParams';

type DeckQuerySyncParams = Pick<
  GetDecksParams,
  'page' | 'orderBy' | 'order' | 'tag'
>;

const DEFAULT_PER_PAGE = 12;

const stripLeadingHash = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/^#+/, '') || undefined;
};

const withLeadingHash = (value?: string | null): string | undefined => {
  const stripped = stripLeadingHash(value);
  if (!stripped) return undefined;
  return `#${stripped}`;
};

const decksQuerySchema: QuerySchema<DeckQuerySyncParams> = {
  page: {
    defaultValue: 1,
    parse: (value) => {
      if (value === null) return undefined;
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
    },
    serialize: (value) => (value && value > 1 ? value.toString() : null),
  },
  orderBy: {
    defaultValue: 'publishedAt',
    parse: (value) => {
      if (
        value === 'viewCount' ||
        value === 'likeCount' ||
        value === 'publishedAt'
      )
        return value;
      return undefined;
    },
    serialize: (value) => value ?? null,
  },
  order: {
    defaultValue: 'desc',
    parse: (value) => {
      if (value === 'asc' || value === 'desc') return value;
      return undefined;
    },
    serialize: (value) => value ?? null,
  },
  tag: {
    defaultValue: undefined,
    parse: (value) => {
      if (value === null) return undefined;
      return stripLeadingHash(value);
    },
    serialize: (value) => {
      return value ?? null;
    },
  },
};

export const useDecksPageController = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URLから現在のパラメータを取得（URLを唯一の真実の源とする）
  const currentParams = useMemo<GetDecksParams>(() => {
    const parsed = parseQueryParams(searchParams, decksQuerySchema);
    return {
      page: parsed.page ?? 1,
      perPage: DEFAULT_PER_PAGE,
      orderBy: parsed.orderBy ?? 'publishedAt',
      order: parsed.order ?? 'desc',
      tag: parsed.tag,
    };
  }, [searchParams]);

  const { decks, pageInfo, loading, error, goToPage, params, setParams } =
    usePublishedDecks(currentParams);

  const [tagInput, setTagInput] = useState(
    withLeadingHash(currentParams.tag) ?? ''
  );

  // URLのtagが変更されたらinput値も更新
  useEffect(() => {
    setTagInput(withLeadingHash(currentParams.tag) ?? '');
  }, [currentParams.tag]);

  // URLを更新する共通関数
  const updateUrl = useCallback(
    (updates: Partial<DeckQuerySyncParams>) => {
      const parsed = parseQueryParams(searchParams, decksQuerySchema);
      const current = {
        page: parsed.page ?? 1,
        orderBy: parsed.orderBy ?? 'publishedAt',
        order: parsed.order ?? 'desc',
        tag: parsed.tag,
      };
      const newParams = { ...current, ...updates };
      const nextQuery = buildQueryString(
        {
          page: newParams.page,
          orderBy: newParams.orderBy,
          order: newParams.order,
          tag: newParams.tag,
        },
        decksQuerySchema
      );
      router.replace(nextQuery ? `/decks?${nextQuery}` : '/decks', {
        scroll: false,
      });
    },
    [router, searchParams]
  );

  const handleSortChange = useCallback(
    (orderBy: 'publishedAt' | 'viewCount' | 'likeCount') => {
      updateUrl({ orderBy, page: 1 });
    },
    [updateUrl]
  );

  const handleOrderChange = useCallback(
    (order: 'asc' | 'desc') => {
      updateUrl({ order, page: 1 });
    },
    [updateUrl]
  );

  const handleTagSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const normalized = stripLeadingHash(tagInput);
      setTagInput(withLeadingHash(normalized) ?? '');
      updateUrl({ tag: normalized, page: 1 });
    },
    [tagInput, updateUrl]
  );

  const handleTagReset = useCallback(() => {
    setTagInput('');
    updateUrl({ tag: undefined, page: 1 });
  }, [updateUrl]);

  const handleHashtagSelect = useCallback(
    (selected: string) => {
      const normalized = stripLeadingHash(selected);
      setTagInput(withLeadingHash(normalized) ?? '');
      updateUrl({ tag: normalized, page: 1 });
    },
    [updateUrl]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateUrl({ page });
    },
    [updateUrl]
  );

  return {
    decks,
    pageInfo,
    loading,
    error,
    goToPage: handlePageChange,
    params: currentParams,
    tagInput,
    setTagInput,
    handleSortChange,
    handleOrderChange,
    handleTagSubmit,
    handleTagReset,
    handleHashtagSelect,
  };
};
