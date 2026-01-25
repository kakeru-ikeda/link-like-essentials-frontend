'use client';

import { ProfileCard } from '@/components/profile/ProfileCard';
import { Button } from '@/components/common/Button';
import { PublishedDeckList } from '@/components/deck/PublishedDeckList';
import { useMyPage } from '@/hooks/user/useMyPage';
import { UserRole } from '@/models/shared/enums';

export default function MyPage() {
  const {
    profile,
    isLoadingProfile,
    profileError,
    fetchProfile,
    myDecks,
    myDecksPageInfo,
    isLoadingMyDecks,
    myDecksError,
    goToMyDecksPage,
    refreshMyDecks,
    likedDecks,
    likedDecksPageInfo,
    isLoadingLikedDecks,
    likedDecksError,
    goToLikedDecksPage,
    refreshLikedDecks,
    handleLogout,
    navigateToProfileEdit,
    navigateToLogin,
  } = useMyPage();

  if (isLoadingProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{profileError}</p>
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
              onClick={navigateToProfileEdit}
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
      <div
        className={`mb-6 flex items-center gap-4 ${
          profile.role !== UserRole.ANONYMOUS ? 'justify-between' : 'justify-start'
        }`}
      >
        <h1 className="text-3xl font-bold text-gray-900">マイページ</h1>
        {profile.role !== UserRole.ANONYMOUS && (
          <Button
            onClick={handleLogout}
            className="bg-slate-700 hover:bg-slate-800"
          >
            ログアウト
          </Button>
        )}
      </div>

      <ProfileCard profile={profile} showEditButton={true} />

      {profile.role === UserRole.ANONYMOUS && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-amber-900 pb-1">メールアドレスを登録してアカウントを認証してください</p>
              <p className="text-sm text-amber-800">
                コメントはメール認証済みのアカウントでのみ利用可能です。
              </p>
              <p className="text-sm text-amber-800">
                別端末でも「投稿したデッキ」や「いいねしたデッキ」のデータを利用できるように、メールとパスワードを設定してください。
              </p>
              <p className="text-sm text-amber-800">
                ※ 公開デッキの情報のみ引き継がれます。デッキスロットは端末固有の情報として引き継がれませんのでご注意ください。
              </p>
            </div>
            <Button
              onClick={navigateToLogin}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              メールでログイン/登録
            </Button>
          </div>
        </div>
      )}

      <section className="mt-10 space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">投稿したデッキ</h2>
            <p className="text-sm text-gray-600">自分が公開したデッキの一覧です。</p>
          </div>
          {myDecksPageInfo && (
            <div className="text-sm text-gray-700">
              ページ {myDecksPageInfo.currentPage} / {myDecksPageInfo.totalPages}（全 {myDecksPageInfo.totalCount} 件）
            </div>
          )}
        </div>

        {myDecksError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="flex items-center justify-between gap-3">
              <span>{myDecksError}</span>
              <Button onClick={refreshMyDecks} className="bg-blue-500 hover:bg-blue-600">
                再取得
              </Button>
            </div>
          </div>
        )}

        {isLoadingMyDecks ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">取得中...</div>
        ) : (
          <PublishedDeckList decks={myDecks} />
        )}

        {myDecksPageInfo && (
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <div>
              ページ {myDecksPageInfo.currentPage} / {myDecksPageInfo.totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  myDecksPageInfo.hasPreviousPage &&
                  goToMyDecksPage((myDecksPageInfo.currentPage ?? 1) - 1)
                }
                disabled={!myDecksPageInfo.hasPreviousPage}
                className="rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                前へ
              </button>
              <button
                onClick={() =>
                  myDecksPageInfo.hasNextPage &&
                  goToMyDecksPage((myDecksPageInfo.currentPage ?? 1) + 1)
                }
                disabled={!myDecksPageInfo.hasNextPage}
                className="rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-10 space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">いいねしたデッキ</h2>
            <p className="text-sm text-gray-600">いいね済みのデッキ一覧です。</p>
          </div>
          {likedDecksPageInfo && (
            <div className="text-sm text-gray-700">
              ページ {likedDecksPageInfo.currentPage} / {likedDecksPageInfo.totalPages}（全 {likedDecksPageInfo.totalCount} 件）
            </div>
          )}
        </div>

        {likedDecksError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="flex items-center justify-between gap-3">
              <span>{likedDecksError}</span>
              <Button onClick={refreshLikedDecks} className="bg-blue-500 hover:bg-blue-600">
                再取得
              </Button>
            </div>
          </div>
        )}

        {isLoadingLikedDecks ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">取得中...</div>
        ) : (
          <PublishedDeckList decks={likedDecks} />
        )}

        {likedDecksPageInfo && (
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <div>
              ページ {likedDecksPageInfo.currentPage} / {likedDecksPageInfo.totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  likedDecksPageInfo.hasPreviousPage &&
                  goToLikedDecksPage((likedDecksPageInfo.currentPage ?? 1) - 1)
                }
                disabled={!likedDecksPageInfo.hasPreviousPage}
                className="rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                前へ
              </button>
              <button
                onClick={() =>
                  likedDecksPageInfo.hasNextPage &&
                  goToLikedDecksPage((likedDecksPageInfo.currentPage ?? 1) + 1)
                }
                disabled={!likedDecksPageInfo.hasNextPage}
                className="rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
