'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from 'next-i18next/client';
import { ROUTES } from '@/_app/routes';
import { getLocalizedPathname } from '@/features/language/model';
import { useCurrentLanguage } from '@/features/language/useCurrentLanguage';
import './style.css';

function ProfileNavigation() {
  const { t } = useT('common');
  const pathName = usePathname();
  const language = useCurrentLanguage();
  const profilePathname = getLocalizedPathname(language, ROUTES.profile);
  const statisticsPathname = getLocalizedPathname(language, ROUTES.statistics);

  return (
    <nav className='profile-layout-navigation'>
      <Link
        className={`profile-layout-link${pathName === profilePathname ? ' active' : ''}`}
        href={profilePathname}
      >
        {t(($) => $.navigation.profileInfo)}
      </Link>
      <Link
        className={`profile-layout-link${pathName === statisticsPathname ? ' active' : ''}`}
        href={statisticsPathname}
      >
        {t(($) => $.navigation.statistics)}
      </Link>
    </nav>
  );
}

export default ProfileNavigation;
