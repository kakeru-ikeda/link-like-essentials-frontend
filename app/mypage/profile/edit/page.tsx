'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { ProfileForm } from '@/components/profile/ProfileForm';
import type { UserProfileInput } from '@/models/user/User';

export default function ProfileEditPage() {
  const router = useRouter();
  const {
    profile,
    isLoadingProfile,
    isUpdating,
    isUploadingImage,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    showCropModal,
    cropImageFile,
    confirmCrop,
    cancelCrop,
  } = useUserProfile();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!profile && !isLoadingProfile) {
        await fetchProfile();
      }
      setIsInitialized(true);
    };

    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (data: UserProfileInput) => {
    try {
      if (profile) {
        await updateProfile(data);
      } else {
        await createProfile(data);
      }
      router.push('/mypage');
    } catch (error) {
      // エラーはuseUserProfileで管理されているため、ここでは何もしない
      console.error('プロフィール保存エラー:', error);
    }
  };

  const handleCancel = () => {
    router.push('/mypage');
  };

  if (isLoadingProfile || !isInitialized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {profile ? 'プロフィール編集' : 'プロフィール作成'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <ProfileForm
            initialValues={
              profile
                ? {
                    displayName: profile.displayName,
                    bio: profile.bio,
                    avatarUrl: profile.avatarUrl,
                  }
                : undefined
            }
            avatarCacheKey={profile?.updatedAt}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onUploadAvatar={uploadAvatar}
            onDeleteAvatar={removeAvatar}
            isSubmitting={isUpdating}
            isUploadingImage={isUploadingImage}
            showCropModal={showCropModal}
            cropImageFile={cropImageFile}
            onConfirmCrop={confirmCrop}
            onCancelCrop={cancelCrop}
          />
        </div>
      </div>
    </div>
  );
}
