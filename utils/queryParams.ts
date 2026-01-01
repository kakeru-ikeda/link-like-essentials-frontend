import type { ReadonlyURLSearchParams } from 'next/navigation';

export interface QueryParamConfig<T> {
  defaultValue: T;
  parse: (value: string | null) => T | undefined;
  serialize: (value: T) => string | null;
}

export type QuerySchema<T extends Record<string, unknown>> = {
  [K in keyof T]-?: QueryParamConfig<T[K]>;
};

/**
 * URLSearchParams から型付きオブジェクトへデコード
 */
export const parseQueryParams = <T extends Record<string, unknown>>(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
  schema: QuerySchema<T>
): T => {
  const result = {} as T;

  (Object.keys(schema) as Array<keyof T>).forEach((key) => {
    const config = schema[key];
    const parsed = config.parse(searchParams.get(String(key)));
    result[key] = parsed ?? config.defaultValue;
  });

  return result;
};

/**
 * 型付きオブジェクトからクエリ文字列を生成（デフォルト値は省略）
 */
export const buildQueryString = <T extends Record<string, unknown>>(
  params: T,
  schema: QuerySchema<T>
): string => {
  const query = new URLSearchParams();

  (Object.keys(schema) as Array<keyof T>).forEach((key) => {
    const config = schema[key];
    const value = params[key];
    const serialized = config.serialize(value);
    const serializedDefault = config.serialize(config.defaultValue);

    if (serialized === null) return;
    if (serializedDefault !== null && serialized === serializedDefault) return;

    query.set(String(key), serialized);
  });

  return query.toString();
};
