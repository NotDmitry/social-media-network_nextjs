import { z } from 'zod';

export const idSchema = z.int().nonnegative();

export function createEmailSchema(invalidEmailMessage: string) {
  return z.string()
    .trim()
    .toLowerCase()
    .pipe(z.email({
      error: invalidEmailMessage,
    }));
}

export const emailSchema = z.string()
  .trim()
  .toLowerCase()
  .pipe(z.email());

export const imageUrlSchema = z.string();

export const dateTimeSchema = z.string();

export function createUsernameSchema(usernameRequiredMessage: string) {
  return z.string()
    .trim()
    .nonempty({
      error: usernameRequiredMessage,
    });
}

export const usernameSchema = z.string()
  .trim()
  .nonempty();

export function createNameSchema(nameRequiredMessage: string) {
  return z.string()
    .trim()
    .nonempty({
      error: nameRequiredMessage,
    });
}

export const nameSchema = z.string()
  .trim()
  .nonempty();

export const descriptionSchema = z.string();
