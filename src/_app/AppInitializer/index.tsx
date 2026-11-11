'use client';
import { useEffect, useEffectEvent, useLayoutEffect } from 'react';
import { useT } from 'next-i18next/client';
import { useAppDispatch } from '@/_app/store/hooks';
import { useTheme } from '@/features/theme/useTheme';
import { sessionCleared, sessionEstablished, sessionUnavailable } from '@/entities/auth/model/authSlice';
import { refresh } from '@/entities/auth/api/refresh';
import { getCurrentUser } from '@/entities/User/api/getCurrentUser';
import { useAlert } from '@/shared/ui/Alert/useAlert';
import { accessToken } from '@/shared/api/accessToken';
import { authSession } from '@/shared/api/authSession';
import { BackendResponseError } from '@/shared/api/backendResponseError';
import { isRefreshTokenErrorCode } from '@/shared/api/backendErrorCode';

function AppInitializer() {
  const { t } = useT('authentication');
  const dispatch = useAppDispatch();
  const { showAlert } = useAlert();
  const { restoreTheme } = useTheme();

  const showSessionError = useEffectEvent(() => {
    showAlert(t(($) => $.session.restoration.error), 'error');
  });

  const showSessionTokenError = useEffectEvent(() => {
    showAlert(t(($) => $.session.restoration.tokenError), 'error');
  });

  useLayoutEffect(() => {
    restoreTheme();
  }, [restoreTheme]);

  useEffect(() => {
    const sessionAbortController = new AbortController();

    authSession.registerActions({
      refresh,
      invalidate: () => dispatch(sessionCleared()),
    });

    async function restoreSession() {
      try {
        const savedAccessToken = accessToken.get();

        if (savedAccessToken === null) {
          dispatch(sessionCleared());
          return;
        }

        const currentUser = await getCurrentUser(sessionAbortController.signal);

        if (sessionAbortController.signal.aborted) {
          return;
        }

        dispatch(sessionEstablished(currentUser));
      } catch (error) {
        if (sessionAbortController.signal.aborted) {
          return;
        }

        if (error instanceof BackendResponseError && (
          error.code === 'TOKEN_EXPIRED' ||
          error.code === 'UNAUTHENTICATED' ||
          isRefreshTokenErrorCode(error.code)
        )) {
          showSessionTokenError();
          console.error(error);
          dispatch(sessionCleared());

          return;
        }

        showSessionError();
        console.error(error);
        dispatch(sessionUnavailable());
      }
    }

    void restoreSession();

    return () => {
      sessionAbortController.abort();
    };
  }, [dispatch]);

  return null;
}

export default AppInitializer;
