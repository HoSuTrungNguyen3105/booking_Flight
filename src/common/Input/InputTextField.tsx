import { Box, type SxProps } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ClearIcon from "../../svgs/close-circle-svg.svg";
import ClearErrorIcon from "../../svgs/eye_close.png";
import CopyIcon from "../../svgs/copy-link-icon.svg";
import HasCopyIcon from "../../svgs/copy-success-svg.svg";
import PwHideIcon from "../../svgs/eye_close.png";
import PwShowIcon from "../../svgs/eye_1.png";

import React, {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useState,
  type HTMLInputTypeAttribute,
} from "react";

interface IInputTextFieldProps {
  type?: HTMLInputTypeAttribute;
  showEyeIcon?: boolean;
  placeholder?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  clearable?: boolean;
  sx?: SxProps;
  error?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  readOnly?: boolean;
  canCopy?: boolean;
  realease3phrase?: boolean;
  onChange?: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputTextField = forwardRef<HTMLInputElement, IInputTextFieldProps>(
  (
    {
      type = "text",
      showEyeIcon = false,
      startIcon,
      endIcon,
      clearable = false,
      value,
      disabled,
      onChange = () => {},
      onKeyDown,
      error,
      canCopy = false,
      realease3phrase = false,
      sx = {},
      readOnly,
      ...restProps
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [hasCopy, setHasCopy] = useState(false);

    const handleTogglePasswordVisibility = useCallback(() => {
      setShowPassword(!showPassword);
    }, [showPassword]);

    const handleClear = useCallback(() => {
      onChange("");
    }, [onChange]);

    const handleCopyText = useCallback(() => {
      navigator.clipboard.writeText(value || "");
      setHasCopy(true);

      setTimeout(() => {
        setHasCopy(false);
      }, 2000);
    }, [value]);

    const readonlyStyles: SxProps = {
      caretColor: "transparent",
      pointerEvents: "none",
      "& .MuiInputBase-input": {
        opacity: 0.7,
      },
    };

    const mergedSx = useMemo(() => {
      return {
        ...sx,
        ...(readOnly ? readonlyStyles : {}),
      };
    }, [readOnly, sx]);

    // Xác định type thực tế cho input
    const actualInputType = useMemo(() => {
      if (type === "password") {
        return showPassword ? "text" : "password";
      }
      return type;
    }, [type, showPassword]);

    // Kiểm tra xem có nên hiển thị endAdornment không
    const shouldShowEndAdornment = useMemo(() => {
      return (
        clearable || endIcon || (type === "password" && showEyeIcon) || canCopy
      );
    }, [clearable, endIcon, type, showEyeIcon, canCopy]);

    return (
      <TextField
        type={actualInputType}
        value={value}
        inputRef={ref}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        error={error}
        disabled={disabled}
        sx={mergedSx}
        {...restProps}
        slotProps={{
          input: {
            startAdornment: !!startIcon && (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ),
            endAdornment: shouldShowEndAdornment && (
              <InputAdornment sx={{ gap: 1, paddingRight: 0 }} position="end">
                {/* Clear button */}
                {clearable && !!value && !disabled && (
                  <IconButton
                    edge="end"
                    sx={{ cursor: "pointer", padding: "4px" }}
                    onClick={handleClear}
                    disabled={disabled}
                  >
                    <img
                      src={error ? ClearErrorIcon : ClearIcon}
                      width={20}
                      height={20}
                      alt="clear"
                    />
                  </IconButton>
                )}

                {/* Password visibility toggle */}
                {type === "password" && showEyeIcon && (
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    disabled={disabled}
                    edge="end"
                    sx={{ cursor: "pointer", padding: "4px" }}
                  >
                    <img
                      src={showPassword ? PwShowIcon : PwHideIcon}
                      width={20}
                      height={20}
                      alt="toggle-password"
                    />
                  </IconButton>
                )}

                {/* Custom end icon (chỉ hiển thị nếu không phải password field) */}
                {endIcon && type !== "password" && (
                  <IconButton
                    disabled={disabled}
                    edge="end"
                    sx={{ cursor: "pointer", padding: "4px" }}
                  >
                    {endIcon}
                  </IconButton>
                )}

                {/* Copy button */}
                {canCopy && (
                  <IconButton
                    onClick={handleCopyText}
                    disabled={disabled}
                    sx={{ padding: "4px" }}
                  >
                    {hasCopy ? (
                      <Box
                        component={"img"}
                        width={20}
                        height={20}
                        src={HasCopyIcon}
                        alt="copied"
                      />
                    ) : (
                      <Box
                        component={"img"}
                        width={20}
                        height={20}
                        src={CopyIcon}
                        alt="copy"
                      />
                    )}
                  </IconButton>
                )}
              </InputAdornment>
            ),
          },
        }}
        fullWidth
      />
    );
  }
);

InputTextField.displayName = "InputTextField";

export default memo(InputTextField);
