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

// Di chuyển styled component ra ngoài để tránh re-render
const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-root": {
    backgroundColor: "white",
  },
  "& .MuiSelect-select": {
    ...theme.typography.body1,
    padding: "8px 12px",
  },
  "& > p": {
    ...theme.typography.body1,
  },
}));

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

  const handleChange = (val: SelectChangeEvent<unknown>) => {
    const newValue = val.target.value as string | number;
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleOpen = useCallback(() => {
    setSelectOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setSelectOpen(false);
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <FormControl fullWidth error={error}>
      <StyledSelect
        value={value}
        variant={variant}
        onChange={handleChange}
        onOpen={handleOpen}
        onClose={handleClose}
        onMouseDown={handleMouseDown}
        size="small"
        IconComponent={CustomSelectIcon}
        MenuProps={{
          disableScrollLock: true,
        }}
        displayEmpty
      >
        {defaultValue && (
          <MenuItem sx={{ display: "none" }} value={defaultValue}>
            {defaultValue}
          </MenuItem>
        )}
        {placeholder && (
          <MenuItem sx={{ color: "grey.800" }} value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}

        {options.map(({ label, icon, value, color, disabled }) => (
          <MenuItem
            key={value}
            disabled={disabled}
            value={value}
            sx={{
              minHeight: 36,
              py: 0.5,
              fontSize: 13,
              width: "100%", // full chiều rộng dropdown
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%", // quan trọng để chiếm hết không gian
                minWidth: 0, // cho phép Typography co lại
              }}
            >
              {/* Icon */}
              {icon && (
                <Box
                  sx={{
                    fontSize: 18,
                    display: "flex",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </Box>
              )}

              {/* Label */}
              <Typography
                variant="body2"
                noWrap
                sx={{
                  fontSize: 12,
                  flexGrow: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {label}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  );
};

export default memo(SelectDropdown);
