import { z } from 'zod';
import { userModelSchema } from './schema';

export type UserModel = z.output<typeof userModelSchema>;
