import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { cookieToInitialState } from 'wagmi';
import { wagmiConfig } from '@/lib/wagmi';
import { routing } from '@/i18n/routing';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const requestHeaders = await headers();
  const initialWagmiState = cookieToInitialState(
    wagmiConfig,
    requestHeaders.get('cookie') ?? undefined,
  );

  return (
    <Providers locale={locale} messages={messages} initialWagmiState={initialWagmiState}>
      <Header />
      <main className="flex-1 flex flex-col" lang={locale}>
        {children}
      </main>
    </Providers>
  );
}
