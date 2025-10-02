import { Tooltip, type SxProps } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ClearIcon from "../../svgs/window-close.svg";
import ClearErrorIcon from "../../svgs/eye_close.png";
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
    const [_, copy] = useCopyToClipboard();

    const handleTogglePasswordVisibility = useCallback(() => {
      setShowPassword(!showPassword);
    }, [showPassword]);

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

    const readonlyStyles: SxProps = {
      caretColor: "transparent", // ẩn caret
      pointerEvents: "visible",
      "& .MuiInputBase-input": {
        opacity: 0.7,
        pointerEvents: "none", // chỉ chặn input
      },
    };

    const mergedSx = useMemo(() => {
      return {
        ...sx,
        ...(readOnly ? readonlyStyles : {}),
      };
    }, [readOnly, sx]);

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
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        error={error}
        disabled={disabled}
        sx={mergedSx}
        {...restProps}
        InputProps={{
          readOnly: readOnly,
        }}
        slotProps={{
          input: {
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
          },
        }}
        fullWidth
      />
    );
  }
);

InputTextField.displayName = "InputTextField";

export default memo(InputTextField);
