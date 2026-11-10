'use client';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from './store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const [{ store, initialState }] = useState(() => {
    const store = makeStore();

    return { store, initialState: store.getState() };
  });

  return (
    <Provider store={store} serverState={initialState}>
      {children}
    </Provider>
  );
}
