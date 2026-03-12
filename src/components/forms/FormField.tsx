import React from 'react';
import { Controller, FieldValues, Control, Path, PathValue } from 'react-hook-form';

interface RenderArgs {
  field: {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    name: string;
  };
  error?: string;
}

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  defaultValue?: PathValue<T, Path<T>>;
  render: (args: RenderArgs) => React.ReactNode;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  defaultValue,
  render,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) =>
        render({
          field: {
            value: field.value,
            onChange: field.onChange,
            onBlur: field.onBlur,
            name: field.name,
          },
          error: fieldState.error?.message,
        }) as React.ReactElement
      }
    />
  );
}
