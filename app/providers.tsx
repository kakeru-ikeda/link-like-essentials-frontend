'use client';

import React, { useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/repositories/graphql/client';
import { signInAnonymous, onAuthStateChange } from '@/repositories/firebase/auth';
import { userRepository } from '@/repositories/api/userRepository';
import { useAuthStore } from '@/store/authStore';
import { Loading } from '@/components/common/Loading';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const token = await firebaseUser.getIdToken();
        setToken(token);

        try {
          await userRepository.createProfile({ displayName: 'ゲスト' });
        } catch (error) {
          console.error('ユーザー作成エラー:', error);
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
  }, [setUser, setToken]);

  if (!isAuthReady) {
    return <Loading fullScreen message="Loading..." />;
  }

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
