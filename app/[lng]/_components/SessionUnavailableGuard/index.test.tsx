import { describe, expect, test, vi } from 'vitest';
import i18next from 'i18next';
import { useAuth } from '@/entities/auth/useAuth';
import { renderWithI18n as render } from '@/test/renderWithI18n';
import SessionUnavailableGuard from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
}));

describe('SessionUnavailableGuard', () => {
  const expectedChildText = 'Test child text';

  test('shows child content when not in unavailable auth state', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ authStatus: 'authenticated' });
    const screen = await render(
      <SessionUnavailableGuard>
        <p>{expectedChildText}</p>
      </SessionUnavailableGuard>
    );
    const child = screen.getByText(expectedChildText);

    // Assert
    await expect.element(child).toBeVisible();
  });

  test('replaces child content with error page when in unavailable auth state', async () => {
    // Arrange
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ authStatus: 'unavailable' });
    const errorPageMessageText = i18next.t(($) => $.message, { ns: 'errorPage' });
    const screen = await render(
      <SessionUnavailableGuard>
        <p>{expectedChildText}</p>
      </SessionUnavailableGuard>
    );
    const child = screen.getByText(expectedChildText);
    const errorPageMessage = screen.getByText(errorPageMessageText);

    // Assert
    await expect.element(child).not.toBeInTheDocument();
    await expect.element(errorPageMessage).toBeVisible();
  });
});
