'use client';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/_app/routes';
import { ErrorIcon } from '@/shared/icons';
import Button from '@/shared/ui/Button';
import './style.css';

interface ErrorPageProps {
  onRetry: () => void;
}

function ErrorPage({ onRetry }: ErrorPageProps) {
  const router = useRouter();

  function handleHomeNavigation() {
    router.replace(ROUTES.home);
  }

  return (
    <div className='error-page-container'>
      <ErrorIcon className='error-page-icon' />
      <div className='error-page-main-content'>
        <h1 className='error-page-title'>
          <span>Oops...</span>
          Something bad just happened
        </h1>
        <p className='error-page-message'>Please try again or navigate Home</p>
        <div className='error-page-actions'>
          <Button type='button' onClick={onRetry}>Retry</Button>
          <Button type='button' onClick={handleHomeNavigation}>Home</Button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
