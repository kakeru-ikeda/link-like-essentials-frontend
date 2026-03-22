'use client';

import React, { useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/repositories/graphql/client';
import { signInAnonymous, onAuthStateChange } from '@/repositories/firebase/auth';
import { userService } from '@/services/user/userService';
import { useAuthStore } from '@/store/authStore';
import { Loading } from '@/components/common/Loading';
import { UserRole } from '@/models/shared/enums';
import { useEffectKeywordsLoader } from '@/hooks/card/useEffectKeywords';
import { useEffectKeywordsStore } from '@/store/effectKeywordsStore';

interface ProvidersProps {
  children: React.ReactNode;
}

function EffectKeywordsInitializer() {
  useEffectKeywordsLoader();
  return null;
}

function EffectKeywordsGate({ children }: { children: React.ReactNode }) {
  const isKeywordsLoaded = useEffectKeywordsStore((state) => state.isLoaded);
  if (!isKeywordsLoaded) {
    return <Loading fullScreen message="Loading..." />;
  }
  return <>{children}</>;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const { setUser, setToken, setRole } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const token = await firebaseUser.getIdToken();
        setToken(token);

        try {
          const profile = await userService.createProfile({ displayName: 'ゲスト' });
          setRole(profile.role ?? UserRole.ANONYMOUS);
        } catch (error) {
          console.error('ユーザー作成エラー:', error);
          setRole(UserRole.ANONYMOUS);
        }

        setIsAuthReady(true);
      } else {
        try {
          await signInAnonymous();
        } catch (error) {
          console.error('匿名ログインエラー:', error);
          setIsAuthReady(true);
        }
      }
    });

    return () => unsubscribe();
  }, [setUser, setToken, setRole]);

  if (!isAuthReady) {
    return <Loading fullScreen message="Loading..." />;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <EffectKeywordsInitializer />
      <EffectKeywordsGate>
        {children}
      </EffectKeywordsGate>
    </ApolloProvider>
  );
};
