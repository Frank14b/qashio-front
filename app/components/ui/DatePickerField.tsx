'use client';

import { DatePicker, type DatePickerProps } from '@mui/x-date-pickers/DatePicker';

export type DatePickerFieldProps = DatePickerProps & {
  error?: boolean;
  helperText?: string;
};

export function DatePickerField({
  error = false,
  helperText,
  slotProps,
  ...props
}: DatePickerFieldProps) {
  return (
    <DatePicker
      {...props}
      slotProps={{
        ...slotProps,
        textField: {
          fullWidth: true,
          error,
          helperText,
          ...(slotProps?.textField && typeof slotProps.textField === 'object'
            ? slotProps.textField
            : {}),
        },
      }}
    />
  );
}
