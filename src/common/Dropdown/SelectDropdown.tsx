import {
  FormControl,
  MenuItem,
  Select,
  styled,
  type SelectChangeEvent,
  type SxProps,
} from "@mui/material";
import { memo, useCallback, useState, type FC, type ReactNode } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export interface ActionType {
  value?: string | number;
  icon?: ReactNode;
  label?: string;
  disabled?: boolean;
  color?: string;
  onClick?: () => void;
}
interface OptionSelectDropdownProps {
  placeholder?: string;
  options: ActionType[];
  sx?: SxProps;
  disabled?: boolean;
  variant?: "outlined" | "standard" | "filled";
  error?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (event: string | number) => void;
  withBorder?: boolean;
}

const SelectDropdown: FC<OptionSelectDropdownProps> = ({
  value,
  options,
  onChange,
  placeholder,
  variant = "outlined",
  defaultValue,
  error,
}) => {
  const [selectOpen, setSelectOpen] = useState<boolean>(false);
  const CustomSelectIcon = useCallback(() => {
    return selectOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />;
  }, [selectOpen]);
  const StyledSelect = styled(Select)(({ theme }) => ({
    "& .MuiSelect-root": {
      backgroundColor: "white",
    },
    "& .MuiSelect-select": {
      ...theme.typography.body1,
      padding: "11px 17px",
    },
    "& > p": {
      ...theme.typography.body1,
    },
  }));
  const handleChange = (val: SelectChangeEvent<unknown>) => {
    const newValue = val.target.value as string | number;

    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <FormControl fullWidth error={error}>
      <StyledSelect
        value={value}
        variant={variant}
        onChange={handleChange}
        onOpen={() => setSelectOpen(true)}
        onClose={() => setSelectOpen(false)}
        size="small"
        IconComponent={CustomSelectIcon}
      >
        {defaultValue && (
          <MenuItem sx={{ display: "none" }} value={defaultValue}>
            {defaultValue}
          </MenuItem>
        )}

        {/* Render placeholder if provided */}
        {placeholder && (
          <MenuItem sx={{ color: "grey.800" }} value="">
            {placeholder}
          </MenuItem>
        )}

        {options.map(({ label, value, color, disabled }) => (
          <MenuItem
            key={value}
            disabled={disabled}
            value={value}
            sx={{ color: color }}
          >
            {label}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  );
};

export default memo(SelectDropdown);
