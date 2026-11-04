'use client';
import { ROUTES } from '@/_app/routes';
import ErrorPage from '@/_pages/ErrorPage';
import { useAuth } from '@/entities/auth/useAuth';
import { getLocalizedPathname } from '@/features/language/model';
import { useCurrentLanguage } from '@/features/language/useCurrentLanguage';

function SessionUnavailableGuard({ children }: { children: React.ReactNode }) {
  const { authStatus } = useAuth();
  const language = useCurrentLanguage();

  if (authStatus === 'unavailable') {
    return (
      <ErrorPage
        onRetry={() => window.location.reload()}
        homeNavLink={getLocalizedPathname(language, ROUTES.home)}
      />
    );
  } else {
    return children;
  }
}

export default SessionUnavailableGuard;
