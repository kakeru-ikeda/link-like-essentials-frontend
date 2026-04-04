import './env.ts';

const endpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? 'http://localhost:4000/graphql';

/**
 * GraphQL エンドポイントへリクエストを送り、型付きのレスポンスを返す。
 * @param query  GraphQL クエリ文字列
 * @param variables  変数（省略可）
 * @param token  Firebase IDトークン（省略時は認証ヘッダーなし）
 */
export async function graphqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GraphQL リクエストが失敗しました: ${res.status} ${body}`);
  }

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };

  if (json.errors && json.errors.length > 0) {
    const messages = json.errors.map((e) => e.message).join(', ');
    throw new Error(`GraphQL エラー: ${messages}`);
  }

  if (!json.data) {
    throw new Error('GraphQL レスポンスに data フィールドがありません');
  }

  return json.data;
}
