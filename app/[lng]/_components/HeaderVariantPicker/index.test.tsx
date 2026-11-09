import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';
import type { AuthStatus } from '@/entities/auth/types';
import Header from '../Header';
import type { HeaderVariant } from '../Header/types';
import HeaderVariantPicker from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
}));

vi.mock(import('../Header'), () => ({
  default: vi.fn(({ variant }: { variant: HeaderVariant }) => <p>{variant}</p>)
}));

describe('HeaderVariantPicker', () => {
  interface HeaderVariantCase {
    testDescription: string;
    authStatus: AuthStatus;
    pathname: string;
    expectedVariant: HeaderVariant;
  };

  const headerVariantCases: HeaderVariantCase[] = [
    {
      testDescription: 'shows default header on public route with unavailable status',
      authStatus: 'unavailable',
      pathname: '/en',
      expectedVariant: 'default',
    },
    {
      testDescription: 'shows default header on protected route with unavailable status',
      authStatus: 'unavailable',
      pathname: '/en/profile',
      expectedVariant: 'default',
    },
    {
      testDescription: 'shows default header on public route with pending status',
      authStatus: 'pending',
      pathname: '/en',
      expectedVariant: 'default',
    },
    {
      testDescription: 'shows default header on protected route with pending status',
      authStatus: 'pending',
      pathname: '/en/profile',
      expectedVariant: 'default',
    },
    {
      testDescription: 'shows guest header on public route with guest status',
      authStatus: 'guest',
      pathname: '/en',
      expectedVariant: 'guest',
    },
    {
      testDescription: 'shows default header on private route with guest status',
      authStatus: 'guest',
      pathname: '/en/profile',
      expectedVariant: 'default',
    },
    {
      testDescription: 'shows user header on public route with authenticated status',
      authStatus: 'authenticated',
      pathname: '/en',
      expectedVariant: 'user',
    },
    {
      testDescription: 'shows user header on private route with authenticated status',
      authStatus: 'authenticated',
      pathname: '/en/profile',
      expectedVariant: 'user',
    },
  ];

  beforeEach(() => {
    vi.mocked(Header).mockClear();
  });

  afterEach(() => {
    vi.mocked(usePathname).mockReturnValue('/en');
  });

  test.for(headerVariantCases)('$testDescription', async ({ authStatus, pathname, expectedVariant }) => {
    // Arrange
    vi.mocked(usePathname).mockReturnValue(pathname);
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ authStatus });
    await render(<HeaderVariantPicker />);

    // Assert
    expect(vi.mocked(Header).mock.lastCall?.[0].variant).toBe(expectedVariant);
  });
});
