'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import type { UserProfile } from '@/models/user/User';
import { formatDate } from '@/utils/dateUtils';
import { VerifiedBadge } from '@/components/user/VerifiedBadge';

interface ProfileCardProps {
  /** プロフィール情報 */
  profile: UserProfile;
  /** 編集ボタン表示フラグ */
  showEditButton?: boolean;
  /** 編集ボタン押下時のコールバック */
  onEdit?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  showEditButton = true,
  onEdit,
}) => {
  const router = useRouter();

  // 画像キャッシュを防ぐため更新日時をクエリに付与
  const avatarSrc = profile.avatarUrl
    ? `${profile.avatarUrl}${profile.avatarUrl.includes('?') ? '&' : '?'}v=${encodeURIComponent(
        profile.updatedAt
      )}`
    : null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      router.push('/mypage/profile/edit');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mx-auto">
      {/* ヘッダー部分 */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* アバター */}
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarSrc}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* 表示名とUID */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.displayName}
              </h2>
              {profile.role && (
                <VerifiedBadge
                  role={profile.role}
                  label="認証済み"
                  anonymousLabel="未認証"
                />
              )}
            </div>
            {profile.uid && (
              <p className="text-sm text-gray-400 mt-1">ID: {profile.uid}</p>
            )}
          </div>
        </div>

        {/* 編集ボタン */}
        {showEditButton && (
          <Button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-600"
          >
            編集
          </Button>
        )}
      </div>

      {/* 自己紹介 */}
      {profile.bio && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            自己紹介
          </h3>
          <p className="text-gray-800 whitespace-pre-wrap break-words">
            {profile.bio}
          </p>
        </div>
      )}

      {/* 日付情報 */}
      <div className="border-t border-gray-200 pt-4 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">登録日:</span>
            <span className="ml-2 text-gray-900">
              {formatDate(profile.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
