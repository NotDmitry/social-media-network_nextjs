import { getT } from '@/shared/i18n/i18n.server';
import { NotFoundIcon } from '@/shared/icons';
import './style.css';

async function NotFoundPage() {
  const { t } = await getT('common');

  return (
    <div className='not-found-page-container'>
      <NotFoundIcon className='not-found-page-icon' />
      <h1 className='not-found-page-title'>{t(($) => $.pageNotFound)}</h1>
    </div>
  );
}

export default NotFoundPage;
