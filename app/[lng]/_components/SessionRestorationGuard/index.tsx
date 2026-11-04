'use client';
import { useT } from 'next-i18next/client';
import { useAuth } from '@/entities/auth/useAuth';
import Spinner from '@/shared/ui/Spinner';

function SessionRestorationGuard({ children }: { children: React.ReactNode }) {
  const { t } = useT('authentication');
  const { authStatus } = useAuth();

  if (authStatus === 'pending') {
    return (
      <Spinner label={t(($) => $.session.restoration.loading)} />
    );
  } else {
    return children;
  }
}

export default SessionRestorationGuard;
