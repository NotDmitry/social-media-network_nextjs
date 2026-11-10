import { expect, test } from '@playwright/test';
import authenticationTranslations from '../src/shared/i18n/locales/en/authentication.json' with { type: 'json' };
import commonTranslations from '../src/shared/i18n/locales/en/common.json' with { type: 'json' };
import profileTranslations from '../src/shared/i18n/locales/en/profile.json' with { type: 'json' };

test.describe('Sign In', () => {
  const signInNavigationLabel = commonTranslations.navigation.signIn;
  const emailInputLabel = authenticationTranslations.signIn.input.email.label;
  const passwordInputLabel = authenticationTranslations.signIn.input.password.label;
  const submitButtonLabel = authenticationTranslations.signIn.button.default;
  const profileNavigationLinkFragment = /Helena Hills/i;

  const testEmail = 'helena.hills@social.com';
  const testPassword = 'password789';

  test('signs in and opens the Home page for authenticated user', async ({ page }) => {
    // Arrange
    await page.goto('/en');
    const successAlertMessage = authenticationTranslations.signIn.alert.success;
    const signInNavigationLink = page.getByRole('banner').getByRole('link', { name: signInNavigationLabel });
    const emailInput = page.getByRole('textbox', { name: emailInputLabel });
    const passwordInput = page.getByRole('textbox', { name: passwordInputLabel });
    const submitButton = page.getByRole('button', { name: submitButtonLabel });
    const successAlert = page.getByText(successAlertMessage);
    const profileNavigationLink = page.getByRole('banner').getByRole('link', { name: profileNavigationLinkFragment });

    // Act
    await signInNavigationLink.click();

    // Assert
    await expect(page).toHaveURL(/\/en\/sign-in$/);

    // Act
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await submitButton.click();

    // Assert
    await expect(page).toHaveURL(/\/en$/);
    await expect(successAlert).toBeVisible();
    await expect(profileNavigationLink).toBeVisible();
  });

  test('shows invalid-credentials error alert and stays at Sign In page', async ({ page }) => {
    // Arrange
    await page.goto('/en/sign-in');
    const testWrongPassword = 'wrong-password';
    const invalidCredentialsAlertMessage = authenticationTranslations.signIn.alert.invalidCredentials;
    const emailInput = page.getByRole('textbox', { name: emailInputLabel });
    const passwordInput = page.getByRole('textbox', { name: passwordInputLabel });
    const submitButton = page.getByRole('button', { name: submitButtonLabel });
    const invalidCredentialsAlert = page.getByText(invalidCredentialsAlertMessage);

    // Act
    await emailInput.fill(testEmail);
    await passwordInput.fill(testWrongPassword);
    await submitButton.click();

    // Assert
    await expect(invalidCredentialsAlert).toBeVisible();
    await expect(emailInput).toHaveValue(testEmail);
    await expect(passwordInput).toHaveValue(testWrongPassword);
    await expect(page).toHaveURL(/\/en\/sign-in$/);
  });

  test('session survives page reload', async ({ page }) => {
    // Arrange
    await page.goto('/en/sign-in');
    const editProfileSectionHeadingText = profileTranslations.info.edit;
    const emailInput = page.getByRole('textbox', { name: emailInputLabel });
    const passwordInput = page.getByRole('textbox', { name: passwordInputLabel });
    const submitButton = page.getByRole('button', { name: submitButtonLabel });
    const profileLink = page.getByRole('banner').getByRole('link', { name: profileNavigationLinkFragment });
    const editProfileSectionHeading = page.getByRole('heading', { name: editProfileSectionHeadingText });

    // Act
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    await submitButton.click();

    // Assert
    await expect(profileLink).toBeVisible();

    // Act
    await profileLink.click();

    // Assert
    await expect(editProfileSectionHeading).toBeVisible();
    await expect(page).toHaveURL(/\/en\/profile$/);

    // Act
    await page.reload();

    // Assert
    await expect(editProfileSectionHeading).toBeVisible();
    await expect(page).toHaveURL(/\/en\/profile$/);
  });
});
