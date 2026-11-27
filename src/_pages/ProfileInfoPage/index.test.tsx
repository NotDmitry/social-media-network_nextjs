import { beforeEach, describe, expect, test, vi } from 'vitest';
import i18next from 'i18next';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';
import { useTheme } from '@/features/theme/useTheme';
import { useAlertStore } from '@/shared/ui/Alert/model/store';
import AlertStack from '@/shared/ui/Alert/AlertStack';
import { renderWithI18nAndMuiStyles as render } from '@/test/renderWithI18nAndMuiStyles';
import { currentUser } from '@/test/userFixtures';
import ProfileInfoPage from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
}));

vi.mock(import('@/features/theme/useTheme'), () => ({
  useTheme: vi.fn(),
}));

describe('ProfileInfoPage', () => {
  const signInNavLink = '/en/sign-in';
  const themeToggleLabelText = i18next.t(($) => $.info.darkTheme, { ns: 'profile' });
  const signOutButtonLabel = i18next.t(($) => $.signOut.button.default, { ns: 'authentication' });
  const pendingSignOutButtonLabel = i18next.t(($) => $.signOut.button.pending, { ns: 'authentication' });
  const successAlertMessage = i18next.t(($) => $.signOut.alert.success, { ns: 'authentication' });
  const warningAlertMessage = i18next.t(($) => $.signOut.alert.warning, { ns: 'authentication' });

  const mockSignOut = vi.fn();
  const mockSetTheme = vi.fn();
  const mockRouterReplace = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useRouter, { partial: true }).mockReturnValue({ replace: mockRouterReplace });
    vi.mocked(useTheme, { partial: true }).mockReturnValue({ theme: 'light', setTheme: mockSetTheme });
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser, signOut: mockSignOut });
    useAlertStore.setState({ alerts: [] });
  });

  test('requests theme change when theme switch is toggled', async () => {
    // Arrange
    const screen = await render(<ProfileInfoPage signInNavLink={signInNavLink} />);
    const themeToggleElement = screen.getByRole('checkbox', { name: themeToggleLabelText });
    const themeToggleLabel = screen.getByText(themeToggleLabelText);

    // Assert
    await expect.element(themeToggleElement).not.toBeChecked();

    // Act
    await themeToggleLabel.click();

    // Assert
    expect(mockSetTheme).toHaveBeenCalledExactlyOnceWith('dark');
  });

  test('disables Sign Out button during a pending request', async () => {
    // Arrange
    let resolvePendingSignOut!: () => void;

    mockSignOut.mockReturnValue(new Promise<void>((resolve) => {
      resolvePendingSignOut = resolve;
    }));

    const screen = await render(<ProfileInfoPage signInNavLink={signInNavLink} />);
    const signOutButton = screen.getByRole('button', { name: signOutButtonLabel });
    const pendingSignOutButton = screen.getByRole('button', { name: pendingSignOutButtonLabel });

    // Act
    await signOutButton.click();

    // Assert
    await expect.element(pendingSignOutButton).toBeDisabled();

    // Act
    resolvePendingSignOut();

    // Assert
    await expect.element(signOutButton).toBeEnabled();
    expect(mockSignOut).toHaveBeenCalledOnce();
  });

  test('shows success alert and navigates to Sign In page after successful logout', async () => {
    // Arrange
    const screen = await render(
      <>
        <ProfileInfoPage signInNavLink={signInNavLink} />
        <AlertStack />
      </>
    );
    const signOutButton = screen.getByRole('button', { name: signOutButtonLabel });
    const successAlert = screen.getByText(successAlertMessage);

    // Act
    await signOutButton.click();

    // Assert
    await expect.element(successAlert).toBeVisible();
    expect(mockSignOut).toHaveBeenCalledOnce();
    expect(mockRouterReplace).toHaveBeenCalledExactlyOnceWith(signInNavLink);
  });

  test('shows warning alert and navigates to Sign In page after failed logout', async () => {
    // Arrange
    mockSignOut.mockRejectedValue(new Error('Network connection lost'));
    const screen = await render(
      <>
        <ProfileInfoPage signInNavLink={signInNavLink} />
        <AlertStack />
      </>
    );
    const signOutButton = screen.getByRole('button', { name: signOutButtonLabel });
    const warningAlert = screen.getByText(warningAlertMessage);

    // Act
    await signOutButton.click();

    // Assert
    await expect.element(warningAlert).toBeVisible();
    expect(mockSignOut).toHaveBeenCalledOnce();
    expect(mockRouterReplace).toHaveBeenCalledExactlyOnceWith(signInNavLink);
  });
});
