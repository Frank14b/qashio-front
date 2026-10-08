'use client';

import { Input, type InputProps } from '@/app/components/ui';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

type FormInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
} & Omit<InputProps, 'name' | 'label' | 'value' | 'onChange' | 'onBlur' | 'error' | 'helperText'>;

export function FormInput<T extends FieldValues>({ name, label, ...props }: FormInputProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          {...props}
          value={field.value ?? ''}
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
