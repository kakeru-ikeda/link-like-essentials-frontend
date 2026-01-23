import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/nextjs';
import { getIdToken } from '@/repositories/firebase/auth';
import { GRAPHQL_ENDPOINT } from '@/config/api';

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getIdToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// GraphQLエラーハンドリング
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  const operationName = operation.operationName || 'unknown';

  // GraphQLエラー（バックエンドからの応答エラー）
  if (graphQLErrors && graphQLErrors.length > 0) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL Error]: Operation: ${operationName}, Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      console.log('[Sentry] Sending GraphQL error to Sentry...');

      // Sentryに送信
      Sentry.withScope((scope) => {
        scope.setTags({
          error_type: 'graphql',
          operation: operationName,
          endpoint: GRAPHQL_ENDPOINT,
        });
        scope.setContext('graphql', {
          operation: operationName,
          message,
          path: path?.join('.'),
          extensions,
          variables: operation.variables,
        });
        // GraphQLエラーをExceptionとして送信
        const error = new Error(`GraphQL Error: ${message}`);
        error.name = 'GraphQLError';
        Sentry.captureException(error);
        console.log('[Sentry] GraphQL error sent');
      });
    });
  }

  // ネットワークエラー（バックエンドへの接続失敗）
  if (networkError) {
    console.error(
      `[Network Error]: Operation: ${operationName}, Error: ${networkError.message}`
    );

    console.log('[Sentry] Sending network error to Sentry...');

    // Sentryに送信
    Sentry.withScope((scope) => {
      scope.setTags({
        error_type: 'graphql_network',
        operation: operationName,
        endpoint: GRAPHQL_ENDPOINT,
      });
      scope.setContext('graphql', {
        operation: operationName,
        variables: operation.variables,
      });
      Sentry.captureException(networkError);
      console.log('[Sentry] Network error sent');
    });
  }
});

export const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
});
