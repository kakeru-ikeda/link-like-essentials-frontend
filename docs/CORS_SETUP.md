# Cloud Storage CORS設定手順

## 概要
Cloud Storageの画像をブラウザから取得するために、CORS（Cross-Origin Resource Sharing）設定が必要です。

## 前提条件
- Google Cloud SDK（gcloud CLI）がインストールされていること
- Firebase プロジェクトへのアクセス権限があること

## 手順

### 1. Google Cloud SDKのインストール（未インストールの場合）

**macOS:**
```bash
brew install --cask google-cloud-sdk
```

**その他のOS:**
https://cloud.google.com/sdk/docs/install からダウンロード

### 2. 認証とプロジェクト設定

```bash
# Googleアカウントで認証
gcloud auth login

# プロジェクトIDを確認（.envファイルから）
# NEXT_PUBLIC_FIREBASE_PROJECT_ID の値を使用

# プロジェクトを設定
gcloud config set project YOUR_PROJECT_ID
```

### 3. CORS設定の適用

プロジェクトルートにある `cors.json` を使用してCORS設定を適用：

```bash
# バケット名を確認（.envファイルのNEXT_PUBLIC_FIREBASE_STORAGE_BUCKETから）
# 通常は "YOUR_PROJECT_ID.appspot.com" の形式

# CORS設定を適用
gsutil cors set cors.json gs://YOUR_BUCKET_NAME
```

### 4. 設定確認

```bash
# 適用されたCORS設定を確認
gsutil cors get gs://YOUR_BUCKET_NAME
```

## cors.json の設定内容

```json
[
  {
    "origin": ["http://localhost:3000", "https://your-production-domain.com"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

### 設定項目の説明

- **origin**: 許可するオリジン（ドメイン）のリスト
  - `http://localhost:3000`: ローカル開発環境
  - `https://your-production-domain.com`: 本番環境のドメイン（実際のドメインに置き換えてください）
  
- **method**: 許可するHTTPメソッド
  - `GET`: 画像の取得
  - `HEAD`: メタデータの取得
  
- **maxAgeSeconds**: プリフライトリクエストのキャッシュ時間（秒）

## 本番環境のドメインを追加する場合

`cors.json` の `origin` に本番ドメインを追加：

```json
[
  {
    "origin": [
      "http://localhost:3000",
      "https://your-app.vercel.app",
      "https://your-custom-domain.com"
    ],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

設定変更後、再度適用コマンドを実行：

```bash
gsutil cors set cors.json gs://YOUR_BUCKET_NAME
```

## トラブルシューティング

### gsutil コマンドが見つからない場合

Google Cloud SDKのPATHが通っていない可能性があります：

```bash
# PATHを確認
echo $PATH

# macOS (Homebrew経由でインストールした場合)
export PATH="/opt/homebrew/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/bin:$PATH"
```

### 権限エラーが出る場合

適切な権限があるアカウントで認証されているか確認：

```bash
# 現在の認証情報を確認
gcloud auth list

# 別のアカウントで認証
gcloud auth login
```

### CORS設定が反映されない場合

- ブラウザのキャッシュをクリア
- 数分待ってから再試行（設定反映に時間がかかる場合があります）
- DevToolsのネットワークタブでCORSヘッダーを確認

## 参考リンク

- [Cloud Storage CORS設定公式ドキュメント](https://cloud.google.com/storage/docs/configuring-cors)
- [Firebase Storage CORS設定](https://firebase.google.com/docs/storage/web/download-files#cors_configuration)
