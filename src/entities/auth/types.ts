import type { UserModel } from '@/entities/User/types';

export type AuthStatus = 'pending' | 'guest' | 'authenticated' | 'unavailable';

export interface AuthState {
  status: AuthStatus;
  currentUser: UserModel | null;
}
