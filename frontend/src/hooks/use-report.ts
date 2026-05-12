'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchReport } from '@/lib/api/receipts';

export function useReport(reportHash?: `0x${string}`) {
  return useQuery({
    queryKey: ['report', reportHash],
    queryFn: () => fetchReport(reportHash!),
    enabled: Boolean(reportHash),
  });
}
