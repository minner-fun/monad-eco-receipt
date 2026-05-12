'use client';

import { useTranslations } from 'next-intl';
import { Leaf } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { ConnectButton } from './connect-button';
import { ThemeToggle } from './theme-toggle';
import { LocaleSwitcher } from './locale-switcher';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();

  const navItems = [
    { href: '/analyze', label: t('nav.analyze') },
    { href: '/my-receipts', label: t('nav.myReceipts') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Leaf className="h-5 w-5 text-brand" />
          <span>{t('title')}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  active
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          <div className="hidden sm:block">
            <ConnectButton />
          </div>
        </div>
      </div>
      <div className="flex md:hidden border-t border-border px-4 py-2 gap-2 overflow-x-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors',
                active
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <div className="ml-auto sm:hidden">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
