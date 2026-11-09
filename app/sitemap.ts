import type { MetadataRoute } from 'next'
import { ROUTES } from '@/_app/routes';
import { getLocalizedPathname } from '@/features/language/model';
import { SUPPORTED_LANGUAGES } from '@/shared/i18n/i18nSettings';

export default function sitemap(): MetadataRoute.Sitemap {
  const appOriginUrl = process.env.APP_ORIGIN ?? 'http://localhost:3000';
  const indexedRoutes = [ROUTES.home, ROUTES.signIn, ROUTES.signUp];

  return indexedRoutes.map((indexedRoute) => {
    const baseRouteUrl = new URL(indexedRoute, appOriginUrl).href;

    const alternatesLanguages = Object.fromEntries(SUPPORTED_LANGUAGES.map(
      (language) => [language, new URL(getLocalizedPathname(language, indexedRoute), appOriginUrl).href]
    ));

    return {
      url: baseRouteUrl,
      alternates: {
        languages: alternatesLanguages,
      },
    };
  });
}
