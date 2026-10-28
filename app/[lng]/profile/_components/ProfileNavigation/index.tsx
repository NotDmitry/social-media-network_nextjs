'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/_app/routes';
import './style.css';

function ProfileNavigation() {
  const pathName = usePathname();

  return (
    <nav className='profile-layout-navigation'>
      <Link
        className={`profile-layout-link${pathName === ROUTES.profile ? ' active' : ''}`}
        href={ROUTES.profile}
      >
        Profile Info
      </Link>
      <Link
        className={`profile-layout-link${pathName === ROUTES.statistics ? ' active' : ''}`}
        href={ROUTES.statistics}
      >
        Statistics
      </Link>
    </nav>
  );
}

export default ProfileNavigation;
