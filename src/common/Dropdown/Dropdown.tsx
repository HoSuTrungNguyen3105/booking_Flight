import type { DropdownType } from "./type";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Checkbox from "@mui/material/Checkbox";
import { useMemo } from "react";
export const Dropdown = ({
  options = [],
  value = [],
  sx,
  label = "",
  customInput = <></>,
  onOpen,
  onClose,
  onChange,
  multiple,
  placeholder = "",
  status,
  readonly,
  disabled,
  disableCloseOnSelect,
}: DropdownType) => {
  const getBorderColour = useMemo(() => {
    switch (status) {
      case "error":
        return "red";
      case "warning":
        return "yellow";
      case "confirmed":
        return "green";
      default:
        return undefined;
    }
  }, [status]);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" color="secondary" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" color="secondary" />;
  return (
    <Autocomplete
      disablePortal
      disableCloseOnSelect={disableCloseOnSelect}
      readOnly={readonly}
      disabled={disabled}
      multiple={multiple}
      options={options}
      sx={sx}
      onOpen={onOpen}
      onClose={onClose}
      value={value}
      onChange={onChange}
      getOptionLabel={(option) => option.label || ""}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {multiple === true && (
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 0 }}
                checked={selected}
              />
            )}
            <span
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "clip",
                maxWidth: "100%",
              }}
            >
              {option.label}
            </span>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          label={label}
          placeholder={placeholder}
          sx={{
            "& .MuiOutlinedInput-root": {
              alignItems: "left",
            },
            "& input": {
              // padding: "10.5px 14px",
              // lineHeight: "1.5",
              padding: "10.5px 14px",
              lineHeight: "1.5",
              overflow: "visible", // ✅ không bị cắt
              textOverflow: "unset", // ✅ bỏ ...
              whiteSpace: "normal",
            },
            "& .MuiOutlinedInput-input": {
              flexGrow: 1,
              minWidth: 0, // cần để flex hoạt động
              overflow: "visible",
              whiteSpace: "nowrap",
              textOverflow: "unset",
            },

            //
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: getBorderColour,
            },
            "& .MuiAutocomplete-startAdornment": {
              right: 15,
            },
            "& .MuiAutocomplete-endAdornment": {
              right: 15,
            },
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: customInput ? (
              <>
                {params.InputProps.startAdornment}
                <InputAdornment position="start">{customInput}</InputAdornment>
              </>
            ) : null,
            endAdornment: (
              <>
                {params.InputProps.endAdornment}
                {status === "warning" && (
                  <InputAdornment position="end">
                    <WarningIcon color="warning" />
                  </InputAdornment>
                )}
                {status === "error" && (
                  <InputAdornment position="end">
                    <ErrorOutlineIcon color="error" />
                  </InputAdornment>
                )}
                {status === "confirmed" && (
                  <InputAdornment position="end">
                    <CheckCircleIcon color="success" />
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
