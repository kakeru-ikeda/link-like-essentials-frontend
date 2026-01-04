'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { Button } from '@/components/common/Button';

export default function MyPage() {
  const router = useRouter();
  const { profile, isLoadingProfile, error, fetchProfile } = useUserProfile();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoadingProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
          <div className="mt-4 text-center">
            <Button
              onClick={() => fetchProfile()}
              className="bg-blue-500 hover:bg-blue-600"
            >
              再読み込み
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              プロフィールが未作成です
            </h2>
            <p className="text-gray-700 mb-4">
              プロフィールを作成してください
            </p>
            <Button
              onClick={() => router.push('/mypage/profile/edit')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              プロフィールを作成
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">プロフィール</h1>
      </div>

      <ProfileCard profile={profile} showEditButton={true} />
    </div>
  );
}
