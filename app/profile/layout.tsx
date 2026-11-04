import PrivateRoutes from '@/_app/PrivateRoutes';
import ProfileNavigation from './_components/ProfileNavigation';
import './layout-style.css';

export default function ProfileLayout({ children }: LayoutProps<'/profile'>) {
  return (
    <PrivateRoutes>
      <div className='profile-layout-wrapper'>
        <ProfileNavigation />
        <div className='profile-layout-content'>
          {children}
        </div>
      </div>
    </PrivateRoutes>
  );
}
