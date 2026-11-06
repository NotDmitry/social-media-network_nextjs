import type { ReactNode } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';
import { renderWithI18n } from './renderWithI18n';

export function renderWithI18nAndMuiStyles(ui: ReactNode) {
  return renderWithI18n(
    <StyledEngineProvider injectFirst>
      {ui}
    </StyledEngineProvider>
  );
}
