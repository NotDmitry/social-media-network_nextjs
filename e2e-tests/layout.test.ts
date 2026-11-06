import { expect, test } from '@playwright/test';
import authenticationTranslations from '../src/shared/i18n/locales/en/authentication.json' with { type: 'json' };
import commonTranslations from '../src/shared/i18n/locales/en/common.json' with { type: 'json' };

test.describe('Layout', () => {
  const mobileViewportSize = { width: 320, height: 480 };

  test('renders layout elements and content at Sign In page', async ({ page }) => {
    // Arrange
    const signInPageTitleContent = authenticationTranslations.signIn.title;

    await page.goto('/en/sign-in');
    const header = page.getByRole('banner');
    const main = page.getByRole('main');
    const signInPageTitle = main.getByRole('heading', { name: signInPageTitleContent });
    const footer = page.getByRole('contentinfo');

    // Assert
    await expect(header).toBeVisible();
    await expect(main).toBeVisible();
    await expect(signInPageTitle).toBeVisible();
    await expect(footer).toBeVisible();
  });

  test('closes mobile drawer after a successful navigation', async ({ page }) => {
    // Arrange
    const emailInputLabel = authenticationTranslations.signIn.input.email.label;
    const passwordInputLabel = authenticationTranslations.signIn.input.password.label;
    const submitButtonLabel = authenticationTranslations.signIn.button.default;
    const mobileProfileInfoLinkLabel = commonTranslations.navigation.profileInfo;
    const burgerMenuButtonLabel = commonTranslations.a11y.openMobileNavigation;

    const testEmail = 'helena.hills@social.com';
    const testPassword = 'password789';

    await page.setViewportSize(mobileViewportSize);
    await page.goto('/en/sign-in');
    const emailInput = page.getByRole('textbox', { name: emailInputLabel });
    const passwordInput = page.getByRole('textbox', { name: passwordInputLabel });
    const submitButton = page.getByRole('button', { name: submitButtonLabel });
    const mobileProfileInfoLink = page.getByRole('link', { name: mobileProfileInfoLinkLabel });
    const burgerMenuButton = page.getByRole('button', { name: burgerMenuButtonLabel });
    const drawer = page
      .getByRole('dialog', { includeHidden: true })
      .filter({
        has: page.getByRole('link', {
          name: mobileProfileInfoLinkLabel,
          includeHidden: true,
        }),
      });

    // Act
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await submitButton.click();

    // Assert
    await expect(page).toHaveURL(/\/en$/);
    await expect(burgerMenuButton).toBeVisible();

    // Act
    await burgerMenuButton.click();

    // Assert
    await expect(drawer).toBeVisible();
    await expect(mobileProfileInfoLink).toBeVisible();

    // Act
    await mobileProfileInfoLink.click();

    // Assert
    await expect(page).toHaveURL(/\/en\/profile$/);
    await expect(drawer).toBeAttached();
    await expect(drawer).toBeHidden();
    await expect(burgerMenuButton).toBeVisible();
  });
});
