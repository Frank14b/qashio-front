'use client';

import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { FormInput } from '@/app/components/forms/fields/FormInput';
import type { FieldPath, FieldValues } from 'react-hook-form';

type FormPasswordFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  autoComplete?: string;
};

export function FormPasswordField<T extends FieldValues>({
  name,
  label,
  autoComplete = 'current-password',
}: FormPasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false);

  return (
    <FormInput<T>
      name={name}
      label={label}
      type={visible ? 'text' : 'password'}
      autoComplete={autoComplete}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={visible ? 'Hide password' : 'Show password'}
              onClick={() => setVisible((value) => !value)}
              edge="end"
              size="small"
              sx={{ fontSize: '0.75rem', fontWeight: 600, borderRadius: 1.5, px: 1 }}
            >
              {visible ? 'Hide' : 'Show'}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
