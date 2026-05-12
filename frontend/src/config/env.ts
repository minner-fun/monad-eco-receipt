import { z } from 'zod';

const Env = z.object({
  NEXT_PUBLIC_REOWN_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_BACKEND_URL: z.string().url(),
  NEXT_PUBLIC_CONTRACT_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Must be a 0x-prefixed 40-hex address'),
  NEXT_PUBLIC_CHAIN_ID: z.coerce.number().int().positive(),
  NEXT_PUBLIC_MONAD_RPC_URL: z.string().url(),
  NEXT_PUBLIC_MONAD_EXPLORER_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export const env = Env.parse({
  NEXT_PUBLIC_REOWN_PROJECT_ID: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
  NEXT_PUBLIC_MONAD_RPC_URL: process.env.NEXT_PUBLIC_MONAD_RPC_URL,
  NEXT_PUBLIC_MONAD_EXPLORER_URL: process.env.NEXT_PUBLIC_MONAD_EXPLORER_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (env.NEXT_PUBLIC_REOWN_PROJECT_ID === 'replace-me' && process.env.NODE_ENV !== 'production') {
  console.warn(
    '[env] NEXT_PUBLIC_REOWN_PROJECT_ID is still "replace-me". Register at https://cloud.reown.com and set it in .env.local.',
  );
}
