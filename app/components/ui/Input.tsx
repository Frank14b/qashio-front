'use client';

import { TextField, type TextFieldProps } from '@mui/material';

export type InputProps = Omit<TextFieldProps, 'variant'> & {
  variant?: TextFieldProps['variant'];
};

export function Input({
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  ...props
}: InputProps) {
  return <TextField fullWidth={fullWidth} size={size} variant={variant} {...props} />;
}
