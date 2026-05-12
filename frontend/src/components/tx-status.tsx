'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2, ExternalLink, Receipt } from 'lucide-react';
import type { MintResponse } from '@/lib/api/schemas';
import { Link } from '@/i18n/navigation';
import { explorerTxUrl } from '@/config/chains';
import { formatAddress, formatHash } from '@/lib/utils';

export function TxStatus({ result }: { result: MintResponse }) {
  const t = useTranslations('Mint');
  const tCommon = useTranslations('Common');

  return (
    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-3">
      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
        <CheckCircle2 className="h-5 w-5" />
        <h3 className="text-base font-semibold">{t('success')}</h3>
      </div>
      <p className="text-sm">{t('successDesc')}</p>
      <dl className="grid grid-cols-[8rem_1fr] gap-y-1.5 gap-x-3 text-xs">
        <dt className="text-muted-foreground">{t('tokenId')}</dt>
        <dd className="font-mono">{String(result.tokenId)}</dd>
        <dt className="text-muted-foreground">{t('transactionHash')}</dt>
        <dd className="font-mono">{formatHash(result.transactionHash)}</dd>
        <dt className="text-muted-foreground">{t('contract')}</dt>
        <dd className="font-mono">{formatAddress(result.contractAddress)}</dd>
      </dl>
      <div className="flex flex-wrap gap-2 pt-1">
        <a
          href={explorerTxUrl(result.transactionHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 h-9 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted"
        >
          <ExternalLink className="h-4 w-4" />
          {tCommon('viewOnExplorer')}
        </a>
        <Link
          href={`/receipts/${String(result.tokenId)}`}
          className="inline-flex items-center gap-1 h-9 rounded-md bg-brand px-3 text-sm font-medium text-brand-foreground hover:opacity-90"
        >
          <Receipt className="h-4 w-4" />
          {tCommon('viewReceipt')}
        </Link>
      </div>
    </div>
  );
}
