'use client';

import { Button, type ButtonProps } from '@mui/material';

export type AppButtonProps = ButtonProps;

export function AppButton({ variant = 'contained', ...props }: AppButtonProps) {
  return <Button variant={variant} {...props} />;
}