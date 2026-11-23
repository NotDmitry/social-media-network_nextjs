import { expect, test } from '@playwright/test';
import authenticationTranslations from '../src/shared/i18n/locales/en/authentication.json' with { type: 'json' };
import profileTranslations from '../src/shared/i18n/locales/en/profile.json' with { type: 'json' };

test.describe('Update Profile', () => {
  const signUpFullNameInputLabel = authenticationTranslations.signUp.input.fullName.label;
  const signUpEmailInputLabel = authenticationTranslations.signUp.input.email.label;
  const signUpPasswordInputLabel = authenticationTranslations.signUp.input.password.label;
  const repeatPasswordInputLabel = authenticationTranslations.signUp.input.repeatPassword.label;
  const signUpButtonLabel = authenticationTranslations.signUp.button.default;
  const profileInfoEditHeadingText = profileTranslations.info.edit;

  const usernameInputLabel = profileTranslations.update.input.username.label;
  const emailInputLabel = profileTranslations.update.input.email.label;
  const descriptionInputLabel = profileTranslations.update.input.description.label;
  const updateProfileButtonLabel = profileTranslations.update.button.default;

  const testFullName = 'John Doe';
  const testPassword = '12345678';

  test.beforeEach(async ({ page }) => {
    await page.goto('/en/sign-up');
    const testEmail = `test.profile.${crypto.randomUUID()}@example.com`;
    const signUpFullNameInput = page.getByRole('textbox', { name: signUpFullNameInputLabel });
    const signUpEmailInput = page.getByRole('textbox', { name: signUpEmailInputLabel });
    const signUpPasswordInput = page.getByRole('textbox', { name: signUpPasswordInputLabel, exact: true });
    const repeatPasswordInput = page.getByRole('textbox', { name: repeatPasswordInputLabel });
    const signUpButton = page.getByRole('button', { name: signUpButtonLabel });
    const profileInfoEditHeading = page.getByRole('heading', { name: profileInfoEditHeadingText });

    await signUpFullNameInput.fill(testFullName);
    await signUpEmailInput.fill(testEmail);
    await signUpPasswordInput.fill(testPassword);
    await repeatPasswordInput.fill(testPassword);
    await signUpButton.click();

    await expect(page).toHaveURL(/\/en$/);

    await page.goto('/en/profile');
    await expect(profileInfoEditHeading).toBeVisible();
  });

  test('keeps successfully updated non-email fields after a page reload', async ({ page }) => {
    // Arrange
    const updatedUsername = `@user_${crypto.randomUUID()}`;
    const updatedDescription = 'Profile description update';
    const successAlertMessage = profileTranslations.update.alert.success;

    const usernameInput = page.getByRole('textbox', { name: usernameInputLabel });
    const descriptionInput = page.getByRole('textbox', { name: descriptionInputLabel });
    const updateProfileButton = page.getByRole('button', { name: updateProfileButtonLabel });
    const successAlert = page.getByText(successAlertMessage);

    // Act
    await usernameInput.fill(updatedUsername);
    await descriptionInput.fill(updatedDescription);
    await updateProfileButton.click();

    // Assert
    await expect(successAlert).toBeVisible();

    // Act
    await page.reload();

    // Assert
    await expect(usernameInput).toHaveValue(updatedUsername);
    await expect(descriptionInput).toHaveValue(updatedDescription);
  });

  test('keeps updated email and description after password confirmation and reload', async ({ page }) => {
    // Arrange
    const updatedEmail = `updated.profile.${crypto.randomUUID()}@example.com`;
    const updatedDescription = 'Profile description update';
    const passwordConfirmationInputLabel = profileTranslations.update.confirmation.input.password.label;
    const confirmButtonLabel = profileTranslations.update.confirmation.button.default;
    const successAlertMessage = profileTranslations.update.alert.success;

    const emailInput = page.getByRole('textbox', { name: emailInputLabel });
    const descriptionInput = page.getByRole('textbox', { name: descriptionInputLabel });
    const updateProfileButton = page.getByRole('button', { name: updateProfileButtonLabel });
    const passwordConfirmationModal = page.getByRole('dialog');
    const passwordConfirmationInput = passwordConfirmationModal.getByRole('textbox', {
      name: passwordConfirmationInputLabel
    });
    const confirmButton = passwordConfirmationModal.getByRole('button', { name: confirmButtonLabel, exact: true });
    const successAlert = page.getByText(successAlertMessage);

    // Act
    await emailInput.fill(updatedEmail);
    await descriptionInput.fill(updatedDescription);
    await updateProfileButton.click();

    // Assert
    await expect(passwordConfirmationModal).toBeVisible();

    // Act
    await passwordConfirmationInput.fill(testPassword);
    await confirmButton.click();

    // Assert
    await expect(passwordConfirmationModal).toBeHidden();
    await expect(successAlert).toBeVisible();

    // Act
    await page.reload();

    // Assert
    await expect(emailInput).toHaveValue(updatedEmail);
    await expect(descriptionInput).toHaveValue(updatedDescription);
  });

  test('rejects email and description update after failed password confirmation', async ({ page }) => {
    // Arrange
    const updatedEmail = `updated.profile.${crypto.randomUUID()}@example.com`;
    const updatedDescription = 'Profile description update';
    const invalidPassword = `Invalid ${testPassword}`;
    const invalidPasswordErrorMessage = profileTranslations.update.confirmation.input.password.validation.invalid;
    const passwordConfirmationInputLabel = profileTranslations.update.confirmation.input.password.label;
    const confirmButtonLabel = profileTranslations.update.confirmation.button.default;

    const emailInput = page.getByRole('textbox', { name: emailInputLabel });
    const descriptionInput = page.getByRole('textbox', { name: descriptionInputLabel });
    const updateProfileButton = page.getByRole('button', { name: updateProfileButtonLabel });
    const passwordConfirmationModal = page.getByRole('dialog');
    const passwordConfirmationInput = passwordConfirmationModal.getByRole('textbox', {
      name: passwordConfirmationInputLabel
    });
    const confirmButton = passwordConfirmationModal.getByRole('button', { name: confirmButtonLabel, exact: true });
    const invalidPasswordError = page.getByText(invalidPasswordErrorMessage);

    const originalEmail = await emailInput.inputValue();
    const originalDescription = await descriptionInput.inputValue();

    // Act
    await emailInput.fill(updatedEmail);
    await descriptionInput.fill(updatedDescription);
    await updateProfileButton.click();

    // Assert
    await expect(passwordConfirmationModal).toBeVisible();

    // Act
    await passwordConfirmationInput.fill(invalidPassword);
    await confirmButton.click();

    // Assert
    await expect(invalidPasswordError).toBeVisible();

    // Act
    await page.reload();

    // Assert
    await expect(emailInput).toHaveValue(originalEmail);
    await expect(descriptionInput).toHaveValue(originalDescription);
  });

  test('rejects email and description update if the email is already in use', async ({ page }) => {
    // Arrange
    const testTakenEmail = 'helena.hills@social.com';
    const emailTakenErrorMessage = profileTranslations.update.input.email.validation.taken;
    const updatedDescription = 'Profile description update';
    const passwordConfirmationInputLabel = profileTranslations.update.confirmation.input.password.label;
    const confirmButtonLabel = profileTranslations.update.confirmation.button.default;

    const emailInput = page.getByRole('textbox', { name: emailInputLabel });
    const descriptionInput = page.getByRole('textbox', { name: descriptionInputLabel });
    const updateProfileButton = page.getByRole('button', { name: updateProfileButtonLabel });
    const passwordConfirmationModal = page.getByRole('dialog');
    const passwordConfirmationInput = passwordConfirmationModal.getByRole('textbox', {
      name: passwordConfirmationInputLabel
    });
    const confirmButton = passwordConfirmationModal.getByRole('button', { name: confirmButtonLabel, exact: true });
    const emailTakenError = page.getByText(emailTakenErrorMessage);

    const originalEmail = await emailInput.inputValue();
    const originalDescription = await descriptionInput.inputValue();

    // Act
    await emailInput.fill(testTakenEmail);
    await descriptionInput.fill(updatedDescription);
    await updateProfileButton.click();

    // Assert
    await expect(passwordConfirmationModal).toBeVisible();

    // Act
    await passwordConfirmationInput.fill(testPassword);
    await confirmButton.click();

    // Assert
    await expect(emailTakenError).toBeVisible();

    // Act
    await page.reload();

    // Assert
    await expect(emailInput).toHaveValue(originalEmail);
    await expect(descriptionInput).toHaveValue(originalDescription);
  });
});
