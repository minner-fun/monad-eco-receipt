'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-2 text-xs">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono break-all">{value}</dd>
    </div>
  );
}

export function OnChainProof({
  reportHash,
  evidenceMerkleRoot,
  reportURI,
  metadataURI,
}: {
  reportHash: string;
  evidenceMerkleRoot: string;
  reportURI?: string;
  metadataURI?: string;
}) {
  const t = useTranslations('Report');

  return (
    <section className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-brand" />
        <h3 className="text-sm font-semibold">{t('onChainProof')}</h3>
      </div>
      <dl className="space-y-1.5">
        <Row label={t('reportHash')} value={reportHash} />
        <Row label={t('evidenceMerkleRoot')} value={evidenceMerkleRoot} />
        <Row label={t('reportURI')} value={reportURI} />
        <Row label={t('metadataURI')} value={metadataURI} />
      </dl>
    </section>
  );
}
