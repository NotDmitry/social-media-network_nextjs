import { z } from 'zod';
import type { SignUpPayload } from '@/entities/auth/types';
import { createEmailSchema, createNameSchema } from '@/shared/schemas';

interface SignUpFormSchemaMessages {
  fullNameMaxWords: string;
  invalidEmail: string;
  nameRequired: string;
  passwordMaxLength: string;
  passwordMinLength: string;
  passwordRequired: string;
  repeatPasswordMismatch: string;
  repeatPasswordRequired: string;
}

export function createSignUpFormSchema({
  fullNameMaxWords,
  invalidEmail,
  nameRequired,
  passwordMaxLength,
  passwordMinLength,
  passwordRequired,
  repeatPasswordMismatch,
  repeatPasswordRequired,
}: SignUpFormSchemaMessages) {
  const signUpPasswordSchema = z.string()
    .nonempty({
      error: () => passwordRequired,
    })
    .min(8, {
      error: passwordMinLength,
    })
    .max(128, {
      error: passwordMaxLength,
    });

  const repeatPasswordSchema = z.string()
    .nonempty({
      error: repeatPasswordRequired,
    });

  const fullNameSchema = createNameSchema(nameRequired).refine(
    (fullName) => {
      const names = fullName.split(' ').filter((word) => word !== '');
      return names.length <= 2;
    },
    {
      error: fullNameMaxWords,
    }
  );

  return z.object({
    fullName: fullNameSchema,
    email: createEmailSchema(invalidEmail),
    password: signUpPasswordSchema,
    repeatPassword: repeatPasswordSchema,
  }).refine(({ password, repeatPassword }) => password === repeatPassword, {
    error: repeatPasswordMismatch,
    path: ['repeatPassword'],
  }).transform(({ fullName, email, password }) => {
    const [firstName, secondName] = fullName.split(' ').filter((word) => word !== '');

    const signUpPayload: SignUpPayload = {
      email,
      password,
      firstName,
    }

    if (secondName) {
      signUpPayload.secondName = secondName;
    }

    return signUpPayload;
  });
}

export type SignUpFormFields = z.input<ReturnType<typeof createSignUpFormSchema>>;
