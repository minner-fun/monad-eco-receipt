'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

const LABELS: Record<Locale, string> = {
  'zh-CN': '中文',
  en: 'English',
};

export function LocaleSwitcher() {
  const t = useTranslations('Locale');
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <div className="relative inline-flex items-center">
      <Globe className="absolute left-2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <select
        aria-label={t('label')}
        disabled={pending}
        value={currentLocale}
        onChange={(e) => {
          const nextLocale = e.target.value as Locale;
          startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
          });
        }}
        className="h-9 appearance-none rounded-md border border-border bg-card pl-8 pr-3 text-sm hover:bg-muted transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {routing.locales.map((locale) => (
          <option key={locale} value={locale}>
            {LABELS[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
