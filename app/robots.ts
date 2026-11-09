import type { MetadataRoute } from 'next';
import { ROUTES } from '@/_app/routes';
import { getLocalizedPathname } from '@/features/language/model';
import { SUPPORTED_LANGUAGES } from '@/shared/i18n/i18nSettings';

export default function robots(): MetadataRoute.Robots {
  const appOriginUrl = process.env.APP_ORIGIN ?? 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api',
        ROUTES.profile,
        ...SUPPORTED_LANGUAGES.map((language) => getLocalizedPathname(language, ROUTES.profile)),
      ],
    },
    sitemap: new URL('/sitemap.xml', appOriginUrl).href,
  }
}
