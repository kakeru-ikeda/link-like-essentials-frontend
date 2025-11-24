'use client';

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/repositories/graphql/client';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
