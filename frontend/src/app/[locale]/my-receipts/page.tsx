'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAccount, useReadContracts } from 'wagmi';
import { Loader2, Receipt, Wallet } from 'lucide-react';
import { useMyReceipts } from '@/hooks/use-my-receipts';
import { ecoReceiptNftAbi, ecoReceiptNftAddress } from '@/lib/contracts/eco-receipt-nft';
import { monadTestnet } from '@/config/chains';
import { Link } from '@/i18n/navigation';
import { GradePill } from '@/components/grade-pill';

type Receipt = {
  tokenId: bigint;
  productName: string;
  brand: string;
  score: number;
  grade: string;
};

export default function MyReceiptsPage() {
  const t = useTranslations('MyReceipts');
  const { address, isConnected } = useAccount();
  const tokenIdsQ = useMyReceipts();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const tokenIds = (tokenIdsQ.data ?? []) as bigint[];
  const receiptsQ = useReadContracts({
    contracts: tokenIds.map((id) => ({
      address: ecoReceiptNftAddress,
      abi: ecoReceiptNftAbi,
      functionName: 'getReceipt' as const,
      args: [id] as const,
      chainId: monadTestnet.id,
    })),
    query: { enabled: tokenIds.length > 0 },
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-10 md:py-14 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </header>

      {!mounted ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('scanning')}
        </div>
      ) : !isConnected || !address ? (
        <EmptyState icon={Wallet} label={t('connectFirst')} />
      ) : tokenIdsQ.isPending ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('scanning')}
        </div>
      ) : tokenIds.length === 0 ? (
        <EmptyState icon={Receipt} label={t('empty')} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tokenIds.map((id, idx) => {
            const r = receiptsQ.data?.[idx];
            const data = r && r.status === 'success' ? (r.result as Receipt) : null;
            return (
              <li key={String(id)}>
                <Link
                  href={`/receipts/${String(id)}`}
                  className="block rounded-lg border border-border bg-card p-4 hover:border-brand/50 hover:bg-muted/40 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">#{String(id)}</span>
                    {data && <GradePill grade={data.grade} />}
                  </div>
                  <h3 className="font-medium leading-snug line-clamp-2">
                    {data?.productName ?? '—'}
                  </h3>
                  {data?.brand && (
                    <p className="text-xs text-muted-foreground">{data.brand}</p>
                  )}
                  {data && (
                    <p className="text-xs text-muted-foreground">
                      Score: <span className="font-medium text-foreground">{data.score}</span> / 100
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {tokenIdsQ.error && (
        <p className="text-xs text-destructive">{(tokenIdsQ.error as Error).message}</p>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, label }: { icon: typeof Receipt; label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-10 flex flex-col items-center justify-center gap-3 text-center">
      <Icon className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
