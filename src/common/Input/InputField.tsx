import React, { useCallback, useState } from "react";
import {
  ICON_BY_STATUS,
  INPUT_HEIGHT_BY_SIZE,
  type InputFieldProps,
} from "./type";
import {
  Box,
  IconButton,
  InputAdornment,
  SvgIcon,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const InputField = React.forwardRef(
  (
    {
      size = "medium",
      fullWidth = true,
      className = "",
      label = "",
      sx,
      textAlign = "left",
      status = "default",
      disabled = false,
      placeholder,
      value,
      onChange,
      readOnly,
      isPassword = false,
      onKeyDown,
      startAdorment,
      endAdorment,
      onBlur,
      type = "text",
      error = false,
      helperText,
      allowHypen,
      focused,
    }: InputFieldProps,
    ref
  ) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showStatusIcon, setShowStatusIcon] = useState<boolean>(false);

    const changePasswordVisibility = () => {
      if (readOnly || disabled) return;
      setShowPassword(!showPassword);
    };

    const changeIconVisibility = useCallback(
      (show: boolean) => {
        if (!readOnly && status !== "default") {
          setShowStatusIcon(show);
        }
      },
      [readOnly, status]
    );

    const inputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (type) {
          case "number":
            event.target.value = allowHypen
              ? event.target.value.replace(/[^0-9-]/g, "")
              : event.target.value.replace(/\D+/g, "");
            break;
          case "number-multi":
            event.target.value = event.target.value.replace(/[^\d,]/g, "");
            break;
          case "alpha-numeric":
            event.target.value = event.target.value.replace(
              /[^a-zA-Z0-9]/g,
              ""
            );
            break;
          default:
            break;
        }
        onChange?.(event);
      },
      [type, onChange, allowHypen]
    );

    return (
      <TextField
        label={label}
        // data-testid={
        //   type === "number"
        //     ? "number-input"
        //     : type === "number-multi"
        //     ? "number-multi-input"
        //     : type === "alpha-numeric"
        //     ? "alpha-numeric-input"
        //     : isPassword
        //     ? "password-input"
        //     : "input-field"
        // }
        error={error}
        helperText={helperText}
        type={isPassword && !showPassword ? "password" : "text"}
        value={value ?? ""}
        inputRef={ref}
        onChange={inputChange}
        onKeyDown={onKeyDown}
        fullWidth={fullWidth}
        disabled={disabled}
        focused={focused}
        onFocus={() => changeIconVisibility(false)}
        onBlur={(e) => {
          changeIconVisibility(true);
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
            autoComplete: isPassword && !showPassword ? "new-password" : "off",
            className: `${className} ${status}`,
            placeholder,
            readOnly,
            startAdornment: startAdorment ? (
              <InputAdornment position="start">{startAdorment}</InputAdornment>
            ) : null,
            inputProps: {
              style: { textAlign, border: "none" },
            },
            endAdornment: (
              <InputAdornment position="end">
                <Box className="flex color-[#5B5C5B] cursor-pointer gap-1">
                  {endAdorment}
                  {showStatusIcon && ICON_BY_STATUS[status] && (
                    <SvgIcon className="text-base">
                      {ICON_BY_STATUS[status]}
                    </SvgIcon>
                  )}
                  {isPassword && (
                    <IconButton
                      className="text-base cursor-pointer"
                      onClick={changePasswordVisibility}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )}
                </Box>
              </InputAdornment>
            ),
          },
        }}
      />
    );
  }
);

export default InputField;
