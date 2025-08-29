import { memo, useEffect, useState } from "react";
import { INPUT_HEIGHT_BY_SIZE, type InputNumberProps } from "./type";
import clsx from "clsx";
import { TextField } from "@mui/material";

const InputNumber = ({
  placeholder = "",
  value,
  sx,
  defaultValue,
  min = 0,
  status = "default",
  onChange,
  onBlur,
  disabled = false,
  isSeparator = false,
  size = "medium",
  textAlign = "left",
}: InputNumberProps) => {
  const [valueText, setValueText] = useState<string>(value?.toString() ?? "");
  const inputErrorClass = status === "error" ? "input-error" : "";

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
    setValueText(isSeparator ? addCommas(convertValue) : convertValue);
  };

  useEffect(() => {
    const convertValue = parseFloat(removeNonNumeric(valueText));
    if (value !== convertValue) {
      const parseValue = parseFloat(removeNonNumeric(valueText));
      onChange?.(Number.isNaN(parseValue) ? null : parseValue);
    }
  }, [valueText]);

  useEffect(() => {
    const convertValue = value?.toString() ?? "";
    setValueText(isSeparator ? addCommas(convertValue) : convertValue);
  }, [value]);
  return (
    <TextField
      value={value ?? ""}
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
      slotProps={{
        formHelperText: { error: true },
        input: {
          autoComplete: "off",
          inputProps: {
            style: { textAlign, border: "none" },
            min,
            className: clsx("input-number-container", inputErrorClass),
            defaultValue,
            placeholder,
          },
        },
      }}
    />
  );
};
export default memo(InputNumber);
