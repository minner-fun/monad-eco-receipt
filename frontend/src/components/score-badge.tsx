import { cn } from '@/lib/utils';

function scoreColor(score: number) {
  if (score >= 75) return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/30';
  if (score >= 50) return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/30';
  return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-rose-500/30';
}

export function ScoreBadge({ score, label }: { score: number; label: string }) {
  return (
    <div
      className={cn(
        'inline-flex flex-col items-center justify-center rounded-2xl px-6 py-4 ring-1',
        scoreColor(score),
      )}
    >
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-4xl font-bold leading-none mt-1">{score}</div>
      <div className="text-xs opacity-60 mt-0.5">/ 100</div>
    </div>
  );
}
