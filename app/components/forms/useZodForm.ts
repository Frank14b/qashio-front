'use client';

import { useForm, type DefaultValues, type FieldValues, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

interface UseZodFormOptions<TValues extends FieldValues> {
  schema: ZodType<TValues>;
  defaultValues?: DefaultValues<TValues>;
}

export function useZodForm<TValues extends FieldValues>({
  schema,
  defaultValues,
}: UseZodFormOptions<TValues>) {
  return useForm<TValues>({
    // Zod 4 coerce schemas use `unknown` input; cast keeps RHF output typing intact.
    resolver: zodResolver(schema as never) as Resolver<TValues>,
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
}
