import { Tooltip, type SxProps } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ClearIcon from "../../svgs/window-close.svg";
import ClearErrorIcon from "../../svgs/window-close.svg";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React, {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useState,
  type HTMLInputTypeAttribute,
} from "react";
import { useCopyToClipboard } from "../../context/use[custom]/useCopyToClipboard";

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
  isEmail?: boolean;
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
      clearable = true,
      value = "",
      disabled,
      onChange = () => {},
      onKeyDown,
      error,
      canCopy = false,
      realease3phrase = false,
      sx = {},
      readOnly,
      isEmail = false,
      ...restProps
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [hasCopy, setHasCopy] = useState(false);
    const [, copy] = useCopyToClipboard();

    const handleTogglePasswordVisibility = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    const handleClear = useCallback(() => {
      onChange("");
    }, [onChange]);

    const handleCopyText = useCallback(async () => {
      const success = await copy(value || "");
      if (success) {
        setHasCopy(true);
        setTimeout(() => setHasCopy(false), 2000);
      }
    }, [value, copy]);

    // 🔹 Check định dạng email
    const isEmailValid = useCallback((email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }, []);

    const readonlyStyles: SxProps = {
      caretColor: "transparent",
      pointerEvents: "visible",
      "& .MuiInputBase-input": {
        opacity: 0.7,
        pointerEvents: "none",
      },
    };

    const mergedSx = useMemo(
      () => ({
        ...sx,
        ...(readOnly ? readonlyStyles : {}),
      }),
      [readOnly, sx]
    );

    const actualInputType = useMemo(() => {
      if (type === "password") {
        return showPassword ? "text" : "password";
      }
      return type;
    }, [type, showPassword]);

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
        onChange={(e) => {
          const newValue = e.target.value;
          if (isEmail && !isEmailValid(newValue)) {
            // ✅ Nếu muốn, có thể bật thông báo hoặc highlight lỗi tại đây
            // console.warn("Email không hợp lệ:", newValue);
          }
          onChange(newValue);
        }}
        onKeyDown={onKeyDown}
        error={error}
        disabled={disabled}
        sx={mergedSx}
        {...restProps}
        InputProps={{
          readOnly: readOnly,
          startAdornment: !!startIcon && (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ),
          endAdornment: shouldShowEndAdornment && (
            <InputAdornment sx={{ gap: 1, paddingRight: 0 }} position="end">
              {clearable &&
                !!value &&
                !disabled &&
                !showEyeIcon &&
                !canCopy && (
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

              {type === "password" && showEyeIcon && (
                <IconButton
                  onClick={handleTogglePasswordVisibility}
                  disabled={disabled}
                  edge="end"
                  sx={{ cursor: "pointer", padding: "4px" }}
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              )}

              {endIcon && type !== "password" && (
                <IconButton
                  disabled={disabled}
                  edge="end"
                  sx={{ cursor: "pointer", padding: "4px" }}
                >
                  {endIcon}
                </IconButton>
              )}

              {canCopy && (
                <Tooltip title={hasCopy ? "Copied" : "Copy"}>
                  <IconButton
                    onClick={handleCopyText}
                    disabled={disabled}
                    sx={{ padding: "4px" }}
                  >
                    {hasCopy ? (
                      <DoneAllRoundedIcon />
                    ) : (
                      <ContentCopyRoundedIcon />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </InputAdornment>
          ),
        }}
        fullWidth
      />
    );
  }
);

InputTextField.displayName = "InputTextField";

export default memo(InputTextField);
