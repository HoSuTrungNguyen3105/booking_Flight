import { Box, type SxProps } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ClearIcon from "../../svgs/close-circle-svg.svg";
import ClearErrorIcon from "../../svgs/eye_close.png";
import CopyIcon from "../../svgs/copy-link-icon.svg";
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
import { useToast } from "../../context/ToastContext";

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
    const toast = useToast();
    const handleTogglePasswordVisibility = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    const handleClear = useCallback(() => {
      onChange("");
    }, [onChange]);

    const getMaskedPassword = (val: string) => {
      if (!val) return "";
      if (val.length <= 3) return val;
      const maskedLength = val.length - 3;
      return "•".repeat(maskedLength) + val.slice(-3);
    };

    const handleCopyText = () => {
      navigator.clipboard.writeText(value || "");
      toast("Success copy", "success");
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

    return (
      <TextField
        // type={type === "password" && showPassword ? "text" : type}
        type={
          type === "password"
            ? showPassword
              ? "text"
              : "text" // dùng "text" để cho phép hiển thị masked dạng "•••abc"
            : type
        }
        inputRef={ref}
        // value={
        //   type === "password" && realease3phrase && !showPassword
        //     ? getMaskedPassword(value || "")
        //     : value
        // }
        value={
          type === "password" && realease3phrase && !showPassword
            ? getMaskedPassword(value || "")
            : value
        }
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        error={error}
        disabled={disabled}
        sx={mergedSx}
        {...restProps}
        inputProps={{
          readOnly: realease3phrase && !showPassword,
        }}
        slotProps={{
          input: {
            startAdornment: !!startIcon && (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ),
            endAdornment: (clearable || endIcon || type === "password") && (
              <InputAdornment position="end">
                {clearable && !!value && (
                  <IconButton
                    edge="end"
                    sx={{ cursor: "pointer" }}
                    disabled={disabled}
                    onClick={handleClear}
                  >
                    <img
                      src={error ? ClearErrorIcon : ClearIcon}
                      width={24}
                      height={24}
                      alt="clear"
                    />
                  </IconButton>
                )}
                {type === "password" && showEyeIcon ? (
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    disabled={disabled}
                    edge="end"
                    sx={{ cursor: "pointer" }}
                  >
                    <img
                      src={showPassword ? PwShowIcon : PwHideIcon}
                      width={26}
                      height={26}
                      alt="toggle-password"
                    />
                  </IconButton>
                ) : (
                  endIcon
                )}
                {canCopy && (
                  <IconButton onClick={handleCopyText}>
                    <Box
                      component={"img"}
                      width={20}
                      height={20}
                      src={CopyIcon}
                    />
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
