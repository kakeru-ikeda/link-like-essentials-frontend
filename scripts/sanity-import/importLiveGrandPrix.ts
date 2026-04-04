import './lib/env.ts';
import { getFirebaseIdToken } from './lib/auth.ts';
import { graphqlFetch } from './lib/graphqlFetch.ts';
import { writeNdjson } from './lib/writeNdjson.ts';
import {
  type GraphQLLiveGrandPrix,
  transformLiveGrandPrix,
} from './transformers/liveGrandPrixTransformer.ts';

const GET_LIVE_GRAND_PRIX_FOR_IMPORT = `
  query GetLiveGrandPrixForImport {
    liveGrandPrix {
      id
      eventName
      yearTerm
      startDate
      endDate
      eventUrl
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

  console.log('📡 GraphQL からライブグランプリデータを取得中...');
  const data = await graphqlFetch<{ liveGrandPrix: GraphQLLiveGrandPrix[] }>(
    GET_LIVE_GRAND_PRIX_FOR_IMPORT,
    undefined,
    token
  );
  const liveGrandPrix = data.liveGrandPrix;
  console.log(`  取得件数: ${liveGrandPrix.length} 件`);

  const detailCount = liveGrandPrix.reduce((sum, lgp) => sum + lgp.details.length, 0);
  console.log(`  ステージ総数: ${detailCount} 件`);

  console.log('🔄 Sanity スキーマ形式に変換中...');
  const docs = liveGrandPrix
    .map(transformLiveGrandPrix)
    .sort((a, b) => b.startDate.localeCompare(a.startDate));

  console.log('💾 NDJSON に書き出し中...');
  writeNdjson('liveGrandPrix', docs as unknown as Record<string, unknown>[]);

  console.log('');
  console.log('--- 次のステップ ---');
  console.log('⚠ songs を先にインポートしていない場合は先に実行してください（song reference のため）');
  console.log(`以下のコマンドで Sanity にインポートしてください（dataset: ${TARGET_DATASET}）:`);
  console.log(`  npx sanity dataset import dumps/liveGrandPrix.ndjson ${TARGET_DATASET}`);
}

main().catch((err: unknown) => {
  console.error('❌ エラーが発生しました:', err);
  process.exit(1);
});
