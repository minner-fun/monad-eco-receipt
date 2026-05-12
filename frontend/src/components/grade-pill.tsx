import { cn } from '@/lib/utils';

function gradeColor(grade: string) {
  const upper = grade.toUpperCase();
  if (upper.startsWith('A') || upper.includes('LOW RISK'))
    return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-500/30';
  if (upper.startsWith('B') || upper.includes('MEDIUM'))
    return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-amber-500/30';
  if (upper.startsWith('C') || upper.startsWith('D') || upper.includes('HIGH'))
    return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-rose-500/30';
  return 'bg-muted text-muted-foreground ring-border';
}

export function GradePill({ grade }: { grade: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1',
        gradeColor(grade),
      )}
    >
      {grade}
    </span>
  );
}
