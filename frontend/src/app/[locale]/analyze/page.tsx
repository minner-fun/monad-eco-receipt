'use client';

import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';
import { AnalyzeForm } from '@/components/analyze-form';
import { ReportView } from '@/components/report-view';
import { MintConfirmButton } from '@/components/mint-confirm-button';
import { useAnalyze } from '@/hooks/use-analyze';

export default function AnalyzePage() {
  const t = useTranslations('Analyze');
  const tErrors = useTranslations('Errors');
  const analyze = useAnalyze();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-10 md:py-14 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </header>

      {!analyze.data ? (
        <AnalyzeForm
          onSubmit={(values) => analyze.mutate(values)}
          isSubmitting={analyze.isPending}
        />
      ) : (
        <>
          <ReportView report={analyze.data} />
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <MintConfirmButton report={analyze.data} />
            <button
              type="button"
              onClick={() => analyze.reset()}
              className="inline-flex items-center gap-1.5 h-10 rounded-md border border-border bg-card px-4 text-sm hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" />
              {t('reset')}
            </button>
          </div>
        </>
      )}

      {analyze.error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">
          {tErrors('apiError', { message: (analyze.error as Error).message })}
        </div>
      )}
    </div>
  );
}
