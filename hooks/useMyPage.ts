'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useMyDecks } from '@/hooks/useMyDecks';
import { useLikedDecks } from '@/hooks/useLikedDecks';

export const useMyPage = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { profile, isLoadingProfile, error: profileError, fetchProfile } = useUserProfile();
  const myDecksState = useMyDecks();
  const likedDecksState = useLikedDecks();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = useCallback(async () => {
    await signOut();
    router.push('/');
  }, [router, signOut]);

  const navigateToProfileEdit = useCallback(() => {
    router.push('/mypage/profile/edit');
  }, [router]);

  const navigateToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  return {
    profile,
    isLoadingProfile,
    profileError,
    fetchProfile,
    myDecks: myDecksState.decks,
    myDecksPageInfo: myDecksState.pageInfo,
    isLoadingMyDecks: myDecksState.loading,
    myDecksError: myDecksState.error,
    goToMyDecksPage: myDecksState.goToPage,
    refreshMyDecks: myDecksState.refresh,
    likedDecks: likedDecksState.decks,
    likedDecksPageInfo: likedDecksState.pageInfo,
    isLoadingLikedDecks: likedDecksState.loading,
    likedDecksError: likedDecksState.error,
    goToLikedDecksPage: likedDecksState.goToPage,
    refreshLikedDecks: likedDecksState.refresh,
    handleLogout,
    navigateToProfileEdit,
    navigateToLogin,
  };
};
