'use client';

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  type FormControlProps,
  type SelectProps as MuiSelectProps,
} from '@mui/material';

export interface SelectOption {
  label: string;
  value: string;
}

export type SelectProps = Omit<MuiSelectProps, 'error'> & {
  label: string;
  options: SelectOption[];
  helperText?: string;
  error?: boolean;
  fullWidth?: FormControlProps['fullWidth'];
};

export function Select({
  label,
  options,
  helperText,
  error = false,
  fullWidth = true,
  id,
  value,
  ...props
}: SelectProps) {
  const labelId = id ? `${id}-label` : `${label.replace(/\s+/g, '-').toLowerCase()}-label`;

  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect labelId={labelId} id={id} label={label} value={value ?? ''} {...props}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
}
