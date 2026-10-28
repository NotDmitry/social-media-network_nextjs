'use client';
import { useAuth } from '@/entities/auth/useAuth';
import Spinner from '@/shared/ui/Spinner';

function SessionRestorationGuard({ children }: { children: React.ReactNode }) {
  const { authStatus } = useAuth();

  if (authStatus === 'pending') {
    return (
      <Spinner label="Session restoration"/>
    );
  } else {
    return children;
  }
}

export default SessionRestorationGuard;
