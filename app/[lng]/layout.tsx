import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Inter, Poppins } from 'next/font/google';
import { I18nProvider } from 'next-i18next/client';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import AppInitializer from '@/_app/AppInitializer';
import QueryProvider from '@/_app/QueryProvider';
import StoreProvider from '@/_app/StoreProvider';
import { ThemeProvider } from '@mui/material/styles';
import { muiGlobalTheme } from '@/_app/muiThemeConfig';
import { getT, getResources, generateI18nStaticParams } from '@/shared/i18n/i18n.server';
import '@/_app/styles/globals.css';
import { isSupportedLanguage } from '@/features/language/model';
import { CURRENT_THEME_STORAGE_KEY } from '@/features/theme/model/store';
import { DEFAULT_LANGUAGE } from '@/shared/i18n/i18nSettings';
import DynamicAlertStack from './_components/DynamicAlertStack';
import Footer from './_components/Footer';
import HeaderVariantPicker from './_components/HeaderVariantPicker';
import SessionUnavailableGuard from './_components/SessionUnavailableGuard';
import './layout-style.css';

const ALERT_DURATION_MS = 5000;

const themeRestorationScriptBody = `(function () {
  try {
    const theme = localStorage.getItem('${CURRENT_THEME_STORAGE_KEY}');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch { }
})()`;

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600'],
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT('common');

  return {
    title: t(($) => $.meta.title),
    description: t(($) => $.meta.description),
    metadataBase: new URL(process.env.APP_ORIGIN ?? 'http://localhost:3000'),
  };
}

export async function generateStaticParams() {
  return generateI18nStaticParams();
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lng]'>) {
  const { lng } = await params;

  if (!isSupportedLanguage(lng)) {
    notFound();
  }

  const { i18n } = await getT();
  const resources = getResources(i18n, undefined, [lng, DEFAULT_LANGUAGE]);

  return (
    <html lang={lng} className={`${poppins.variable} ${inter.variable}`} data-theme='light' suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeRestorationScriptBody
          }}
        />
      </head>
      <body>
        <I18nProvider language={lng} resources={resources}>
          <QueryProvider>
            <StoreProvider>
              <AppInitializer />
              <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <ThemeProvider theme={muiGlobalTheme}>
                  <DynamicAlertStack duration={ALERT_DURATION_MS} />
                  <div className='layout-wrapper'>
                    <HeaderVariantPicker />
                    <main className='layout-main'>
                      <SessionUnavailableGuard>
                        {children}
                      </SessionUnavailableGuard>
                    </main>
                    <Footer />
                  </div>
                </ThemeProvider>
              </AppRouterCacheProvider>
            </StoreProvider>
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
