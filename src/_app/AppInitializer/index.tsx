'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/_app/store/hooks';
import { sessionCleared, sessionEstablished, sessionUnavailable } from '@/entities/auth/model/authSlice';
import { refresh } from '@/entities/auth/api/refresh';
import { getCurrentUser } from '@/entities/User/api/getCurrentUser';
import { accessToken } from '@/shared/api/accessToken';
import { BackendResponseError } from '@/shared/api/backendResponseError';
import { isRefreshTokenErrorCode } from '@/shared/api/backendErrorCode';

function AppInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const sessionAbortController = new AbortController();

    async function restoreSession() {
      try {
        const refreshResponsePayload = await refresh();

        if (sessionAbortController.signal.aborted) {
          return;
        }

        accessToken.set(refreshResponsePayload.token);

        const currentUser = await getCurrentUser(sessionAbortController.signal);

        dispatch(sessionEstablished(currentUser));
      } catch (error) {
        if (sessionAbortController.signal.aborted) {
          return;
        }

        if (error instanceof BackendResponseError && isRefreshTokenErrorCode(error.code)) {
          if (error.code !== 'REFRESH_TOKEN_REQUIRED') {
            console.error(error);
          }

          dispatch(sessionCleared());

          return;
        }

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
