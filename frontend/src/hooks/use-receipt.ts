'use client';

import { useReadContract } from 'wagmi';
import { ecoReceiptNftAbi, ecoReceiptNftAddress } from '@/lib/contracts/eco-receipt-nft';
import { monadTestnet } from '@/config/chains';

export function useReceipt(tokenId?: bigint) {
  return useReadContract({
    address: ecoReceiptNftAddress,
    abi: ecoReceiptNftAbi,
    functionName: 'getReceipt',
    args: tokenId !== undefined ? [tokenId] : undefined,
    chainId: monadTestnet.id,
    query: { enabled: tokenId !== undefined },
  });
}

export function useReceiptOwner(tokenId?: bigint) {
  return useReadContract({
    address: ecoReceiptNftAddress,
    abi: ecoReceiptNftAbi,
    functionName: 'ownerOf',
    args: tokenId !== undefined ? [tokenId] : undefined,
    chainId: monadTestnet.id,
    query: { enabled: tokenId !== undefined },
  });
}

export function useReceiptExists(tokenId?: bigint) {
  return useReadContract({
    address: ecoReceiptNftAddress,
    abi: ecoReceiptNftAbi,
    functionName: 'exists',
    args: tokenId !== undefined ? [tokenId] : undefined,
    chainId: monadTestnet.id,
    query: { enabled: tokenId !== undefined },
  });
}
