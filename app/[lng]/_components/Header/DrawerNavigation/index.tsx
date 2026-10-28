'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useEffectEvent } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { ROUTES } from '@/_app/routes';
import { getLocalizedPathname } from '@/features/language/model';
import { useCurrentLanguage } from '@/features/language/useCurrentLanguage';
import { useAuth } from '@/entities/auth/useAuth';
import { getProfileImageFallbackUrl } from '@/entities/User/utilities';
import Logo from '@/shared/ui/Logo';
import UserAvatar from '@/shared/ui/UserAvatar';
import type { HeaderVariant } from '../types';
import './style.css';

type DrawerVariant = Exclude<HeaderVariant, 'default'>;

interface DrawerNavigationProps {
  variant: DrawerVariant,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void;
}

function DrawerNavigation({ variant, isOpen, onOpen, onClose }: DrawerNavigationProps) {
  const isMobile = useMediaQuery('screen and (width < 480px)');
  const pathname = usePathname();
  const language = useCurrentLanguage();
  const signUpPathname = getLocalizedPathname(language, ROUTES.signUp);
  const signInPathname = getLocalizedPathname(language, ROUTES.signIn);
  const profilePathname = getLocalizedPathname(language, ROUTES.profile);
  const statisticsPathname = getLocalizedPathname(language, ROUTES.statistics);
  const homePathname = getLocalizedPathname(language, ROUTES.home);

  const { currentUser } = useAuth();
  const closeDrawer = useEffectEvent(onClose);

  useEffect(() => {
    if (!isMobile && isOpen) {
      closeDrawer();
    }
  }, [isMobile, isOpen]);

  useEffect(() => {
    closeDrawer();
  }, [pathname]);

  return (
    <SwipeableDrawer
      anchor='right'
      className='drawer-navigation'
      disableSwipeToOpen={true}
      elevation={0}
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      slotProps={{
        backdrop: {
          className: 'drawer-navigation-backdrop',
        },
        paper: {
          className: 'drawer-navigation-paper',
        },
      }}
    >
      <header className='drawer-navigation-header'>
        <Logo />
        {variant === 'user' && currentUser &&
          <UserAvatar
            className='drawer-navigation-avatar'
            displayName={currentUser.displayName}
            photoUrl={getProfileImageFallbackUrl(true, currentUser.profileImage)}
            alt={`Profile picture of ${currentUser.displayName}`}
          />
        }
      </header>
      <List
        className='drawer-navigation-list'
        component='nav'
        disablePadding
      >
        {variant === 'guest' &&
          <>
            <ListItemButton
              className={`drawer-navigation-link${pathname === signUpPathname ? ' active' : ''}`}
              component={Link}
              href={signUpPathname}
            >
              Sign Up
            </ListItemButton>
            <ListItemButton
              className={`drawer-navigation-link${pathname === signInPathname ? ' active' : ''}`}
              component={Link}
              href={signInPathname}
            >
              Sign In
            </ListItemButton>
          </>
        }
        {variant === 'user' && currentUser &&
          <>
            <ListItemButton
              className={`drawer-navigation-link${pathname === profilePathname ? ' active' : ''}`}
              component={Link}
              href={profilePathname}
            >
              Profile Info
            </ListItemButton>
            <ListItemButton
              className={`drawer-navigation-link${pathname === statisticsPathname ? ' active' : ''}`}
              component={Link}
              href={statisticsPathname}
            >
              Statistics
            </ListItemButton>
          </>
        }
        <ListItemButton
          className={`drawer-navigation-link${pathname === homePathname ? ' active' : ''}`}
          component={Link}
          href={homePathname}
        >
          Home
        </ListItemButton>
      </List>
    </SwipeableDrawer>
  );
}

export default DrawerNavigation;
