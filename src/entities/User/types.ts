import { z } from 'zod';
import { userModelSchema } from './schema';

export type UserModel = z.output<typeof userModelSchema>;

export interface CurrentUserView extends UserModel {
  displayName: string;
}

export interface UpdateProfilePayload {
  username?: string;
  firstName?: string;
  secondName?: string;
  profileImage?: string;
  description?: string;
}

export interface User {
  username: string;
  firstName?: string | null;
  secondName?: string | null;
};
