import { z } from 'zod';
import { createEmailSchema } from '@/shared/schemas';

interface SignInFormSchemaMessages {
  invalidEmail: string;
  passwordRequired: string;
}

export function createSignInFormSchema({ invalidEmail, passwordRequired }: SignInFormSchemaMessages) {
  const signInPasswordSchema = z.string().nonempty({
    error: passwordRequired,
  });

  return z.object({
    email: createEmailSchema(invalidEmail),
    password: signInPasswordSchema,
  });
}
