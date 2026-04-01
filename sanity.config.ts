import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from '@/repositories/sanity/schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (!projectId) {
  throw new Error('Environment variable NEXT_PUBLIC_SANITY_PROJECT_ID is not set');
}

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
  name: 'lles',
  title: 'Link Like Essentials',
  projectId,
  dataset,
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],
  schema: {
    types: schemaTypes,
  },
  basePath: '/studio',
});
