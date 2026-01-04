'use client';

import { useState, useCallback } from 'react';
import { useUserApi } from './useUserApi';
import { useImageUpload } from './useImageUpload';
import type { UserProfile, UserProfileInput } from '@/models/User';
import { useUserProfileStore } from '@/store/userProfileStore';

export interface UseUserProfileReturn {
  /** プロフィール情報 */
  profile: UserProfile | null;
  /** プロフィール取得中 */
  isLoadingProfile: boolean;
  /** プロフィール更新中 */
  isUpdating: boolean;
  /** 画像アップロード中 */
  isUploadingImage: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** プロフィールを取得 */
  fetchProfile: () => Promise<void>;
  /** プロフィールを作成 */
  createProfile: (input: UserProfileInput) => Promise<void>;
  /** プロフィールを更新 */
  updateProfile: (input: UserProfileInput) => Promise<void>;
  /** アバター画像をアップロード */
  uploadAvatar: (file: File) => Promise<string>;
  /** アバター画像を削除 */
  removeAvatar: () => Promise<void>;
  /** ユーザーを削除 */
  removeUser: () => Promise<void>;
  /** 状態をリセット */
  reset: () => void;
  /** クリッピングモーダル表示フラグ */
  showCropModal: boolean;
  /** クリッピング対象の画像ファイル */
  cropImageFile: File | null;
  /** クリッピングを確定 */
  confirmCrop: (cropArea: { x: number; y: number; width: number; height: number }) => Promise<void>;
  /** クリッピングをキャンセル */
  cancelCrop: () => void;
}

/**
 * ユーザープロフィール管理用カスタムフック
 * 
 * プロフィールの取得・作成・更新・削除と
 * アバター画像のアップロード・削除を統合管理
 */
export const useUserProfile = (): UseUserProfileReturn => {
  const { profile, setProfile, clearProfile } = useUserProfileStore();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    getMyProfile,
    createProfile: createProfileApi,
    updateProfile: updateProfileApi,
    deleteAvatar: deleteAvatarApi,
    deleteUser: deleteUserApi,
    isLoading,
    error: userApiError,
    reset: resetUserApi,
  } = useUserApi();

  const {
    uploadImage,
    isUploading,
    error: imageUploadError,
    reset: resetImageUpload,
    showCropModal,
    cropImageFile,
    confirmCrop,
    cancelCrop,
  } = useImageUpload({
    enableCropping: true,
    maxSizeMB: 5,
  });

  /**
   * プロフィールを取得
   */
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true);
      setError(null);
      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'プロフィールの取得に失敗しました';
      setError(errorMessage);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [getMyProfile, setProfile]);

  /**
   * プロフィールを作成
   */
  const createProfile = useCallback(
    async (input: UserProfileInput) => {
      try {
        setIsUpdating(true);
        setError(null);
        const data = await createProfileApi(input);
        setProfile(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'プロフィールの作成に失敗しました';
        setError(errorMessage);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [createProfileApi, setProfile]
  );

  /**
   * プロフィールを更新
   */
  const updateProfile = useCallback(
    async (input: UserProfileInput) => {
      try {
        setIsUpdating(true);
        setError(null);
        const data = await updateProfileApi(input);
        setProfile(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'プロフィールの更新に失敗しました';
        setError(errorMessage);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [updateProfileApi, setProfile]
  );

  /**
   * アバター画像をアップロード
   */
  const uploadAvatar = useCallback(
    async (file: File): Promise<string> => {
      try {
        setError(null);
        const url = await uploadImage(file);
        return url;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '画像のアップロードに失敗しました';
        setError(errorMessage);
        throw err;
      }
    },
    [uploadImage]
  );

  /**
   * アバター画像を削除
   */
  const removeAvatar = useCallback(async () => {
    try {
      setIsUpdating(true);
      setError(null);
      await deleteAvatarApi();
      if (profile) {
        setProfile({ ...profile, avatarUrl: undefined });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'アバター画像の削除に失敗しました';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [deleteAvatarApi, profile, setProfile]);

  /**
   * ユーザーを削除
   */
  const removeUser = useCallback(async () => {
    try {
      setIsUpdating(true);
      setError(null);
      await deleteUserApi();
      clearProfile();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'ユーザーの削除に失敗しました';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [clearProfile, deleteUserApi]);

  /**
   * 状態をリセット
   */
  const reset = useCallback(() => {
    setError(null);
    clearProfile();
    resetImageUpload();
    resetUserApi();
  }, [clearProfile, resetImageUpload, resetUserApi]);

  return {
    profile,
    isLoadingProfile: isLoadingProfile || isLoading,
    isUpdating,
    isUploadingImage: isUploading,
    error: error || userApiError || imageUploadError,
    fetchProfile,
    createProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    removeUser,
    reset,
    showCropModal,
    cropImageFile,
    confirmCrop,
    cancelCrop,
  };
};
