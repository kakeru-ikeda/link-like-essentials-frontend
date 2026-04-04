import './lib/env.ts';
import { getFirebaseIdToken } from './lib/auth.ts';
import { graphqlFetch } from './lib/graphqlFetch.ts';
import { writeNdjson } from './lib/writeNdjson.ts';
import {
  type GraphQLSkillEffectKeyword,
  transformSkillEffectKeyword,
} from './transformers/skillEffectKeywordTransformer.ts';

const GET_SKILL_EFFECT_KEYWORDS = `
  query GetSkillEffectKeywords {
    skillEffectKeywords {
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

  console.log('📡 GraphQL からスキル効果キーワードデータを取得中...');
  const data = await graphqlFetch<{ skillEffectKeywords: GraphQLSkillEffectKeyword[] }>(
    GET_SKILL_EFFECT_KEYWORDS,
    undefined,
    token
  );
  const groups = data.skillEffectKeywords;
  console.log(`  取得件数: ${groups.length} 件`);

  console.log('🔄 Sanity スキーマ形式に変換中...');
  const docs = groups.map(transformSkillEffectKeyword);

  console.log('💾 NDJSON に書き出し中...');
  writeNdjson('skillEffectKeywords', docs as unknown as Record<string, unknown>[]);

  console.log('');
  console.log('--- 次のステップ ---');
  console.log('以下のコマンドで Sanity にインポートしてください:');
  console.log('  npx sanity dataset import dumps/skillEffectKeywords.ndjson development');
}

main().catch((err: unknown) => {
  console.error('❌ エラーが発生しました:', err);
  process.exit(1);
});
