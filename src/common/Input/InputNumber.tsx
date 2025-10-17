import { memo, useEffect, useState } from "react";
import { INPUT_HEIGHT_BY_SIZE, type InputNumberProps } from "./type";
import { IconButton, InputAdornment, TextField } from "@mui/material";

const InputNumber = ({
  placeholder = "",
  value,
  sx,
  defaultValue,
  min = 0,
  startIcon,
  endIcon,
  onChange,
  onBlur,
  disabled = false,
  isSeparator = false,
  size = "medium",
  textAlign = "left",
}: InputNumberProps) => {
  const [valueText, setValueText] = useState<string>(
    value?.toString() ?? defaultValue?.toString() ?? ""
  );

  const addCommas = (num: string) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const removeNonNumeric = (num: string) => {
    const val = num.replace(/^(-)|\D+/g, "$1");
    const parseValue = parseFloat(val);
    if (parseValue === 0) return "0";
    if (val.startsWith("0")) {
      return val.substring(1);
    }
    return val;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const convertValue = removeNonNumeric(event.target.value);
    const formattedValue = isSeparator ? addCommas(convertValue) : convertValue;

    setValueText(formattedValue);

    const parsed = parseFloat(convertValue);
    onChange?.(Number.isNaN(parsed) ? null : parsed);
  };

  useEffect(() => {
    const convertValue = value?.toString() ?? "";
    setValueText(isSeparator ? addCommas(convertValue) : convertValue);
  }, [value, isSeparator]);

  return (
    <TextField
      value={valueText}
      onChange={handleChange}
      disabled={disabled}
      onBlur={(e) => {
        onBlur?.(e);
      }}
      sx={{
        height: INPUT_HEIGHT_BY_SIZE[size],
        ...sx,
      }}
      size={size === "small" ? "small" : undefined}
      InputProps={{
        startAdornment: startIcon && (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ),
        endAdornment: endIcon ? (
          <InputAdornment position="end">
            <IconButton
              disabled={disabled}
              edge="end"
              sx={{ cursor: "pointer", padding: "4px" }}
            >
              {endIcon}
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
      inputProps={{
        style: { textAlign, border: "none" },
        min,
        defaultValue,
        placeholder,
      }}
    />
  );
};

export default memo(InputNumber);
