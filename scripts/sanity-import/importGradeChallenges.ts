import './lib/env.ts';
import { getFirebaseIdToken } from './lib/auth.ts';
import { graphqlFetch } from './lib/graphqlFetch.ts';
import { writeNdjson } from './lib/writeNdjson.ts';
import {
  type GraphQLGradeChallenge,
  transformGradeChallenge,
} from './transformers/gradeChallengeTransformer.ts';

const GET_GRADE_CHALLENGES_FOR_IMPORT = `
  query GetGradeChallengesForImport {
    gradeChallenges {
      id
      title
      termName
      startDate
      endDate
      detailUrl
      isLocked
      details {
        id
        stageName
        specialEffect
        isLocked
        song {
          id
        }
        sectionEffects {
          id
          sectionName
          effect
          sectionOrder
          isLocked
        }
      }
    }
  }
`;

const TARGET_DATASET = 'production';

async function main() {
  console.log('🔑 Firebase 匿名認証中...');
  const token = await getFirebaseIdToken();

  console.log('📡 GraphQL からグレードチャレンジデータを取得中...');
  const data = await graphqlFetch<{ gradeChallenges: GraphQLGradeChallenge[] }>(
    GET_GRADE_CHALLENGES_FOR_IMPORT,
    undefined,
    token
  );
  const gradeChallenges = data.gradeChallenges;
  console.log(`  取得件数: ${gradeChallenges.length} 件`);

  const detailCount = gradeChallenges.reduce((sum, gc) => sum + gc.details.length, 0);
  console.log(`  ステージ総数: ${detailCount} 件`);

  console.log('🔄 Sanity スキーマ形式に変換中...');
  const docs = gradeChallenges
    .map(transformGradeChallenge)
    .sort((a, b) => {
      // startDate 降順（新しい順）。null は末尾
      if (!a.startDate && !b.startDate) return 0;
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return b.startDate.localeCompare(a.startDate);
    });

  console.log('💾 NDJSON に書き出し中...');
  writeNdjson('gradeChallenges', docs as unknown as Record<string, unknown>[]);

  console.log('');
  console.log('--- 次のステップ ---');
  console.log('⚠ songs を先にインポートしていない場合は先に実行してください（song reference のため）');
  console.log(`以下のコマンドで Sanity にインポートしてください（dataset: ${TARGET_DATASET}）:`);
  console.log(`  npx sanity dataset import dumps/gradeChallenges.ndjson ${TARGET_DATASET}`);
}

main().catch((err: unknown) => {
  console.error('❌ エラーが発生しました:', err);
  process.exit(1);
});
