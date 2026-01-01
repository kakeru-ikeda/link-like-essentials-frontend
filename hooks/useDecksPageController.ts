import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GetDecksParams } from '@/models/DeckQueryParams';
import { usePublishedDecks } from '@/hooks/usePublishedDecks';
import { buildQueryString, parseQueryParams, QuerySchema } from '@/utils/queryParams';

type DeckQuerySyncParams = Pick<GetDecksParams, 'page' | 'orderBy' | 'order' | 'tag'>;

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
      if (value === 'viewCount' || value === 'likeCount' || value === 'publishedAt') return value;
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
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    serialize: (value) => (value ? value : null),
  },
};

export const useDecksPageController = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialParams = useMemo<Partial<GetDecksParams>>(() => {
    const parsed = parseQueryParams(searchParams, decksQuerySchema);
    return parsed;
  }, [searchParams]);

  const { decks, pageInfo, loading, error, goToPage, params, setParams } = usePublishedDecks(initialParams);

  const [tagInput, setTagInput] = useState(initialParams.tag ?? '');

  useEffect(() => {
    setTagInput(params.tag ?? '');
  }, [params.tag]);

  const handleSortChange = useCallback(
    (orderBy: 'publishedAt' | 'viewCount' | 'likeCount') => {
      setParams((prev) => ({ ...prev, orderBy, page: 1 }));
    },
    [setParams]
  );

  const handleOrderChange = useCallback(
    (order: 'asc' | 'desc') => {
      setParams((prev) => ({ ...prev, order, page: 1 }));
    },
    [setParams]
  );

  const handleTagSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setParams((prev) => ({ ...prev, tag: tagInput.trim() || undefined, page: 1 }));
    },
    [setParams, tagInput]
  );

  const handleTagReset = useCallback(() => {
    setTagInput('');
    setParams((prev) => ({ ...prev, tag: undefined, page: 1 }));
  }, [setParams]);

  useEffect(() => {
    const nextParams = parseQueryParams(searchParams, decksQuerySchema);

    setParams((prev) => {
      const merged: GetDecksParams = {
        ...prev,
        ...nextParams,
        page: nextParams.page ?? prev.page ?? 1,
        orderBy: nextParams.orderBy ?? prev.orderBy ?? 'publishedAt',
        order: nextParams.order ?? prev.order ?? 'desc',
        tag: nextParams.tag ?? undefined,
      };

      const isSame =
        merged.page === prev.page &&
        merged.orderBy === prev.orderBy &&
        merged.order === prev.order &&
        merged.tag === prev.tag;

      return isSame ? prev : merged;
    });
  }, [searchParams, setParams]);

  useEffect(() => {
    const nextQuery = buildQueryString(
      {
        page: params.page,
        orderBy: params.orderBy,
        order: params.order,
        tag: params.tag,
      },
      decksQuerySchema
    );
    const currentQuery = searchParams.toString();
    if (nextQuery === currentQuery) return;
    router.replace(nextQuery ? `?${nextQuery}` : '?', { scroll: false });
  }, [params.page, params.orderBy, params.order, params.tag, router, searchParams]);

  return {
    decks,
    pageInfo,
    loading,
    error,
    goToPage,
    params,
    setParams,
    tagInput,
    setTagInput,
    handleSortChange,
    handleOrderChange,
    handleTagSubmit,
    handleTagReset,
  };
};