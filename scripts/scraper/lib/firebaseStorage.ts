import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

import * as admin from 'firebase-admin';

let initialized = false;

function initFirebase(): void {
  if (initialized || admin.apps.length > 0) {
    initialized = true;
    return;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!storageBucket) {
    throw new Error('FIREBASE_STORAGE_BUCKET is required');
  }

  let credential: admin.credential.Credential;

  if (serviceAccountJson) {
    // GitHub Actions: JSON文字列を環境変数から直接パース
    let parsed: object;
    try {
      parsed = JSON.parse(serviceAccountJson);
    } catch {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON');
    }
    credential = admin.credential.cert(parsed as admin.ServiceAccount);
  } else if (serviceAccountPath) {
    // ローカル開発: ファイルパスから読み込み
    let parsed: object;
    try {
      parsed = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    } catch {
      throw new Error(
        `Failed to read or parse service account file: ${serviceAccountPath}`
      );
    }
    credential = admin.credential.cert(parsed as admin.ServiceAccount);
  } else {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH is required'
    );
  }

  admin.initializeApp({
    credential,
    storageBucket,
  });

  initialized = true;
}

/**
 * Wiki 上の画像をダウンロードして Firebase Storage にアップロードし、公開 URL を返す
 * 画像が既に Storage に存在する場合は既存 URL をそのまま返す
 */
export async function uploadImageFromUrl(
  imageUrl: string,
  storagePath: string
): Promise<string> {
  initFirebase();

  // initFirebase() でバリデーション済みなので non-null assertion で安全
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET!;
  const bucket = admin.storage().bucket(bucketName);
  const destination = storagePath.includes('/') ? storagePath : `cards/${storagePath}`;

  // 既存チェック
  const [exists] = await bucket.file(destination).exists();
  if (exists) {
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
    console.log(`  - Image already exists: ${destination}`);
    return publicUrl;
  }

  // 一時ファイルに文字としてダウンロード
  const tempDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const fileName = path.basename(destination);
  const tempFilePath = path.join(tempDir, fileName);

  await downloadFile(imageUrl, tempFilePath);

  // Firebase Storage にアップロード
  const ext = path.extname(destination).toLowerCase();
  const contentTypeMap: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };
  const contentType = contentTypeMap[ext] ?? 'application/octet-stream';

  await bucket.upload(tempFilePath, {
    destination,
    metadata: {
      contentType,
      cacheControl: 'public, max-age=31536000',
    },
  });

  await bucket.file(destination).makePublic();

  fs.unlinkSync(tempFilePath);

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
  console.log(`  - Uploaded: ${destination}`);
  return publicUrl;
}

function downloadFile(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        },
        (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download image: HTTP ${response.statusCode}`));
            return;
          }
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }
      )
      .on('error', (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });
  });
}
