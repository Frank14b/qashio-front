'use client';

import { Box, Stack, type BoxProps, type StackProps } from '@mui/material';
import { FormProvider, type FieldValues, type UseFormReturn } from 'react-hook-form';
import type { FormEventHandler, ReactNode } from 'react';

export interface FormProps<T extends FieldValues> extends Omit<BoxProps<'form'>, 'onSubmit'> {
  form: UseFormReturn<T>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  maxWidth?: number | string;
  spacing?: StackProps['spacing'];
}

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  maxWidth = 480,
  spacing = 2.5,
  ...props
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <Box component="form" onSubmit={onSubmit} noValidate {...props}>
        <Stack spacing={spacing} maxWidth={maxWidth}>
          {children}
        </Stack>
      </Box>
    </FormProvider>
  );
}
