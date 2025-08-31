import { useMemo, useState } from "react";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  Checkbox,
} from "@mui/material";
import {
  CheckBoxOutlineBlank as UncheckedIcon,
  CheckBox as CheckedIcon,
  ErrorOutline as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as ConfirmedIcon,
} from "@mui/icons-material";
import type { DropdownType } from "./type";

export const Dropdown = ({
  options = [],
  value = [],
  sx,
  label = "",
  customInput,
  onOpen,
  onClose,
  onChange,
  multiple,
  placeholder = "",
  status,
  readonly,
  disabled,
  disableCloseOnSelect,
  size = "small",
}: DropdownType & { size?: "small" | "medium" }) => {
  const [inputText, setInputText] = useState("");

  const borderColor = useMemo(() => {
    const colorMap: Record<string, string> = {
      error: "red",
      warning: "orange",
      confirmed: "green",
    };
    return status && colorMap[status] ? colorMap[status] : undefined;
  }, [status]);

  const renderEndIcon = () => {
    switch (status) {
      case "warning":
        return <WarningIcon color="warning" />;
      case "error":
        return <ErrorIcon color="error" />;
      case "confirmed":
        return <ConfirmedIcon color="success" />;
      default:
        return null;
    }
  };

  return (
    <Autocomplete
      multiple={multiple}
      disablePortal
      disableCloseOnSelect={disableCloseOnSelect}
      readOnly={readonly}
      disabled={disabled}
      options={options}
      value={value}
      inputValue={readonly ? "" : inputText}
      getOptionLabel={(option) => option.label || ""}
      onOpen={onOpen}
      onClose={onClose}
      onInputChange={(e, val, reason) => {
        if (!readonly && reason === "input") setInputText(val);
      }}
      onChange={(e, newValue) => {
        setInputText(Array.isArray(newValue) ? "" : newValue?.label || "");
        onChange?.(e, newValue);
      }}
      size={size}
      sx={{ minWidth: 200, ...sx }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          {multiple && (
            <Checkbox
              icon={<UncheckedIcon fontSize="small" color="secondary" />}
              checkedIcon={<CheckedIcon fontSize="small" color="secondary" />}
              checked={selected}
              sx={{ mr: 0.5 }}
            />
          )}
          {option.label}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          size={size}
          sx={{
            ...sx,
            "& .MuiOutlinedInput-root": {
              cursor: "pointer", // con trỏ khi hover
              "& fieldset": {
                borderColor: borderColor,
                cursor: "pointer",
              },
              "&:hover fieldset": {
                borderColor: borderColor,
                cursor: "pointer",
              },
              "&.Mui-focused fieldset": {
                borderColor: borderColor,
                cursor: "pointer",
              },
            },
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: customInput ? (
              <>
                {params.InputProps.startAdornment}
                <InputAdornment position="start">{customInput}</InputAdornment>
              </>
            ) : (
              params.InputProps.startAdornment
            ),
            endAdornment: (
              <>
                {multiple && !readonly && params.InputProps.endAdornment}
                {renderEndIcon() && (
                  <InputAdornment position="end">
                    {renderEndIcon()}
                  </InputAdornment>
                )}
              </>
            ),
          }}
        />
      )}
    />
  );
};
