import { beforeEach, describe, expect, test, vi } from 'vitest';
import i18next from 'i18next';
import { useRouter } from 'next/navigation';
import { renderWithI18n as render } from '@/test/renderWithI18n';
import ErrorPage from './index';

describe('ErrorPage', () => {
  const homeNavLink = '/en';
  const retryButtonLabel = i18next.t(($) => $.actions.retry, { ns: 'errorPage' });
  const homeButtonLabel = i18next.t(($) => $.actions.home, { ns: 'errorPage' });

  const mockOnRetry = vi.fn();
  const mockRouterReplace = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useRouter, { partial: true }).mockReturnValue({ replace: mockRouterReplace });
  });

  test('calls retry action on button click', async () => {
    // Arrange
    const screen = await render(<ErrorPage onRetry={mockOnRetry} homeNavLink={homeNavLink} />);
    const retryButton = screen.getByRole('button', { name: retryButtonLabel });

    // Act
    await retryButton.click();

    // Assert
    expect(mockOnRetry).toHaveBeenCalledOnce();
  });

  test('navigates to the provided home page link on button click', async () => {
    // Arrange
    const screen = await render(<ErrorPage onRetry={mockOnRetry} homeNavLink={homeNavLink} />);
    const homeButton = screen.getByRole('button', { name: homeButtonLabel });

    // Act
    await homeButton.click();

    // Assert
    expect(mockRouterReplace).toHaveBeenCalledExactlyOnceWith(homeNavLink);
  });
});
