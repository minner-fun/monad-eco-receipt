import { defineChain } from 'viem';
import { env } from './env';

export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: [env.NEXT_PUBLIC_MONAD_RPC_URL] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: env.NEXT_PUBLIC_MONAD_EXPLORER_URL },
  },
  testnet: true,
});

export const explorerTxUrl = (hash: string) =>
  `${env.NEXT_PUBLIC_MONAD_EXPLORER_URL}/tx/${hash}`;

export const explorerAddressUrl = (address: string) =>
  `${env.NEXT_PUBLIC_MONAD_EXPLORER_URL}/address/${address}`;
