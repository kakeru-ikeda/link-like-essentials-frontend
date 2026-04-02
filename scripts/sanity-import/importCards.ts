import './lib/env.ts';
import { getFirebaseIdToken } from './lib/auth.ts';
import { graphqlFetch } from './lib/graphqlFetch.ts';
import { writeNdjson } from './lib/writeNdjson.ts';
import { type GraphQLCard, transformCard } from './transformers/cardTransformer.ts';

/** 全フィールドを一括取得するカスタムクエリ（stats / favoriteMode 等を含む） */
const GET_CARDS_FOR_IMPORT = `
  query GetCardsForImport {
    cards {
      id
      cardName
      characterName
      rarity
      styleType
      limited
      releaseDate
      isLocked
      detail {
        favoriteMode
        acquisitionMethod
        awakeBeforeStorageUrl
        awakeAfterStorageUrl
        stats {
          smile
          pure
          cool
          mental
        }
        specialAppeal {
          name
          ap
          effect
        }
        skill {
          name
          ap
          effect
        }
        trait {
          name
          effect
        }
        accessories {
          parentType
          name
          ap
          effect
          traitName
          traitEffect
        }
      }
    }
  }
`;

const TARGET_DATASET = 'development';

async function main() {
  console.log('🔑 Firebase 匿名認証中...');
  const token = await getFirebaseIdToken();

  console.log('📡 GraphQL からカードデータを取得中...');
  const data = await graphqlFetch<{ cards: GraphQLCard[] }>(
    GET_CARDS_FOR_IMPORT,
    undefined,
    token
  );
  const cards = data.cards;
  console.log(`  取得件数: ${cards.length} 件`);

  const withDetail = cards.filter((c) => c.detail != null);
  const withoutDetail = cards.filter((c) => c.detail == null);
  if (withoutDetail.length > 0) {
    console.log(`  ⚠ detail なし: ${withoutDetail.length} 件（stats等が空になります）`);
  }
  console.log(`  detail あり: ${withDetail.length} 件`);

  console.log('🔄 Sanity スキーマ形式に変換中...');
  const docs = cards.map(transformCard);

  console.log('💾 NDJSON に書き出し中...');
  writeNdjson('cards', docs as Record<string, unknown>[]);

  console.log('');
  console.log('--- 次のステップ ---');
  console.log(`以下のコマンドで Sanity にインポートしてください（dataset: ${TARGET_DATASET}）:`);
  console.log(`  npx sanity dataset import dumps/cards.ndjson ${TARGET_DATASET}`);
}

main().catch((err: unknown) => {
  console.error('❌ エラーが発生しました:', err);
  process.exit(1);
});
