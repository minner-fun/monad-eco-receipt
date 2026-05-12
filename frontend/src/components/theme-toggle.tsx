'use client';

import { useTranslations } from 'next-intl';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { useTheme } from './theme-provider';

const ORDER = ['light', 'dark', 'system'] as const;
type ThemeOption = (typeof ORDER)[number];

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const t = useTranslations('Theme');
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const current = (theme ?? 'system') as ThemeOption;
  const Icon = !mounted
    ? Monitor
    : current === 'light'
      ? Sun
      : current === 'dark'
        ? Moon
        : Monitor;

  return (
    <div className="relative inline-flex items-center">
      <Icon
        className="absolute left-2 h-4 w-4 text-muted-foreground pointer-events-none"
      />
      <select
        aria-label={t('label')}
        value={current}
        onChange={(e) => setTheme(e.target.value as ThemeOption)}
        className="h-9 appearance-none rounded-md border border-border bg-card pl-8 pr-3 text-sm hover:bg-muted transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="light">{t('light')}</option>
        <option value="dark">{t('dark')}</option>
        <option value="system">{t('system')}</option>
      </select>
    </div>
  );
}
