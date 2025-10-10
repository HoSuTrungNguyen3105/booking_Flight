import { useMemo, useState, useCallback, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  ErrorOutline as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as ConfirmedIcon,
} from "@mui/icons-material";
import type { DropdownOptions, DropdownType } from "./type";
import useDebounce from "../../context/use[custom]/useDebounce";

// Thêm interface cho hàm call API
interface ApiCallFunction {
  (searchText: string): Promise<DropdownOptions[]>;
}

interface DropdownProps extends DropdownType {
  size?: "small" | "medium";
  apiCall?: ApiCallFunction; // Hàm call API từ bên ngoài
  debounceDelay?: number; // Thời gian debounce (ms)
}

export const Dropdown = ({
  options = [],
  // value = null,
  sx,
  label = "",
  customInput,
  onOpen,
  onClose,
  onChange,
  placeholder = "",
  status,
  onInputChange,
  readonly,
  disabled,
  disableCloseOnSelect = false,
  size = "small",
  apiCall, // Hàm call API
  debounceDelay = 300, // Mặc định 300ms
}: DropdownProps) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiOptions, setApiOptions] = useState<DropdownOptions[]>([]);

  // 👇 Chỉ dùng single selection
  const [selected, setSelected] = useState<DropdownOptions | null>(null);

  const debouncedSearchText = useDebounce(inputText, debounceDelay);

  // Hàm fetch data từ API
  const fetchOptions = useCallback(
    async (searchText: string) => {
      if (!apiCall) return;

      try {
        setIsLoading(true);
        const data = await apiCall(searchText);
        setApiOptions(data);
      } catch (error) {
        console.error("Error fetching options:", error);
        setApiOptions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall]
  );

  // Effect để gọi API khi debounced search text thay đổi
  useEffect(() => {
    if (debouncedSearchText.trim() !== "" && apiCall) {
      fetchOptions(debouncedSearchText);
    } else if (debouncedSearchText.trim() === "" && apiCall) {
      // Nếu search text rỗng, reset options
      setApiOptions([]);
    }
  }, [debouncedSearchText, fetchOptions, apiCall]);

  // Kết hợp options từ props và từ API
  const combinedOptions = useMemo(() => {
    if (apiCall) {
      return apiOptions;
    }
    return options;
  }, [options, apiOptions, apiCall]);

  const borderColor = useMemo(() => {
    const colorMap: Record<string, string> = {
      error: "red",
      warning: "orange",
      confirmed: "green",
    };
    return status && colorMap[status] ? colorMap[status] : undefined;
  }, [status]);

  const renderEndIcon = () => {
    if (isLoading) {
      return <CircularProgress size={20} />;
    }

    switch (status) {
      case "warning":
        return <WarningIcon color="warning" />;
      case "error":
        return <ErrorIcon color="error" />;
      case "confirmed":
        return <ConfirmedIcon color="success" />;
      default:
        return null;
    }
  };

  return (
    <Autocomplete
      multiple={false} // 👈 Luôn là false
      disablePortal
      disableCloseOnSelect={disableCloseOnSelect}
      readOnly={readonly}
      disabled={disabled}
      options={combinedOptions}
      value={selected}
      inputValue={readonly ? "" : inputText}
      loading={isLoading}
      getOptionLabel={(option) =>
        typeof option.label === "string" ? option.label : ""
      }
      onOpen={onOpen}
      onClose={onClose}
      onInputChange={(e, val, reason) => {
        if (reason === "input") {
          setInputText(val);
          onInputChange?.(val);
        }
      }}
      // 👇 Đơn giản hóa onChange
      onChange={(event, newValue) => {
        setSelected(newValue);
        onChange?.(event, newValue);
      }}
      size={size}
      sx={{ minWidth: 600, ...sx }}
      renderOption={(props, option) => <li {...props}>{option.label}</li>}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          size={size}
          sx={{
            ...sx,
            "& .MuiOutlinedInput-root": {
              cursor: "pointer",
              "& fieldset": { borderColor, cursor: "pointer" },
              "&:hover fieldset": { borderColor, cursor: "pointer" },
              "&.Mui-focused fieldset": { borderColor, cursor: "pointer" },
            },
          }}
          InputProps={{
            ...params.InputProps,
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
                {!readonly && params.InputProps.endAdornment}
                {renderEndIcon() && (
                  <InputAdornment position="end">
                    {renderEndIcon()}
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
