import { useCallback } from "react";
import { Controller, type Control } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../../../common/Input/InputField";

interface InputProps {
  name: string;
  control: Control<any>;
  placeholder?: string;
  isPassword?: boolean;
  isEditable?: boolean;
  disabled?: boolean;
  sx?: React.CSSProperties;
}

const Input = ({
  name,
  control,
  placeholder,
  isPassword = false,
  isEditable = true,
  disabled = false,
  sx,
}: InputProps) => {
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    ) => {
      if (!isEditable) {
        toast.warning("This field cannot be edited!");
        return;
      }
      onChange(e);
    },
    [isEditable]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputField
          {...field}
          isPassword={isPassword}
          placeholder={placeholder}
          disabled={disabled}
          sx={{ width: "50%", ...sx }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e, field.onChange)
          }
        />
      )}
    />
  );
};

export default Input;
