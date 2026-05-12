'use client';

import { createAppKit } from '@reown/appkit/react';
import { env } from '@/config/env';
import { monadTestnet } from '@/config/chains';
import { site } from '@/config/site';
import { wagmiAdapter } from './wagmi';

let appKitInstance: ReturnType<typeof createAppKit> | null = null;

export function getAppKit() {
  if (appKitInstance) return appKitInstance;

  appKitInstance = createAppKit({
    adapters: [wagmiAdapter],
    networks: [monadTestnet],
    defaultNetwork: monadTestnet,
    projectId: env.NEXT_PUBLIC_REOWN_PROJECT_ID,
    metadata: {
      name: site.name,
      description: site.description,
      url: env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
      icons: [`${env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/favicon.ico`],
    },
    themeMode: 'light',
  });

  return appKitInstance;
}
