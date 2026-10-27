'use client';
import { useEffect } from 'react';
import ErrorPage from '@/_pages/ErrorPage';

interface ErrorBoundaryProps {
  error: unknown;
  retry: () => void;
}

export default function Error({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('Caught by Error Boundary:', error);
  }, [error]);

  return (
    <ErrorPage onRetry={retry} />
  );
}
