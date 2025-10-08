import { memo, useEffect, useState } from "react";
import { INPUT_HEIGHT_BY_SIZE, type InputNumberProps } from "./type";
import { TextField } from "@mui/material";

const InputNumber = ({
  placeholder = "",
  value,
  sx,
  defaultValue,
  min = 0,
  //   status = "default",
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

  //   const inputErrorClass = status === "error" ? "input-error" : "";

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

  // ✅ chỉ xử lý onChange ở đây, không để trong useEffect
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const convertValue = removeNonNumeric(event.target.value);
    const formattedValue = isSeparator ? addCommas(convertValue) : convertValue;

    setValueText(formattedValue);

    const parsed = parseFloat(convertValue);
    onChange?.(Number.isNaN(parsed) ? null : parsed);
  };

  // ✅ chỉ đồng bộ valueText khi prop value thay đổi từ ngoài
  useEffect(() => {
    const convertValue = value?.toString() ?? "";
    setValueText(isSeparator ? addCommas(convertValue) : convertValue);
  }, [value]);

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
      slotProps={{
        formHelperText: { error: true },
        input: {
          autoComplete: "off",
          inputProps: {
            style: { textAlign, border: "none" },
            min,
            // className: clsx("input-number-container", inputErrorClass),
            defaultValue,
            placeholder,
          },
        },
      }}
    />
  );
};
export default memo(InputNumber);
