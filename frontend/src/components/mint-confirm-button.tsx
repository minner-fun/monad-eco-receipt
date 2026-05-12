'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';
import { Loader2, Sparkles, X } from 'lucide-react';
import type { AnalyzeResponse, MintResponse } from '@/lib/api/schemas';
import { useMint } from '@/hooks/use-mint';
import { TxStatus } from './tx-status';
import { formatAddress } from '@/lib/utils';

export function MintConfirmButton({ report }: { report: AnalyzeResponse }) {
  const t = useTranslations('Mint');
  const tCommon = useTranslations('Common');
  const { address, isConnected } = useAccount();
  const mint = useMint();
  const [open, setOpen] = useState(false);

  const onMint = () => {
    if (!address) return;
    mint.mutate({
      to: address as `0x${string}`,
      productName: report.productName,
      brand: report.brand ?? '',
      score: report.score,
      grade: report.grade,
      reportHash: report.reportHash as `0x${string}`,
      evidenceMerkleRoot: report.evidenceMerkleRoot as `0x${string}`,
      metadataURI: report.metadataURI,
    });
  };

  if (mint.data) {
    return <TxStatus result={mint.data as MintResponse} />;
  }

  return (
    <>
      <button
        type="button"
        disabled={!isConnected}
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 h-11 rounded-md bg-brand px-6 text-sm font-medium text-brand-foreground hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
      >
        <Sparkles className="h-4 w-4" />
        {isConnected ? t('cta') : t('ctaConnectFirst')}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !mint.isPending && setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">{t('dialogTitle')}</h3>
              {!mint.isPending && (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="close"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{t('dialogDesc')}</p>
            <div className="rounded-md border border-border bg-muted/40 p-3 space-y-2 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">{t('to')}</span>
                <span className="font-mono">{formatAddress(address)}</span>
              </div>
            </div>

            {mint.error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded p-2">
                {(mint.error as Error).message}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={mint.isPending}
                onClick={() => setOpen(false)}
                className="h-9 rounded-md border border-border px-4 text-sm hover:bg-muted disabled:opacity-60"
              >
                {tCommon('cancel')}
              </button>
              <button
                type="button"
                onClick={onMint}
                disabled={mint.isPending || !address}
                className="inline-flex items-center gap-2 h-9 rounded-md bg-brand px-4 text-sm font-medium text-brand-foreground hover:opacity-90 disabled:opacity-60"
              >
                {mint.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {mint.isPending ? t('submitting') : t('cta')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
