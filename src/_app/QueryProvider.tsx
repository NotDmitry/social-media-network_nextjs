'use client';
import { useEffect, useState } from 'react';
import { addListener } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/_app/store/hooks';
import { sessionCleared } from '@/entities/auth/model/authSlice';

const QUERY_STALE_CACHE_TIME = 20 * 1000; // 20s

function QueryStoreListener() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = dispatch(addListener({
      actionCreator: sessionCleared,
      effect: () => {
        queryClient.removeQueries({ queryKey: ['profileStatistics'] });
      },
    }));

    return () => {
      unsubscribe();
    };
  }, [queryClient, dispatch]);

  return null;
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: QUERY_STALE_CACHE_TIME,
          retry: false,
        }
      }
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <QueryStoreListener />
      {children}
    </QueryClientProvider>
  );
}
