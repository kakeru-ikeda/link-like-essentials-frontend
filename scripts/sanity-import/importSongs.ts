import './lib/env.ts';
import { getFirebaseIdToken } from './lib/auth.ts';
import { graphqlFetch } from './lib/graphqlFetch.ts';
import { writeNdjson } from './lib/writeNdjson.ts';
import { type GraphQLSong, transformSong } from './transformers/songTransformer.ts';

const GET_SONGS = `
  query GetSongs {
    songs {
      id
      songName
      songUrl
      category
      attribute
      centerCharacter
      singers
      participations
      jacketImageUrl
      liveAnalyzerImageUrl
      isLocked
      createdAt
      updatedAt
    }
  }
`;

async function main() {
  console.log('🔑 Firebase 匿名認証中...');
  const token = await getFirebaseIdToken();

  console.log('📡 GraphQL から楽曲データを取得中...');
  const data = await graphqlFetch<{ songs: GraphQLSong[] }>(GET_SONGS, undefined, token);
  const songs = data.songs;
  console.log(`  取得件数: ${songs.length} 件`);

  console.log('🔄 Sanity スキーマ形式に変換中...');
  const docs = songs.map(transformSong);

  console.log('💾 NDJSON に書き出し中...');
  writeNdjson('songs', docs as Record<string, unknown>[]);

  console.log('');
  console.log('--- 次のステップ ---');
  console.log('以下のコマンドで Sanity にインポートしてください:');
  console.log('  npx sanity dataset import dumps/songs.ndjson production');
}

main().catch((err: unknown) => {
  console.error('❌ エラーが発生しました:', err);
  process.exit(1);
});
