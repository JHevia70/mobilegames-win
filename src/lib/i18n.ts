import { getRequestConfig } from 'next-intl/server';

export const locales = ['es', 'en'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../../locales/${locale}/common.json`)).default,
}));