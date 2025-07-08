import React from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";

export interface DropdownOption {
  label: string;
  value: string | number;
}

interface MultiDropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value: DropdownOption[];
  onChange: (value: DropdownOption[]) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  label,
  placeholder = "Chọn...",
  options,
  value,
  onChange,
  disabled = false,
  error = false,
  helperText = "",
}) => {
  return (
    <Autocomplete
      multiple
      options={options}
      value={value}
      disableCloseOnSelect
      getOptionLabel={(option) => option.label}
      onChange={(_, newValue) => onChange(newValue)}
      disabled={disabled}
      renderTags={(selected, getTagProps) =>
        selected.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option.value}
            label={option.label}
            size="small"
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
        />
      )}
      sx={{
        minWidth: 250,
        "& .MuiAutocomplete-tag": {
          backgroundColor: "#E0F7FA",
          color: "#006064",
        },
      }}
    />
  );
};

export default MultiDropdown;
