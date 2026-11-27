import { afterEach, describe, expect, test, vi } from 'vitest';
import i18next from 'i18next';
import { usePathname, useRouter } from 'next/navigation';
import { renderWithI18nAndMuiStyles as render } from '@/test/renderWithI18nAndMuiStyles';
import LanguageSwitcher from './index';

describe('LanguageSwitcher', () => {
  const languageSelectLabelText = i18next.t(($) => $.languages.label);
  const russianLanguageOptionText = i18next.t(($) => $.languages.ru);

  const mockRouterPush = vi.fn();

  afterEach(() => {
    mockRouterPush.mockClear();
    vi.mocked(useRouter).mockReset();
    vi.mocked(usePathname).mockReturnValue('/en');
    document.cookie = 'i18next=; Path=/; Max-Age=0';
  });

  test('redirect to the new locale path after saving changed language in cookie', async () => {
    // Arrange
    vi.mocked(usePathname).mockReturnValue('/en/profile');
    vi.mocked(useRouter, { partial: true }).mockReturnValue({ push: mockRouterPush });
    const screen = await render(<LanguageSwitcher />);
    const languageSelect = screen.getByRole('combobox', { name: languageSelectLabelText });
    const russianLanguageOption = screen.getByRole('option', { name: russianLanguageOptionText });

    // Act
    await languageSelect.click();
    await russianLanguageOption.click();

    // Assert
    expect(mockRouterPush).toHaveBeenCalledExactlyOnceWith('/ru/profile');
    expect(document.cookie).toContain('i18next=ru');
  });
});
