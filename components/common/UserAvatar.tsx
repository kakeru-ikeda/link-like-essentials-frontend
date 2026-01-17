import { UserProfile } from '@/models/User';
import { VerifiedBadge } from '@/components/common/VerifiedBadge';

interface UserAvatarProps {
  userProfile?: UserProfile;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const sizeClasses = {
  sm: {
    container: 'h-8 w-8',
    text: 'text-xs',
  },
  md: {
    container: 'h-10 w-10',
    text: 'text-sm',
  },
  lg: {
    container: 'h-12 w-12',
    text: 'text-base',
  },
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  userProfile,
  size = 'md',
  showTooltip = false,
}) => {
  const sizeClass = sizeClasses[size];

  const avatarElement = (
    <div className="relative inline-block flex-shrink-0">
      {userProfile?.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={userProfile.avatarUrl}
          alt={`${userProfile.displayName}のアバター`}
          className={`${sizeClass.container} rounded-full border border-slate-200 bg-slate-100 object-cover`}
        />
      ) : (
        <div
          className={`${sizeClass.container} ${sizeClass.text} flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-semibold text-slate-500`}
        >
          {userProfile?.displayName?.[0]?.toUpperCase() || '?'}
        </div>
      )}

      {showTooltip && userProfile && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
          <div className="w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
            <div className="flex items-start gap-3">
              {userProfile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userProfile.avatarUrl}
                  alt={`${userProfile.displayName}のアバター`}
                  className="h-12 w-12 flex-shrink-0 rounded-full border border-slate-200 bg-slate-100 object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-500">
                  {userProfile?.displayName?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {userProfile.displayName}
                  </p>
                  {userProfile.role ? (
                    <VerifiedBadge role={userProfile.role} size="sm" />
                  ) : null}
                </div>
                {userProfile.bio && (
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {userProfile.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      )}
    </div>
  );

  if (showTooltip && userProfile) {
    return (
      <div className="group relative inline-flex items-center">
        {avatarElement}
      </div>
    );
  }

  return avatarElement;
};
