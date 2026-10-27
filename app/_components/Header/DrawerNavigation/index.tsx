'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useEffectEvent } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { ROUTES } from '@/_app/routes';
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
              className={`drawer-navigation-link${pathname === ROUTES.signUp ? ' active' : ''}`}
              component={Link}
              href={ROUTES.signUp}
            >
              Sign Up
            </ListItemButton>
            <ListItemButton
              className={`drawer-navigation-link${pathname === ROUTES.signIn ? ' active' : ''}`}
              component={Link}
              href={ROUTES.signIn}
            >
              Sign In
            </ListItemButton>
          </>
        }
        {variant === 'user' && currentUser &&
          <>
            <ListItemButton
              className={`drawer-navigation-link${pathname === ROUTES.profile ? ' active' : ''}`}
              component={Link}
              href={ROUTES.profile}
            >
              Profile Info
            </ListItemButton>
            <ListItemButton
              className={`drawer-navigation-link${pathname === ROUTES.statistics ? ' active' : ''}`}
              component={Link}
              href={ROUTES.statistics}
            >
              Statistics
            </ListItemButton>
          </>
        }
        <ListItemButton
          className={`drawer-navigation-link${pathname === ROUTES.home ? ' active' : ''}`}
          component={Link}
          href={ROUTES.home}
        >
          Home
        </ListItemButton>
      </List>
    </SwipeableDrawer>
  );
}

export default DrawerNavigation;
