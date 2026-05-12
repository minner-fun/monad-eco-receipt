import { useTranslations } from 'next-intl';
import { Sparkles, Leaf, ShieldCheck, Wallet } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function Home() {
  const t = useTranslations('Landing');

  const features = [
    { key: 'ai', Icon: Sparkles },
    { key: 'onchain', Icon: ShieldCheck },
    { key: 'wallet', Icon: Wallet },
  ] as const;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-16 md:py-24">
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Leaf className="h-3.5 w-3.5 text-brand" />
          <span>Monad Testnet · EcoReceiptNFT</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          {t('heroTitle')}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {t('heroSubtitle')}
        </p>
        <div className="pt-2">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 h-11 rounded-md bg-brand px-6 text-sm font-medium text-brand-foreground hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" />
            {t('cta')}
          </Link>
        </div>
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-3">
        {features.map(({ key, Icon }) => (
          <div
            key={key}
            className="rounded-lg border border-border bg-card p-6 space-y-3"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand/10 text-brand">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">{t(`features.${key}.title`)}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(`features.${key}.desc`)}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
