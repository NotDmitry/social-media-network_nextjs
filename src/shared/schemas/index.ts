import { z } from 'zod';

export const idSchema = z.int().nonnegative();

export const emailSchema = z.string()
  .trim()
  .toLowerCase()
  .pipe(z.email({
    error: () => "Invalid email address",
  }));

export const imageUrlSchema = z.string();

export const dateTimeSchema = z.string();

export const usernameSchema = z.string()
  .trim()
  .nonempty({
    error: () => "The username can't be empty",
  });

export const nameSchema = z.string()
  .trim()
  .nonempty({
    error: () => "The name can't be empty",
  });

export const descriptionSchema = z.string();
