import { describe, expect, test } from 'vitest';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/shared/i18n/i18nSettings';
import { getLocalizedPathname, isSupportedLanguage } from './model';

describe('isSupportedLanguage', () => {
  test('accepts the default language', () => {
    expect(isSupportedLanguage(DEFAULT_LANGUAGE)).toBe(true);
  });

  test('accepts supported languages', () => {
    SUPPORTED_LANGUAGES.forEach((supportedLanguage) => {
      expect(isSupportedLanguage(supportedLanguage)).toBe(true);
    });
  });

  test('rejects a random non-locale string', () => {
    // Arrange
    const invalidLocale = `${SUPPORTED_LANGUAGES.at(0)}${crypto.randomUUID()}`;

    // Assert
    expect(isSupportedLanguage(invalidLocale)).toBe(false);
  });

  test('rejects an empty string', () => {
    expect(isSupportedLanguage('')).toBe(false);
  });

  test('rejects an undefined value', () => {
    expect(isSupportedLanguage(undefined)).toBe(false);
  });

  test('rejects null value', () => {
    expect(isSupportedLanguage(null)).toBe(false);
  });

  test('reject numeric value', () => {
    expect(isSupportedLanguage(27)).toBe(false);
  });
});

describe('getLocalizedPathname', () => {
  test('returns localized path with leading slash', () => {
    expect(getLocalizedPathname('en', 'sign-in')).toBe('/en/sign-in');
  });

  test('omits the trailing slash for localized root path', () => {
    expect(getLocalizedPathname('en', '/')).toBe('/en');
  });

  test('returns localized path for nested paths and query parameters', () => {
    expect(getLocalizedPathname('en', '/profile/statistics?period=day')).toBe('/en/profile/statistics?period=day');
  });
});
