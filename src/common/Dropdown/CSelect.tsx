import {
  Box,
  FormControl,
  MenuItem,
  Select,
  styled,
  Typography,
  type SelectChangeEvent,
  type SxProps,
} from "@mui/material";
import { memo, useCallback, useState, type FC, type ReactNode } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export interface ActionType {
  // type?: "add" | "edit" | "delete";
  value?: string | number;
  icon?: ReactNode;
  label?: string;
  disabled?: boolean;
  color?: string; // Màu sắc của option
  // payload?: any;
  onClick?: () => void;
}
interface OptionDropdown {
  // label: string;
  placeholder?: string;
  options: ActionType[];
  sx?: SxProps;
  disabled?: boolean;
  variant?: "outlined" | "standard" | "filled";
  error?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (event: string | number) => void;
  withBorder?: boolean; // ✅ Prop để xác định có border hay không
}

const CSelect: FC<OptionDropdown> = ({
  value,
  options,
  withBorder = false,
  onChange,
  sx,
  disabled,
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

  const selected = options.find((o) => o.value === value);
  return (
    <FormControl fullWidth error={error}>
      <StyledSelect
        value={value}
        // onChange={(e) => {
        //   const val = e.target.value;
        //   onChange?.(val);
        // }}
        variant={variant}
        onChange={handleChange}
        onOpen={() => setSelectOpen(true)}
        onClose={() => setSelectOpen(false)}
        // disableUnderline={!withBorder}
        // displayEmpty
        size="small"
        IconComponent={CustomSelectIcon}
        // renderValue={() => (
        //   <Box
        //     display="flex"
        //     alignItems="center"
        //     justifyContent={withBorder ? "space-between" : "flex-start"}
        //     width="100%"
        //   >
        //     <Typography variant="body2">
        //       {selected ? selected.label : "Chọn option"}
        //     </Typography>
        //     <CustomSelectIcon />
        //   </Box>
        // )}
      >
        {placeholder && (
          <Box component="option" value="" disabled sx={{ color: "grey.500" }}>
            {placeholder}
          </Box>
        )}
        {options.map(({ value, disabled, label, color }) => (
          <MenuItem
            key={value}
            value={value}
            disabled={disabled}
            sx={{ color: color }}
          >
            {label || value}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  );
};

export default memo(CSelect);
