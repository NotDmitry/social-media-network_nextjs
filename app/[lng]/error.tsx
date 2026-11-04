'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ROUTES } from '@/_app/routes';
import ErrorPage from '@/_pages/ErrorPage';
import { getLocalizedPathname, isSupportedLanguage } from '@/features/language/model';

interface ErrorBoundaryProps {
  error: unknown;
  retry: () => void;
}

export default function Error({ error, retry }: ErrorBoundaryProps) {
  const params = useParams();
  const homeNavLink = isSupportedLanguage(params?.lng)
    ? getLocalizedPathname(params.lng, ROUTES.home)
    : ROUTES.home;

  useEffect(() => {
    console.error('Caught by Error Boundary:', error);
  }, [error]);

  return (
    <ErrorPage onRetry={retry} homeNavLink={homeNavLink} />
  );
}
