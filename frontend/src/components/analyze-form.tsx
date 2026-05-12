'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import type { AnalyzeRequest } from '@/lib/api/schemas';

const FormSchema = z.object({
  productName: z.string().min(1),
  brand: z.string().optional(),
  productUrl: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export function AnalyzeForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (data: AnalyzeRequest) => void;
  isSubmitting: boolean;
}) {
  const t = useTranslations('Analyze');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { productName: '', brand: '', productUrl: '' },
  });

  return (
    <form
      onSubmit={handleSubmit((v) =>
        onSubmit({
          productName: v.productName.trim(),
          brand: v.brand?.trim() || undefined,
          productUrl: v.productUrl?.trim() || undefined,
        }),
      )}
      className="space-y-4"
    >
      <Field
        label={t('form.productName')}
        error={errors.productName ? t('errors.productNameRequired') : undefined}
        required
      >
        <input
          type="text"
          placeholder={t('form.productNamePlaceholder')}
          className="w-full h-10 rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          {...register('productName')}
        />
      </Field>

      <Field label={t('form.brand')}>
        <input
          type="text"
          placeholder={t('form.brandPlaceholder')}
          className="w-full h-10 rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          {...register('brand')}
        />
      </Field>

      <Field label={t('form.productUrl')}>
        <input
          type="url"
          placeholder={t('form.productUrlPlaceholder')}
          className="w-full h-10 rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          {...register('productUrl')}
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 h-10 rounded-md bg-brand px-5 text-sm font-medium text-brand-foreground hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? t('form.submitting') : t('form.submit')}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </span>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}
