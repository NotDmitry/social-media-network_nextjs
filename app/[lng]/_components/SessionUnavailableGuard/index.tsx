'use client';
import ErrorPage from '@/_pages/ErrorPage';
import { useAuth } from '@/entities/auth/useAuth';

function SessionUnavailableGuard({ children }: { children: React.ReactNode }) {
  const { authStatus } = useAuth();

  if (authStatus === 'unavailable') {
    return (
      <ErrorPage onRetry={() => window.location.reload()}/>
    );
  } else {
    return children;
  }
}

export default SessionUnavailableGuard;
