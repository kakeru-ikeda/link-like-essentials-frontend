# 開発セットアップガイド

このドキュメントでは、Link Like Essentials Frontend の開発環境をセットアップする手順を説明します。

## 📋 目次

- [必要要件](#必要要件)
- [初期セットアップ](#初期セットアップ)
- [Firebase 設定](#firebase設定)
- [GraphQL エンドポイント設定](#graphqlエンドポイント設定)
- [開発サーバー起動](#開発サーバー起動)
- [トラブルシューティング](#トラブルシューティング)

## 🔧 必要要件

以下のソフトウェアがインストールされている必要があります:

- **Node.js**: v20.x 以上
- **npm**: v10.x 以上
- **Git**: 最新版

### Node.js のバージョン確認

```bash
node --version
# v20.x.x 以上であることを確認

npm --version
# v10.x.x 以上であることを確認
```

### Node.js のインストール（必要な場合）

[Node.js 公式サイト](https://nodejs.org/)からダウンロードしてインストールしてください。

または、nvm を使用する場合:

```bash
# nvmのインストール（macOS/Linux）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Node.js 20をインストール
nvm install 20
nvm use 20
```

## 🚀 初期セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/kakeru-ikeda/link-like-essentials-frontend.git
cd link-like-essentials-frontend
```

### 2. 依存関係のインストール

```bash
npm install
```

これにより、`package.json`に記載されているすべての依存パッケージがインストールされます。

### 3. 環境変数ファイルの作成

```bash
cp .env.example .env.local
```

`.env.local`ファイルが作成されます。このファイルに実際の環境変数を設定します。

## 🔥 Firebase 設定

### Firebase プロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: `link-like-essentials`）
4. Google アナリティクスの設定（任意）
5. プロジェクトを作成

### Firebase アプリの追加

1. プロジェクトのダッシュボードで「ウェブアプリを追加」をクリック
2. アプリのニックネームを入力（例: `frontend`）
3. Firebase Hosting は不要（Vercel を使用するため）
4. 「アプリを登録」をクリック

### Firebase 設定値の取得

アプリ登録後、以下のような設定値が表示されます:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};
```

### 環境変数への設定

`.env.local`ファイルを開き、Firebase 設定値を入力します:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Firebase Authentication の有効化

1. Firebase Console の左メニューから「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブを選択
4. 「匿名」を有効化

## 🔌 GraphQL エンドポイント設定

### バックエンドのセットアップ

バックエンドが起動していない場合は、まずバックエンドをセットアップしてください:

1. [link-like-essentials-backend](https://github.com/kakeru-ikeda/link-like-essentials-backend)をクローン
2. README に従ってセットアップ
3. 開発サーバーを起動（通常は `http://localhost:4000/graphql`）

### エンドポイントの設定

`.env.local`ファイルに、バックエンドの GraphQL エンドポイントを設定します:

```bash
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
```

**本番環境の場合:**

```bash
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-backend-domain.com/graphql
```

## 🏃 開発サーバー起動

### 1. 開発サーバーの起動

```bash
npm run dev
```

次のようなメッセージが表示されます:

```
> link-like-essentials-frontend@0.1.0 dev
> next dev

   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.3s
```

### 2. ブラウザでアクセス

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 3. 動作確認

- ページが正しく表示されることを確認
- ブラウザのコンソールにエラーがないことを確認
- Firebase の匿名認証が成功していることを確認

## 🧪 開発ワークフロー

### コードの変更

ファイルを変更すると、自動的にホットリロードされます。

### Lint の実行

```bash
npm run lint
```

### 型チェック

```bash
npm run type-check
```

### テストの実行

```bash
npm test
```

### フォーマット

```bash
npm run format
```

## 🛠 トラブルシューティング

### 依存関係のインストールエラー

**エラー**: `npm install`が失敗する

**解決策**:

```bash
# node_modulesとpackage-lock.jsonを削除
rm -rf node_modules package-lock.json

# キャッシュをクリア
npm cache clean --force

# 再インストール
npm install
```

### ポート 3000 が使用中

**エラー**: `Port 3000 is already in use`

**解決策**:

1. 別のポートを使用:

   ```bash
   PORT=3001 npm run dev
   ```

2. または、使用中のプロセスを終了:

   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9

   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### Firebase 認証エラー

**エラー**: `Firebase: Error (auth/invalid-api-key)`

**解決策**:

1. `.env.local`の Firebase 設定値を確認
2. Firebase Console で正しい API キーを取得
3. 開発サーバーを再起動

### GraphQL エラー

**エラー**: `Failed to fetch` または `Network error`

**解決策**:

1. バックエンドが起動しているか確認
2. `.env.local`のエンドポイント URL を確認
3. CORS 設定を確認（バックエンド側）
4. ブラウザのネットワークタブでリクエストを確認

### TypeScript エラー

**エラー**: 型エラーが発生する

**解決策**:

```bash
# 型定義を再生成
npm run type-check

# VSCodeを使用している場合、TypeScriptサーバーを再起動
# Cmd+Shift+P (macOS) または Ctrl+Shift+P (Windows)
# "TypeScript: Restart TS Server" を選択
```

### ビルドエラー

**エラー**: `npm run build`が失敗する

**解決策**:

1. 全ての型エラーを修正
2. 未使用のインポートを削除
3. `next.config.js`の設定を確認

### 環境変数が反映されない

**解決策**:

1. `.env.local`ファイル名を確認（`.env`ではなく`.env.local`）
2. 開発サーバーを再起動（環境変数の変更時は必須）
3. 変数名に`NEXT_PUBLIC_`プレフィックスが付いているか確認（クライアント側で使用する場合）

## 📚 参考リンク

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [Firebase 公式ドキュメント](https://firebase.google.com/docs)
- [Apollo Client 公式ドキュメント](https://www.apollographql.com/docs/react/)
- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/docs)

## 💬 サポート

問題が解決しない場合は、GitHub の Issues で質問してください:

[GitHub Issues](https://github.com/kakeru-ikeda/link-like-essentials-frontend/issues)
