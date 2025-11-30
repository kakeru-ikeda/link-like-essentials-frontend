'use client';

import React, { useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/repositories/graphql/client';
import { signInAnonymous, onAuthStateChange } from '@/repositories/firebase/auth';
import { Loading } from '@/components/common/Loading';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthReady(true);
      } else {
        // ログインしていない場合は匿名ログイン
        try {
          await signInAnonymous();
          setIsAuthReady(true);
        } catch (error) {
          console.error('匿名ログインエラー:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 認証が完了するまでローディング表示
  if (!isAuthReady) {
    return <Loading fullScreen message="Loading..." />;
  }

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
