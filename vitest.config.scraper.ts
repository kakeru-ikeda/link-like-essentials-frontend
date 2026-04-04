import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['scripts/scraper/**/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['scripts/scraper/**/*.ts'],
      exclude: ['scripts/scraper/**/__tests__/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
