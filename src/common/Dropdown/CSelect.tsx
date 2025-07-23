import { ArrowBack, ArrowDownward } from "@mui/icons-material";
import {
  Box,
  Select,
  Typography,
  type SelectChangeEvent,
  type SxProps,
} from "@mui/material";
import { useState, type FC, type ReactNode } from "react";

interface ActionType {
  type: "add" | "edit" | "delete";
  value?: string | number;
  icon?: ReactNode;
  label?: string;
  disabled?: boolean;
  payload?: any;
  onClick?: () => void;
}
interface OptionDropdown {
  label: string;
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
// interface CustomSelectFieldProps {
//   value: string;
//   options: OptionDropdown[];
//   withBorder?: boolean; // ✅ Prop để xác định có border hay không
//   onChange: (event: SelectChangeEvent<string>) => void;
// }

const CSelect: FC<OptionDropdown> = ({
  value,
  options,
  withBorder = false,
  onChange,
  sx,
  disabled,
  placeholder = "Select an option",
  variant = "outlined",
  defaultValue = "",
  error,
}) => {
  const CustomSelectIcon = () => {
    const [selectOpen, setSelectOpen] = useState<number | null>(null);

    return selectOpen !== null ? <ArrowBack /> : <ArrowDownward />;
  };
  const selected = options.find((o) => o.label === value);
  return (
    <Select
      value={value}
      // onChange={onChange}
      variant={withBorder ? "outlined" : "standard"}
      disableUnderline={!withBorder}
      displayEmpty
      size="small"
      IconComponent={() => null}
      renderValue={() => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent={withBorder ? "space-between" : "flex-start"}
          width="100%"
        >
          <Typography variant="body2">
            {selected ? selected.label : "Chọn option"}
          </Typography>
          <CustomSelectIcon />
        </Box>
      )}
    />
  );
};

export default CSelect;
