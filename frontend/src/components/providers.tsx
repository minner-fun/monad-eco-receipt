'use client';

import { ReactNode, useEffect, useState } from 'react';
import { WagmiProvider, type State } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';
import { wagmiConfig } from '@/lib/wagmi';
import { getAppKit } from '@/lib/appkit';
import { ThemeProvider, useTheme } from './theme-provider';

function AppKitThemeSync() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    const appKit = getAppKit();
    appKit.setThemeMode(resolvedTheme);
  }, [resolvedTheme]);
  return null;
}

export function Providers({
  children,
  locale,
  messages,
  initialWagmiState,
}: {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
  initialWagmiState?: State;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  useEffect(() => {
    getAppKit();
  }, []);

  return (
    <ThemeProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <WagmiProvider config={wagmiConfig} initialState={initialWagmiState}>
          <QueryClientProvider client={queryClient}>
            <AppKitThemeSync />
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
