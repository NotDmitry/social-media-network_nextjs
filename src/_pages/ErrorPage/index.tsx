'use client';
import { useRouter } from 'next/navigation';
import { useT } from 'next-i18next/client';
import { ErrorIcon } from '@/shared/icons';
import Button from '@/shared/ui/Button';
import './style.css';

interface ErrorPageProps {
  onRetry: () => void;
  homeNavLink: string;
}

function ErrorPage({ onRetry, homeNavLink }: ErrorPageProps) {
  const { t } = useT('errorPage');
  const router = useRouter();

  function handleHomeNavigation() {
    router.replace(homeNavLink);
  }

  return (
    <div className='error-page-container'>
      <ErrorIcon className='error-page-icon' />
      <div className='error-page-main-content'>
        <h1 className='error-page-title'>
          <span>{t(($) => $.title.prefix)}</span>
          {t(($) => $.title.main)}
        </h1>
        <p className='error-page-message'>{t(($) => $.message)}</p>
        <div className='error-page-actions'>
          <Button type='button' onClick={onRetry}>{t(($) => $.actions.retry)}</Button>
          <Button type='button' onClick={handleHomeNavigation}>{t(($) => $.actions.home)}</Button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
