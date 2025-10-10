import { useMemo, useState } from "react";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  Checkbox,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import {
  CheckBoxOutlineBlank as UncheckedIcon,
  CheckBox as CheckedIcon,
  ErrorOutline as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as ConfirmedIcon,
} from "@mui/icons-material";
import type { DropdownOptions, DropdownType } from "./type";

export const Dropdown = ({
  options = [],
  value = [],
  sx,
  label = "",
  customInput,
  onOpen,
  onClose,
  onChange,
  multiple,
  placeholder = "",
  status,
  readonly,
  disabled,
  disableCloseOnSelect,
  size = "small",
}: DropdownType & { size?: "small" | "medium" }) => {
  const [inputText, setInputText] = useState("");
  const [selected, setSelected] = useState<DropdownOptions | null>(null);

  const borderColor = useMemo(() => {
    const colorMap: Record<string, string> = {
      error: "red",
      warning: "orange",
      confirmed: "green",
    };
    return status && colorMap[status] ? colorMap[status] : undefined;
  }, [status]);

  const renderEndIcon = () => {
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
      multiple={multiple}
      disablePortal
      disableCloseOnSelect={disableCloseOnSelect}
      readOnly={readonly}
      disabled={disabled}
      options={options}
      value={selected}
      inputValue={readonly ? "" : inputText}
      getOptionLabel={(option) =>
        typeof option.label === "string" ? option.label : ""
      }
      onOpen={onOpen}
      onClose={onClose}
      // onInputChange={(e, val, reason) => {
      //   if (!readonly && reason === "input") setInputText(val);
      // }}
      onInputChange={(e, val, reason) => {
        if (reason === "input") {
          setInputText(val);
          // refetchUserFromMessage({ id: userId, email: val })
        }
      }}
      onChange={(e, newValue) => {
        setSelected(newValue);
        setInputText(
          Array.isArray(newValue) ? "" : (newValue?.label as string) || ""
        );
        //
        onChange?.(e, newValue);
      }}
      // onChange={(e, newValue) => {
      //   setInputText(
      //     Array.isArray(newValue) ? "" : (newValue?.label as string) || ""
      //   );
      //   onChange?.(e, newValue);
      // }}
      size={size}
      sx={{ minWidth: 200, ...sx }}
      // renderOption={(props, option, { selected }) =>
      //   option.label === "string" || "number" ? (
      //     <li {...props}>
      //       {multiple && (
      //         <Checkbox
      //           icon={<UncheckedIcon fontSize="small" color="secondary" />}
      //           checkedIcon={<CheckedIcon fontSize="small" color="secondary" />}
      //           checked={selected}
      //           sx={{ mr: 0.5 }}
      //         />
      //       )}
      //       {option.label}
      //     </li>
      //   ) : (
      //     <li {...props}>
      //       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      //         <Box>
      //           <Typography fontWeight={600}>{option.label}</Typography>
      //           <Typography variant="body2" color="text.secondary">
      //             {option.value}
      //           </Typography>
      //         </Box>
      //       </Box>
      //     </li>
      //   )
      // }
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          {multiple && (
            <Checkbox
              icon={<UncheckedIcon fontSize="small" />}
              checkedIcon={<CheckedIcon fontSize="small" />}
              checked={selected}
              sx={{ mr: 1 }}
            />
          )}
          {option.label}
        </li>
      )}
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
              "& fieldset": {
                borderColor: borderColor,
                cursor: "pointer",
              },
              "&:hover fieldset": {
                borderColor: borderColor,
                cursor: "pointer",
              },
              "&.Mui-focused fieldset": {
                borderColor: borderColor,
                cursor: "pointer",
              },
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
                {multiple && !readonly && params.InputProps.endAdornment}
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
