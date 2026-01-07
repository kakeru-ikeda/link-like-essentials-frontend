export const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

// Firebase Functions Base URL
const FUNCTIONS_BASE_URL =
  process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL ||
  'http://127.0.0.1:5001/link-like-essentials/asia-northeast1';

// API Endpoints
export const DECK_API_ENDPOINT = `${FUNCTIONS_BASE_URL}/deckApi`;
export const USER_API_ENDPOINT = `${FUNCTIONS_BASE_URL}/userApi`;
