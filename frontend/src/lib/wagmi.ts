import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { cookieStorage, createStorage } from 'wagmi';
import type { CreateConfigParameters } from 'wagmi';
import { env } from '@/config/env';
import { monadTestnet } from '@/config/chains';

const storage = createStorage({ storage: cookieStorage }) as NonNullable<
  CreateConfigParameters['storage']
>;

export const wagmiAdapter = new WagmiAdapter({
  projectId: env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  networks: [monadTestnet],
  ssr: true,
  storage,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
