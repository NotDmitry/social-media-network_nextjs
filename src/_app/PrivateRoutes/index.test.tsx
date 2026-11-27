import { afterEach, describe, expect, test, vi } from 'vitest';
import i18next from 'i18next';
import { redirect } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';
import { renderWithI18n as render } from '@/test/renderWithI18n';
import PrivateRoutes from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
}));

describe('PrivateRoutes', () => {
  const testChildrenHeadingText = 'Test children text';

  afterEach(() => {
    vi.mocked(redirect).mockClear();
  });

  test('shows spinner while in pending state', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ authStatus: 'pending' });
    const loadingMessageText = i18next.t(($) => $.session.permissions.loading, { ns: 'authentication' });
    const screen = await render(
      <PrivateRoutes>
        <h1>{testChildrenHeadingText}</h1>
      </PrivateRoutes>
    );
    const spinner = screen.getByRole('progressbar');
    const loadingMessage = screen.getByText(loadingMessageText);
    const testChildrenHeading = screen.getByRole('heading', { name: testChildrenHeadingText });

    // Assert
    await expect.element(spinner).toBeVisible();
    await expect.element(loadingMessage).toBeVisible();
    await expect.element(testChildrenHeading).not.toBeInTheDocument();
  });

  test('shows protected content without loader for authenticated users', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ authStatus: 'authenticated' });
    const loadingMessageText = i18next.t(($) => $.session.permissions.loading, { ns: 'authentication' });
    const screen = await render(
      <PrivateRoutes>
        <h1>{testChildrenHeadingText}</h1>
      </PrivateRoutes>
    );
    const spinner = screen.getByRole('progressbar');
    const loadingMessage = screen.getByText(loadingMessageText);
    const testChildrenHeading = screen.getByRole('heading', { name: testChildrenHeadingText });

    // Assert
    await expect.element(testChildrenHeading).toBeVisible();
    await expect.element(spinner).not.toBeInTheDocument();
    await expect.element(loadingMessage).not.toBeInTheDocument();
  });

  test('redirect guests to the Sign In page without leaking protected content', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ authStatus: 'guest' });
    const screen = await render(
      <PrivateRoutes>
        <h1>{testChildrenHeadingText}</h1>
      </PrivateRoutes>
    );
    const testChildrenHeading = screen.getByRole('heading', { name: testChildrenHeadingText });

    // Assert
    await expect.element(testChildrenHeading).not.toBeInTheDocument();
    expect(redirect).toHaveBeenCalledExactlyOnceWith('/en/sign-in');
  });

  test('redirect to the Sign In page without leaking protected content in unavailable state', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ authStatus: 'unavailable' });
    const screen = await render(
      <PrivateRoutes>
        <h1>{testChildrenHeadingText}</h1>
      </PrivateRoutes>
    );
    const testChildrenHeading = screen.getByRole('heading', { name: testChildrenHeadingText });

    // Assert
    await expect.element(testChildrenHeading).not.toBeInTheDocument();
    expect(redirect).toHaveBeenCalledExactlyOnceWith('/en/sign-in');
  });
});
