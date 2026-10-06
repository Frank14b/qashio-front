'use client';

import { DatePickerField, type DatePickerFieldProps } from '@/app/components/ui';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

type FormDatePickerProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
} & Omit<
  DatePickerFieldProps,
  'name' | 'label' | 'value' | 'onChange' | 'error' | 'helperText' | 'defaultValue'
>;

export function FormDatePickerField<T extends FieldValues>({
  name,
  label,
  ...props
}: FormDatePickerProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <DatePickerField
          {...props}
          label={label}
          value={field.value ?? null}
          onChange={field.onChange}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
