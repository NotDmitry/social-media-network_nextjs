import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react';

export default defineConfig({
  define: {
    'process.env': JSON.stringify({}),
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@/i18n.config': path.resolve(import.meta.dirname, 'i18n.config.ts'),
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    globalSetup: ['tests/globalSetup.ts'],
    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        optimizeDeps: {
          entries: ['src/**/*.test.tsx', 'app/**/*.test.tsx'],
          force: true,
          exclude: ['next/navigation'],
        },
        test: {
          name: 'browser',
          include: ['src/**/*.test.tsx', 'app/**/*.test.tsx'],
          setupFiles: ['src/test/browser.i18n.config.ts', 'src/test/browser.navigation.mock.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/types.ts',
        'src/**/*.d.ts',
        'src/test/**',
      ],
    }
  }
})
