import { renderWithI18n } from './renderWithI18n';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function renderWithI18nQueryClient(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return renderWithI18n(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}
