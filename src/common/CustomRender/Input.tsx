import { Controller, type Control } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../Input/InputField";
import { forwardRef } from "react";

interface InputProps {
  name: string;
  control: Control<any>;
  placeholder?: string;
  isPassword?: boolean;
  isEditable?: boolean;
  disabled?: boolean;
  sx?: React.CSSProperties;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      control,
      placeholder,
      isPassword = false,
      isEditable = true,
      disabled = false,
      sx,
      onKeyDown,
    },
    ref
  ) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputField
            {...field}
            ref={ref}
            isPassword={isPassword}
            placeholder={placeholder}
            disabled={disabled}
            onKeyDown={onKeyDown}
            sx={{ width: "50%", ...sx }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (!isEditable) {
                toast.warning("This field cannot be edited!");
                return;
              }
              field.onChange(e); // ✅ truyền event gốc, không phải value
            }}
          />
        )}
      />
    );
  }
);

export default Input;
