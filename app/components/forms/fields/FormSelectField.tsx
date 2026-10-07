'use client';

import { Select, type SelectOption, type SelectProps } from '@/app/components/ui';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

type FormSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  options: SelectOption[];
} & Omit<
  SelectProps,
  | 'name'
  | 'label'
  | 'options'
  | 'value'
  | 'onChange'
  | 'onBlur'
  | 'error'
  | 'helperText'
  | 'defaultValue'
>;

export function FormSelectField<T extends FieldValues>({
  name,
  label,
  options,
  ...props
}: FormSelectProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Select
          {...field}
          {...props}
          label={label}
          options={options}
          value={field.value ?? ''}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
