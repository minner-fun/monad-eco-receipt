'use client';

import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { parseAbiItem, type PublicClient } from 'viem';
import {
  ecoReceiptNftAddress,
  DEPLOY_BLOCK,
} from '@/lib/contracts/eco-receipt-nft';
import { monadTestnet } from '@/config/chains';

const RECEIPT_MINTED = parseAbiItem(
  'event ReceiptMinted(uint256 indexed tokenId, address indexed creator, address indexed auditor, string productName, string brand, uint8 score, string grade, bytes32 reportHash, bytes32 evidenceMerkleRoot, string metadataURI)',
);
const TRANSFER = parseAbiItem(
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
);

const CHUNK_SIZE = 100n;
const RECENT_CHUNKS = 200n;
const MAX_CONCURRENCY = 5;

type GetLogsParams = Parameters<PublicClient['getLogs']>[0];

async function chunkedGetLogs<P extends GetLogsParams>(
  client: PublicClient,
  params: P,
  fromBlock: bigint,
  toBlock: bigint,
) {
  const ranges: Array<{ from: bigint; to: bigint }> = [];
  let cursor = toBlock;
  while (cursor >= fromBlock) {
    const from = cursor - CHUNK_SIZE + 1n;
    ranges.push({
      from: from < fromBlock ? fromBlock : from,
      to: cursor,
    });
    if (from <= fromBlock) break;
    cursor = from - 1n;
  }

  const results: Awaited<ReturnType<PublicClient['getLogs']>> = [];
  for (let i = 0; i < ranges.length; i += MAX_CONCURRENCY) {
    const slice = ranges.slice(i, i + MAX_CONCURRENCY);
    const settled = await Promise.all(
      slice.map(({ from, to }) =>
        client.getLogs({ ...params, fromBlock: from, toBlock: to } as P).catch(() => []),
      ),
    );
    settled.forEach((r) => results.push(...(r as never[])));
  }
  return results;
}

const CACHE_PREFIX = 'eco-receipt:owned:';

export function cachedTokenIds(address?: string): bigint[] {
  if (!address || typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + address.toLowerCase());
    if (!raw) return [];
    const arr = JSON.parse(raw) as string[];
    return arr.map((s) => BigInt(s));
  } catch {
    return [];
  }
}

export function addCachedTokenId(address: string, tokenId: bigint) {
  if (!address || typeof window === 'undefined') return;
  try {
    const existing = cachedTokenIds(address);
    const set = new Set(existing.map(String));
    set.add(tokenId.toString());
    localStorage.setItem(
      CACHE_PREFIX + address.toLowerCase(),
      JSON.stringify(Array.from(set)),
    );
  } catch {
    /* ignore */
  }
}

function saveCachedTokenIds(address: string, ids: bigint[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      CACHE_PREFIX + address.toLowerCase(),
      JSON.stringify(ids.map(String)),
    );
  } catch {
    /* ignore */
  }
}

export function useMyReceipts() {
  const { address } = useAccount();
  const client = usePublicClient({ chainId: monadTestnet.id });

  return useQuery({
    queryKey: ['my-receipts', address],
    enabled: !!address && !!client,
    placeholderData: () => cachedTokenIds(address),
    queryFn: async () => {
      if (!address || !client) return [] as bigint[];

      const latest = await client.getBlockNumber();
      const recentFrom = latest > CHUNK_SIZE * RECENT_CHUNKS
        ? latest - CHUNK_SIZE * RECENT_CHUNKS
        : DEPLOY_BLOCK;
      const fromBlock = recentFrom < DEPLOY_BLOCK ? DEPLOY_BLOCK : recentFrom;

      const [minted, transfersIn, transfersOut] = await Promise.all([
        chunkedGetLogs(
          client,
          {
            address: ecoReceiptNftAddress,
            event: RECEIPT_MINTED,
            args: { creator: address },
          },
          fromBlock,
          latest,
        ),
        chunkedGetLogs(
          client,
          {
            address: ecoReceiptNftAddress,
            event: TRANSFER,
            args: { to: address },
          },
          fromBlock,
          latest,
        ),
        chunkedGetLogs(
          client,
          {
            address: ecoReceiptNftAddress,
            event: TRANSFER,
            args: { from: address },
          },
          fromBlock,
          latest,
        ),
      ]);

      const owned = new Set<string>(cachedTokenIds(address).map(String));
      for (const log of minted) {
        const id = (log as unknown as { args: { tokenId?: bigint } }).args.tokenId;
        if (id !== undefined) owned.add(id.toString());
      }
      for (const log of transfersIn) {
        const id = (log as unknown as { args: { tokenId?: bigint } }).args.tokenId;
        if (id !== undefined) owned.add(id.toString());
      }
      for (const log of transfersOut) {
        const id = (log as unknown as { args: { tokenId?: bigint } }).args.tokenId;
        if (id !== undefined) owned.delete(id.toString());
      }

      const ids = Array.from(owned)
        .map((s) => BigInt(s))
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      saveCachedTokenIds(address, ids);
      return ids;
    },
  });
}
