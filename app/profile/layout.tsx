import ProfileNavigation from './_components/ProfileNavigation';
import './layout-style.css';

export default function ProfileLayout({ children }: LayoutProps<'/profile'>) {
  return (
    <div className='profile-layout-wrapper'>
      <ProfileNavigation />
      <div className='profile-layout-content'>
        {children}
      </div>
    </div>
  );
}
