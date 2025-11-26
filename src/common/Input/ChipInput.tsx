import React, { useState } from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";

interface ChipInputProps {
  label: string;
  placeholder?: string;
  value: string[];
  onChange: (newValue: string[]) => void;
  error?: boolean;
  helperText?: string;
}

const ChipInput: React.FC<ChipInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && inputValue.trim()) {
      event.preventDefault();
      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(inputValue.trim())) {
        if (!value.includes(inputValue.trim())) {
          onChange([...value, inputValue.trim()]);
          setInputValue("");
        }
      }
    }
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      options={[]}
      value={value}
      onChange={(_, newValue) => {
        onChange(newValue as string[]);
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip variant="outlined" label={option} key={key} {...tagProps} />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          onKeyDown={handleKeyDown}
          fullWidth
        />
      )}
    />
  );
};

export default ChipInput;
