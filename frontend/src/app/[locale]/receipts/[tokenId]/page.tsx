'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useReceipt, useReceiptOwner } from '@/hooks/use-receipt';
import { useReport } from '@/hooks/use-report';
import { ReportView } from '@/components/report-view';
import { explorerAddressUrl } from '@/config/chains';
import { formatAddress } from '@/lib/utils';
import { ecoReceiptNftAddress } from '@/lib/contracts/eco-receipt-nft';

type Receipt = {
  tokenId: bigint;
  productName: string;
  brand: string;
  score: number;
  grade: string;
  reportHash: `0x${string}`;
  evidenceMerkleRoot: `0x${string}`;
  metadataURI: string;
  timestamp: bigint;
  creator: `0x${string}`;
  auditor: `0x${string}`;
};

export default function ReceiptDetailPage() {
  const params = useParams<{ tokenId: string }>();
  const tokenIdStr = params.tokenId;
  let tokenId: bigint | undefined;
  try {
    tokenId = tokenIdStr ? BigInt(tokenIdStr) : undefined;
  } catch {
    tokenId = undefined;
  }

  const t = useTranslations('Receipt');
  const tReport = useTranslations('Report');

  const receiptQ = useReceipt(tokenId);
  const ownerQ = useReceiptOwner(tokenId);
  const onChain = receiptQ.data as Receipt | undefined;
  const reportQ = useReport(onChain?.reportHash);

  if (!tokenId) {
    return (
      <Centered>
        <h2 className="text-lg font-semibold">{t('notFound')}</h2>
      </Centered>
    );
  }

  if (receiptQ.isPending) {
    return (
      <Centered>
        <Loader2 className="h-5 w-5 animate-spin" />
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      </Centered>
    );
  }

  if (receiptQ.error || !onChain) {
    return (
      <Centered>
        <h2 className="text-lg font-semibold">{t('notFound')}</h2>
        <p className="text-sm text-muted-foreground max-w-sm">{t('notFoundDesc')}</p>
      </Centered>
    );
  }

  const mintedAt = new Date(Number(onChain.timestamp) * 1000).toLocaleString();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-10 md:py-14 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('title', { tokenId: String(tokenId) })}
        </h1>
        <dl className="text-xs grid grid-cols-[6rem_1fr] gap-x-3 gap-y-1 text-muted-foreground">
          <dt>{t('creator')}</dt>
          <dd className="font-mono break-all">
            <a
              href={explorerAddressUrl(onChain.creator)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              {formatAddress(onChain.creator)}
              <ExternalLink className="h-3 w-3" />
            </a>
          </dd>
          <dt>{t('auditor')}</dt>
          <dd className="font-mono break-all">{formatAddress(onChain.auditor)}</dd>
          <dt>{t('mintedAt')}</dt>
          <dd>{mintedAt}</dd>
          {ownerQ.data && (
            <>
              <dt>Owner</dt>
              <dd className="font-mono break-all">{formatAddress(ownerQ.data as string)}</dd>
            </>
          )}
          <dt>Contract</dt>
          <dd className="font-mono break-all">{formatAddress(ecoReceiptNftAddress)}</dd>
        </dl>
      </header>

      <ReportView
        report={
          reportQ.data
            ? {
                ...reportQ.data.report,
                reportHash: reportQ.data.reportHash as `0x${string}`,
                evidenceMerkleRoot: onChain.evidenceMerkleRoot,
                reportURI: reportQ.data.reportURI,
                metadataURI: onChain.metadataURI,
              }
            : {
                productName: onChain.productName,
                brand: onChain.brand,
                score: onChain.score,
                grade: onChain.grade,
                summary: '',
                findings: [],
                evidences: [],
                reportHash: onChain.reportHash,
                evidenceMerkleRoot: onChain.evidenceMerkleRoot,
                reportURI: '',
                metadataURI: onChain.metadataURI,
              }
        }
      />

      {reportQ.error && (
        <p className="text-xs text-muted-foreground italic">
          {t('fetchReportFailed')}: {(reportQ.error as Error).message}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        <a
          href={explorerAddressUrl(ecoReceiptNftAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:underline"
        >
          {tReport('onChainProof')} on Monad Explorer
          <ExternalLink className="h-3 w-3" />
        </a>
      </p>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-2 py-24 text-center">
      {children}
    </div>
  );
}
