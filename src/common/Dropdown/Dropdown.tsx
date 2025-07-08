import type { DropdownType } from "./type";
import {
  Autocomplete,
  InputAdornment,
  TextField,
  Checkbox,
  Chip,
} from "@mui/material";
import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon,
  ErrorOutline as ErrorOutlineIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useMemo, useState } from "react";

export const Dropdown = ({
  options = [],
  value,
  sx,
  label = "",
  customInput = <></>,
  onOpen,
  onClose,
  onChange,
  multiple = false,
  placeholder = "",
  status,
  readonly,
  disabled,
  disableCloseOnSelect,
  size = "small",
}: DropdownType & { size?: "small" | "medium" }) => {
  const [inputText, setInputText] = useState("");

  const getBorderColour = useMemo(() => {
    switch (status) {
      case "error":
        return "red";
      case "warning":
        return "orange";
      case "confirmed":
        return "green";
      default:
        return undefined;
    }
  }, [status]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" color="secondary" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" color="secondary" />;
  const showEndAdornment = multiple && !readonly;

  return (
    <Autocomplete
      disablePortal
      disableCloseOnSelect={disableCloseOnSelect}
      readOnly={readonly}
      disabled={disabled}
      multiple={multiple}
      inputValue={readonly ? "" : inputText}
      onInputChange={(_, newInputValue, reason) => {
        if (!readonly && reason === "input") {
          setInputText(newInputValue);
        }
      }}
      options={options}
      value={(value ?? (multiple ? [] : null)) as any} // tránh lỗi khi null
      getOptionLabel={(option) => option?.label || ""}
      isOptionEqualToValue={(option, val) => option?.value === val?.value}
      onOpen={onOpen}
      onClose={onClose}
      onChange={(event, newValue) => {
        setInputText("");
        onChange?.(event, newValue);
      }}
      size={size}
      sx={{
        minWidth: 200,
        ...sx,
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          {multiple && (
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 4 }}
              checked={selected}
            />
          )}
          {option.label}
        </li>
      )}
      renderTags={
        multiple
          ? (selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.value}
                  label={option.label}
                  size="small"
                  sx={{ backgroundColor: "#E0F2F1" }}
                />
              ))
          : undefined
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          size={size}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderColor: getBorderColour,
            },
          }}
          InputProps={{
            ...params.InputProps,
            readOnly: readonly,
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
                {showEndAdornment && params.InputProps.endAdornment}
                {status === "warning" && (
                  <InputAdornment position="end">
                    <WarningIcon color="warning" />
                  </InputAdornment>
                )}
                {status === "error" && (
                  <InputAdornment position="end">
                    <ErrorOutlineIcon color="error" />
                  </InputAdornment>
                )}
                {status === "confirmed" && (
                  <InputAdornment position="end">
                    <CheckCircleIcon color="success" />
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
