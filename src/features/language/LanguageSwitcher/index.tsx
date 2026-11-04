'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useT } from 'next-i18next/client';
import { useId } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/shared/i18n/i18nSettings';
import { useCurrentLanguage } from '../useCurrentLanguage';
import './style.css';

const COOKIE_MAX_AGE = 31536000;

function LanguageSwitcher() {
  const { t } = useT('common');
  const currentLanguage = useCurrentLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const label = t(($) => $.languages.label);
  const labelId = useId();
  const selectId = useId();

  function handleLanguageChange(event: SelectChangeEvent<SupportedLanguage>) {
    const selectedLanguage = event.target.value;

    const segments = pathname.split('/');
    segments[1] = selectedLanguage;

    document.cookie = `i18next=${selectedLanguage}; path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    router.push(segments.join('/'));
  }

  return (
    <FormControl className='language-switcher' size='medium'>
      <InputLabel className='language-switcher-label' id={labelId}>
        {label}
      </InputLabel>
      <Select
        className='language-switcher-select'
        id={selectId}
        label={label}
        labelId={labelId}
        value={currentLanguage}
        onChange={handleLanguageChange}
        slotProps={{
          notchedOutline: {
            className: 'language-switcher-outline',
          }
        }}
        MenuProps={{
          slotProps: {
            paper: {
              className: 'language-switcher-menu',
            },
          },
        }}
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <MenuItem className='language-switcher-option' key={language} value={language}>
            {t(($) => $.languages[language])}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default LanguageSwitcher;
