'use client';

import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import type { Evidence } from '@/lib/api/schemas';
import { cn } from '@/lib/utils';

function confidenceColor(c: Evidence['confidence']) {
  switch (c) {
    case 'High':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
    case 'Medium':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    case 'Low':
      return 'bg-rose-500/15 text-rose-700 dark:text-rose-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function EvidenceList({ items }: { items: Evidence[] }) {
  const t = useTranslations('Report');

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">{t('noEvidences')}</p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((e, idx) => (
        <li
          key={e.hash + idx}
          className="rounded-lg border border-border bg-card/40 p-4 space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium leading-snug">{e.title}</h4>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shrink-0',
                confidenceColor(e.confidence),
              )}
            >
              {t(`confidence.${e.confidence}`)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{t('evidenceSource')}:</span> {e.source}
          </div>
          {e.claim && (
            <p className="text-sm">
              <span className="text-muted-foreground">{t('evidenceClaim')}: </span>
              {e.claim}
            </p>
          )}
          {e.excerpt && (
            <blockquote className="border-l-2 border-border pl-3 text-sm text-muted-foreground italic">
              {e.excerpt}
            </blockquote>
          )}
          {e.url && (
            <a
              href={e.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              {e.url}
            </a>
          )}
          <div className="text-[10px] font-mono text-muted-foreground/70 break-all">
            {e.hash}
          </div>
        </li>
      ))}
    </ul>
  );
}
