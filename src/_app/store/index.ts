import { configureStore } from '@reduxjs/toolkit';
import { createAuthListenerMiddleware } from '@/entities/auth/model/authListener';
import { authReducer } from '@/entities/auth/model/authSlice';

export const makeStore = () => {
  const authListenerMiddleware = createAuthListenerMiddleware();

  return configureStore({
    reducer: {
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(authListenerMiddleware.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
