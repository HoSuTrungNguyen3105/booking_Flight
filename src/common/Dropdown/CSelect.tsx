import { ArrowBack, ArrowDownward } from "@mui/icons-material";
import { Box, Select, Typography, type SelectChangeEvent } from "@mui/material";
import { useState } from "react";

interface ActionType {
  type: "add" | "edit" | "delete";
  payload?: any;
  onClick?: () => void;
}
interface OptionDropdown {
  label: string;
  icon?: string;
  action: ActionType;
}
interface CustomSelectFieldProps {
  value: string;
  options: OptionDropdown[];
  withBorder?: boolean; // ✅ Prop để xác định có border hay không
  onChange: (event: SelectChangeEvent<string>) => void;
}

const CSelect = ({
  value,
  options,
  withBorder = false,
  onChange,
}: CustomSelectFieldProps) => {
  const CustomSelectIcon = () => {
    const [selectOpen, setSelectOpen] = useState<number | null>(null);

    return selectOpen !== null ? <ArrowBack /> : <ArrowDownward />;
  };
  const selected = options.find((o) => o.label === value);
  return (
    <Select
      value={value}
      onChange={onChange}
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
