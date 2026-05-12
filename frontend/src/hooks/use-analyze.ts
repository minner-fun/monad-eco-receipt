'use client';

import { useMutation } from '@tanstack/react-query';
import { analyzeReceipt } from '@/lib/api/receipts';

export const useAnalyze = () =>
  useMutation({
    mutationFn: analyzeReceipt,
  });
