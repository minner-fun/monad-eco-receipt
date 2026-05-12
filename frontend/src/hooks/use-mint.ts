'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { mintReceipt } from '@/lib/api/receipts';
import { addCachedTokenId } from './use-my-receipts';

export const useMint = () => {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mintReceipt,
    onSuccess: (data) => {
      if (address) {
        addCachedTokenId(address, data.tokenId);
        queryClient.invalidateQueries({ queryKey: ['my-receipts', address] });
      }
    },
  });
};
