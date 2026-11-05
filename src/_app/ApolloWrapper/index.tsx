'use client';
import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { HttpLink } from '@apollo/client';
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
import { addListener } from '@reduxjs/toolkit';
import { useAppDispatch } from '@/_app/store/hooks';
import { sessionCleared } from '@/entities/auth/model/authSlice';
import { protectedGraphqlFetch } from '@/shared/api/protectedGraphqlFetch';

function makeClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: '/api/graphql',
      fetch: protectedGraphqlFetch,
    }),
    cache: new InMemoryCache(),
  });
}

function ApolloStoreListener() {
  const apolloClient = useApolloClient();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = dispatch(addListener({
      actionCreator: sessionCleared,
      effect: async () => {
        await apolloClient.clearStore();
      },
    }));

    return () => {
      unsubscribe();
    };
  }, [apolloClient, dispatch]);

  return null;
}

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      <ApolloStoreListener />
      {children}
    </ApolloNextAppProvider>
  );
}
