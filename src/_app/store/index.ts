import { configureStore } from '@reduxjs/toolkit';
import { authListenerMiddleware } from '@/entities/auth/model/authListener';
import { authReducer } from '@/entities/auth/model/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(authListenerMiddleware.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;
