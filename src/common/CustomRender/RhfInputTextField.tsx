import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import InputTextField from "../Input/InputTextField";

interface RhfInputTextFieldProps {
  registration: UseFormRegisterReturn;
  placeholder?: string;
  error?: boolean;
  value?: string; // Nhận value từ bên ngoài
  type?: string;
}

const RhfInputTextField: React.FC<RhfInputTextFieldProps> = ({
  registration,
  placeholder,
  value,
  error,
  type,
}) => {
  const { onChange, onBlur, ref, name, ...restRegistration } = registration;

  const handleChange = (inputValue: string) => {
    const event = {
      target: {
        value: inputValue,
        name: name,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(event);
  };

  return (
    <InputTextField
      name={name}
      value={value}
      onChange={handleChange}
      ref={ref}
      placeholder={placeholder}
      error={error}
      type={type}
      {...restRegistration}
    />
  );
};

export default RhfInputTextField;
