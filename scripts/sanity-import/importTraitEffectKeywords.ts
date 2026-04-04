import './lib/env.ts';
import { getFirebaseIdToken } from './lib/auth.ts';
import { graphqlFetch } from './lib/graphqlFetch.ts';
import { writeNdjson } from './lib/writeNdjson.ts';
import {
  type GraphQLTraitEffectKeyword,
  transformTraitEffectKeyword,
} from './transformers/traitEffectKeywordTransformer.ts';

const GET_TRAIT_EFFECT_KEYWORDS = `
  query GetTraitEffectKeywords {
    traitEffectKeywords {
      effectType
      label
      description
      keywords
    }
  }
`;

async function main() {
  console.log('🔑 Firebase 匿名認証中...');
  const token = await getFirebaseIdToken();

  console.log('📡 GraphQL から特性効果キーワードデータを取得中...');
  const data = await graphqlFetch<{ traitEffectKeywords: GraphQLTraitEffectKeyword[] }>(
    GET_TRAIT_EFFECT_KEYWORDS,
    undefined,
    token
  );
  const groups = data.traitEffectKeywords;
  console.log(`  取得件数: ${groups.length} 件`);

  console.log('🔄 Sanity スキーマ形式に変換中...');
  const docs = groups.map(transformTraitEffectKeyword);

  console.log('💾 NDJSON に書き出し中...');
  writeNdjson('traitEffectKeywords', docs as Record<string, unknown>[]);

  console.log('');
  console.log('--- 次のステップ ---');
  console.log('以下のコマンドで Sanity にインポートしてください:');
  console.log('  npx sanity dataset import dumps/traitEffectKeywords.ndjson development');
}

main().catch((err: unknown) => {
  console.error('❌ エラーが発生しました:', err);
  process.exit(1);
});
