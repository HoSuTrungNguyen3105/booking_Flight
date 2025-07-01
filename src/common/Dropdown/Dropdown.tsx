import type { DropdownType } from "./type";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Checkbox from "@mui/material/Checkbox";
import { useMemo, useState } from "react";
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
  const [inputText, setInputText] = useState("");
  const showEndAdornment = multiple && !readonly;
  return (
    <Autocomplete
      disablePortal
      inputValue={inputText}
      disableCloseOnSelect={disableCloseOnSelect}
      readOnly={readonly}
      disabled={disabled}
      multiple={multiple}
      options={options}
      sx={sx}
      onOpen={onOpen}
      onClose={onClose}
      value={value}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === "input") return;
        setInputText(newInputValue);
      }}
      onChange={(event, newValue) => {
        if (Array.isArray(newValue)) {
          setInputText("");
          onChange?.(event, newValue);
        } else {
          setInputText(newValue?.label || "");
          onChange?.(event, newValue); // newValue: DropdownOptions | null
        }
      }}
      // slotProps={{
      //   paper: {
      //     sx: {
      //       minWidth: 300,
      //       maxWidth: 600,
      //       overflowX: "auto",
      //     },
      //   },
      // }}
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
            {/* <span
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "clip",
                maxWidth: "100%",
              }}
            >
              {option.label}
            </span> */}
            <span
              style={
                {
                  // overflow: "hidden",
                  // whiteSpace: "normal", // 🔄 từ "nowrap" ➝ "normal"
                  // textOverflow: "unset",
                  // maxWidth: "100%",
                  // wordBreak: "break-word",
                  // fontSize: "15px", // nếu muốn chữ nhỏ lại
                }
              }
            >
              {option.value}
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
              alignItems: "center",
              textDecoration: "disabled",
              cursor: "pointer", // hoặc 'pointer', 'default'... tùy bạn thích
            },
            "& .MuiOutlinedInput-input::selection": {
              cursor: "pointer", // hoặc 'pointer', 'default'... tùy bạn thích
            },

            "& .MuiInputBase-root": {
              minWidth: "20px",
              display: "flex",
              minHeight: "20px",
              // alignItems: "center",
              // cursor: "pointer", // hoặc 'pointer', 'default'... tùy bạn thích
            },
            "& .MuiOutlinedInput-input": {
              textOverflow: "unset", // hoặc "unset" nếu muốn hiện full
              flexGrow: 1, // hoặc "unset" nếu muốn hiện full
              lineHeight: 1.5,
              fontSize: "15px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: getBorderColour,
            },
            "& .MuiAutocomplete-startAdornment": {
              right: 15,
              cursor: "pointer",
              userSelect: "none",
              pointerEvents: "none",
            },
            "& .MuiAutocomplete-endAdornment": {
              right: 15,
            },
            "& input": {
              cursor: "pointer",
              userSelect: "none",
            },
          }}
          InputProps={{
            readOnly: true,
            disableUnderline: true,
            ...params.InputProps,
            startAdornment: customInput ? (
              <>
                {params.InputProps.startAdornment}
                <InputAdornment position="start">{customInput}</InputAdornment>
              </>
            ) : null,
            endAdornment: (
              <>
                {showEndAdornment && params.InputProps.endAdornment}
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
