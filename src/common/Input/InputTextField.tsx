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
      showEyeIcon,
      startIcon,
      endIcon,
      clearable,
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
      setShowPassword((prev) => !prev);
    }, []);

    const handleClear = useCallback(() => {
      onChange("");
    }, [onChange]);

    const getMaskedPassword = (val: string, visibleCount: number = 3) => {
      if (!val || val.length <= visibleCount) return val;
      const visible = val.slice(-visibleCount);
      const hidden = "*".repeat(visible.length - visibleCount);
      return hidden + visible;
    };

    const handleCopyText = () => {
      navigator.clipboard.writeText(value || "");
      setHasCopy(true);
      setTimeout(() => {
        setHasCopy(false);
      }, 2000);
    };

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

    // const mergedSx = useMemo(() => {
    //   return {
    //     ...sx,
    //     ...(readOnly ? readonlyStyles : {}),
    //     ...(hasCopy
    //       ? {
    //           "& .MuiOutlinedInput-root": {
    //             border: "2px solid #4caf50",
    //             borderRadius: "8px", // hoặc theo thiết kế của bạn
    //           },
    //         }
    //       : {}),
    //   };
    // }, [readOnly, hasCopy, sx]);

    return (
      <TextField
        type={
          type === "password"
            ? showPassword
              ? "text"
              : "text" // vẫn là text để dùng `•••` che
            : type
        }
        value={
          type === "password" && realease3phrase && !showPassword
            ? getMaskedPassword(value || "")
            : value
        }
        inputRef={ref}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        error={error}
        disabled={disabled}
        sx={mergedSx}
        {...restProps}
        // inputProps={{
        //   readOnly: realease3phrase && !showPassword,
        // }}
        slotProps={{
          input: {
            startAdornment: !!startIcon && (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ),
            endAdornment: (clearable || endIcon || type === "password") && (
              <InputAdornment sx={{ gap: 1, paddingRight: 0 }} position="end">
                {clearable && !!value && (
                  <IconButton
                    edge="end"
                    sx={{ cursor: "pointer" }}
                    disabled={disabled}
                    onClick={handleClear}
                  >
                    <img
                      src={error ? ClearErrorIcon : ClearIcon}
                      width={20}
                      height={20}
                      alt="clear"
                    />
                  </IconButton>
                )}
                {type === "password" && showEyeIcon ? (
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    disabled={false}
                    edge="end"
                    sx={{ cursor: "pointer" }}
                  >
                    <img
                      src={showPassword ? PwShowIcon : PwHideIcon}
                      width={20}
                      height={20}
                      alt="toggle-password"
                    />
                  </IconButton>
                ) : (
                  endIcon
                )}
                {canCopy && (
                  <IconButton onClick={handleCopyText}>
                    {hasCopy ? (
                      <Box
                        component={"img"}
                        width={20}
                        height={20}
                        src={HasCopyIcon}
                      />
                    ) : (
                      <Box
                        component={"img"}
                        width={20}
                        height={20}
                        src={CopyIcon}
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
