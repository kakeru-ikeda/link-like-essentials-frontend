/**
 * ユーザープロフィール情報
 */
export interface UserProfile {
  /** ユーザーID (Firebase Auth UID) */
  uid: string;
  /** 表示名 */
  displayName: string;
  /** 自己紹介 */
  bio?: string;
  /** アバター画像URL */
  avatarUrl?: string;
  /** 作成日時 */
  createdAt: string;
  /** 更新日時 */
  updatedAt: string;
}

/**
 * プロフィール作成・更新時のリクエストデータ
 */
export interface UserProfileInput {
  /** 表示名 */
  displayName: string;
  /** 自己紹介 */
  bio?: string;
}

/**
 * アバター画像アップロード時のレスポンスデータ
 */
export interface AvatarUploadResponse {
  /** アップロードされた画像のURL */
  avatarUrl: string;
}
