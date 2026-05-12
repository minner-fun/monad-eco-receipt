'use client';

import { useTranslations } from 'next-intl';
import { ScoreBadge } from './score-badge';
import { GradePill } from './grade-pill';
import { EvidenceList } from './evidence-list';
import { OnChainProof } from './on-chain-proof';
import type { AnalyzeResponse, FullReport } from '@/lib/api/schemas';

type ReportData =
  | AnalyzeResponse
  | (FullReport & {
      reportHash: `0x${string}`;
      evidenceMerkleRoot: `0x${string}`;
      reportURI?: string;
      metadataURI?: string;
    });

export function ReportView({ report }: { report: ReportData }) {
  const t = useTranslations('Report');

  const hasFullReportFields = 'positiveSignals' in report;
  const full = hasFullReportFields ? (report as FullReport) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <ScoreBadge score={report.score} label={t('score')} />
        <div className="flex-1 space-y-3">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">{report.productName}</h2>
            {report.brand && (
              <p className="text-sm text-muted-foreground mt-1">{report.brand}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {t('grade')}
            </span>
            <GradePill grade={report.grade} />
          </div>
          {report.summary && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                {t('summary')}
              </h3>
              <p className="text-sm leading-relaxed">{report.summary}</p>
            </div>
          )}
        </div>
      </div>

      {full?.positiveSignals && full.positiveSignals.length > 0 && (
        <Section title={t('positiveSignals')}>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {full.positiveSignals.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Section>
      )}

      {full?.riskSignals && full.riskSignals.length > 0 && (
        <Section title={t('riskSignals')}>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {full.riskSignals.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Section>
      )}

      {report.findings.length > 0 && (
        <Section title={t('findings')}>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {report.findings.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Section>
      )}

      {full?.greenwashingRisk && (
        <Section title={t('greenwashingRisk')}>
          <p className="text-sm">{full.greenwashingRisk}</p>
        </Section>
      )}

      <Section title={t('evidences')}>
        <EvidenceList items={report.evidences} />
      </Section>

      {full?.alternatives && full.alternatives.length > 0 && (
        <Section title={t('alternatives')}>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {full.alternatives.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Section>
      )}

      <OnChainProof
        reportHash={report.reportHash}
        evidenceMerkleRoot={report.evidenceMerkleRoot}
        reportURI={report.reportURI}
        metadataURI={report.metadataURI}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}
